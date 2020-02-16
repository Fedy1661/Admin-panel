import '../../helpers/iframeLoader.js';
import axios from 'axios';
import React, { Component } from 'react';
import DOMHelper from '../../helpers/dom-helper';
import EditorText from '../editor-text';
import UIkit from 'uikit';
import Spinner from '../spinner';
import ConfrimModal from '../confrim-modal';
import ChooseModal from '../choose-modal/index.js';
import Panel from '../panel/index.js';
import EditorMeta from '../editor-meta';
import EditorImages from '../editor-images';
import Login from '../login';

export default class extends Component {
  constructor() {
    super();
    this.currentPage = 'index.html';
    this.state = {
      pageList: [],
      newPageName: '',
      loading: true,
      backupsList: [],
      auth: false,
      loginError: false,
      loginLengthError: false
    };
    this.virtualDOM = null;
  }
  componentDidMount() {
    this.checkAuth();
    this.init(null, this.currentPage);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.auth !== prevState.auth) {
      this.init(null, this.currentPage);
    }
  }
  checkAuth = () => {
    axios.get('./api/checkAuth.php').then(res => {
      console.log(res);
      this.setState({
        auth: res.data.auth
      });
    });
  };
  login = password => {
    if (password.length > 5) {
      axios.post('./api/login.php', { password }).then(res => {
        console.log(res.data.auth);
        this.setState({
          auth: res.data.auth,
          loginError: !res.data.auth,
          loginLengthError: false
        });
      });
    } else {
      this.setState({
        loginError: false,
        loginLengthError: true
      });
    }
  };
  init = (e, page) => {
    if (e) e.preventDefault();
    if (this.state.auth) {
      this.isLoading();
      this.iframe = document.querySelector('iframe');
      this.open(page);
      this.loadPageList();
      this.loadBackupsList();
    }
  };
  logout = () => {
    axios.get('./api/logout.php').then(() => {
      window.location.replace('/');
    });
  };
  open = page => {
    this.currentPage = page;
console.log(`page ${page}`)
    axios
      .get(`../${page}?rnd=${Math.random()}`)
      .then(res => DOMHelper.parseStrToDOM(res.data))
      .then(DOMHelper.wrapTextNodes)
      .then(DOMHelper.wrapImages)
      .then(dom => {
        this.virtualDOM = dom;
        return dom;
      })
      .then(DOMHelper.serializeDOMToString)
      .then(html => axios.post('./api/saveTempPage.php', { html }))
      .then(() => this.iframe.load('../wemfiwhfwuef992ZZdd.html'))
      .then(() => axios.post('./api/deleteTempPage.php'))
      .then(() => this.enableEditing())
      .then(() => this.injectStyles())
      .then(this.isLoaded);
  };
  save = () => {
    this.isLoading();
    const newDom = this.virtualDOM.cloneNode(this.virtualDOM);
    DOMHelper.unwrapTextNodes(newDom);
    DOMHelper.unwrapImages(newDom);
    const html = DOMHelper.serializeDOMToString(newDom);
    axios
      .post('./api/savePage.php', { pageName: this.currentPage, html })
      .then(() => this.showNotification('Успешно сохранено.', 'success'))
      .catch(() => this.showNotification('Ошибка!..', 'danger'))
      .finally(this.isLoaded)
      .finally(() => this.loadBackupsList());
  };
  injectStyles = () => {
    const style = this.iframe.contentDocument.createElement('style');
    style.innerHTML = `
    text-editor:hover, [editableimgid]:hover {
      outline: 3px solid orange;
      outline-offset: 8px;
    }
    text-editor:focus, [editableimgid]:focus {
      outline: 3px solid red;
      outline-offset: 8px;
    }
    `;
    this.iframe.contentDocument.head.appendChild(style);
  };
  enableEditing = () => {
    this.iframe.contentDocument.body
      .querySelectorAll('text-editor')
      .forEach(element => {
        const id = element.getAttribute('nodeid');
        const virtualElement = this.virtualDOM.body.querySelector(
          `[nodeid="${id}"]`
        );

        new EditorText(element, virtualElement);
      });
    this.iframe.contentDocument.body
      .querySelectorAll('[editableimgid]')
      .forEach(element => {
        const id = element.getAttribute('editableimgid');
        const virtualElement = this.virtualDOM.body.querySelector(
          `[editableimgid="${id}"]`
        );

        new EditorImages(
          element,
          virtualElement,
          this.isLoading,
          this.isLoaded,
          this.showNotification
        );
      });
  };
  loadPageList = () => {
    axios
      .get('./api/pageList.php')
      .then(res => console.log(res));
    this.setState({ newPageName: '' });
  };
  loadBackupsList = () => {
    axios.get('./backups/backups.json').then(res =>
      this.setState({
        backupsList: res.data.filter(backup => backup.page === this.currentPage)
      })
    );
  };
  restoreBackup = (e, backup) => {
    if (e) e.preventDefault();
    UIkit.modal
      .confirm(
        'Вы действительно хотите восстановить страницу из этой резервной копии? Несохранённые данные будут потеряны.',
        { labels: { ok: 'Восстановить', cancel: 'Отмена' } }
      )
      .then(() => {
        this.isLoading();
        return axios.post('./api/restoreBackup.php', {
          page: this.currentPage,
          file: backup
        });
      })
      .then(() => {
        this.open(this.currentPage, this.isLoaded);
      });
  };
  isLoading = () => {
    this.setState({ loading: true });
  };
  isLoaded = () => {
    this.setState({ loading: false });
  };
  showNotification = (message, status) => {
    UIkit.notification({ message, status, pos: 'bottom-right' });
  };
  render() {
    const {
      loading,
      pageList,
      backupsList,
      auth,
      loginError,
      loginLengthError
    } = this.state;
    if (!auth) {
      return (
        <Login
          login={this.login}
          lengthErr={loginLengthError}
          logErr={loginError}
        />
      );
    }
    return (
      <>
        <iframe src="" frameBorder="0"></iframe>

        <input
          id="img-upload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
        />

        <Spinner active={loading} />
        <Panel />
        <ConfrimModal
          text={{
            title: 'Сохранение',
            descr: 'Вы уверены, что хотите сохранить и опубликовать страницу?',
            btn: 'Уверен'
          }}
          target="modal-save"
          method={this.save}
        />
        <ConfrimModal
          text={{
            title: 'Выход',
            descr: 'Вы действительно хотите выйти?',
            btn: 'Выйти'
          }}
          target="modal-logout"
          method={this.logout}
        />
        <ChooseModal target="modal-open" data={pageList} redirect={this.init} />
        <ChooseModal
          target="modal-backup"
          data={backupsList}
          redirect={this.restoreBackup}
        />
        {this.virtualDOM && (
          <EditorMeta target="modal-meta" virtualDOM={this.virtualDOM} />
        )}
      </>
    );
  }
}
