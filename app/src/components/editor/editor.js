import '../../helpers/iframeLoader.js';
import axios from 'axios';
import React, { Component } from 'react';
import DOMHelper from '../../helpers/dom-helper';
import EditorText from '../editor-text';
import UIkit from 'uikit';
import Spinner from '../spinner';
import ConfrimModal from '../confrim-modal';
import ChooseModal from '../choose-modal/index.js';
import Panel, { Record } from '../panel/index.js';
import EditorMeta from '../editor-meta';
import EditorImages from '../editor-images';
import Login from '../login';
import { dirname } from 'path';
import InputModal from '../input-modal';
import showNotification from '../../helpers/showNotification.js';

export default class extends Component {
  currentPage = null;
  virtualDOM = null;
  startDOM = null;
  state = {
    pageList: [],
    newPageName: '',
    loading: true,
    backupsList: [],
    auth: false,
    loginError: false,
    loginLengthError: false,
    timestamp: null
  };
  componentDidMount() {
    this.checkAuth();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.auth !== prevState.auth) {
      this.init(null, this.currentPage);
    }
  }
  checkAuth = () => {
    axios.get('./api/checkAuth.php').then((res) => {
      this.setState({
        auth: res.data.auth
      });
    });
  };
  login = (password) => {
    if (password.length > 5) {
      axios.post('./api/login.php', { password }).then((res) => {
        this.setState({
          auth: res.data.auth,
          loginError: !res.data.auth,
          loginLengthError: false
        });
        window.scrollTo(0, 0);
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
    const match = dirname(this.currentPage).match(/^(..\/)+([^\s]*)$/);
    const path = '/' + (match !== null ? match[0] : '');
    axios.get('./api/logout.php').then(() => {
      window.location.replace(path);
    });
  };
  open = (page) => {
    this.currentPage = page;
    if (page !== null) {
      axios
        .get(`${page}?rnd=${Math.random()}`)
        .then((res) => DOMHelper.parseStrToDOM(res.data))
        .then(DOMHelper.wrapTextNodes)
        .then(DOMHelper.wrapImages)
        .then((dom) => {
          this.virtualDOM = this.startDOM = dom;
          return dom;
        })
        .then(DOMHelper.serializeDOMToString)
        .then((html) =>
          axios.post('./api/saveTempPage.php', { html, path: dirname(page) })
        )
        .then(() =>
          this.iframe.load(`${dirname(page)}/wemfiwhfwuef992ZZdd.html`)
        )
        .then(() =>
          axios.post('./api/deleteTempPage.php', {
            path: dirname(page)
          })
        )
        .then(() => this.enableEditing())
        .then(() => this.injectStyles())
        .then(this.isLoaded);
    } else {
      this.isLoaded();
    }
  };
  fileTransfer = (file, data = {}, loadBackupsList = false) => {
    this.isLoading();
    const newDom = this.virtualDOM.cloneNode(this.virtualDOM);
    // const oldDom = this.startDOM.cloneNode(this.startDOM);
    // console.log(this.virtualDOM === this.startDOM);
    // console.log(newDom === oldDom);
    // console.log(this.virtualDOM);
    // console.log(this.startDOM.cloneNode(this.startDOM));
    DOMHelper.unwrapTextNodes(newDom);
    DOMHelper.unwrapImages(newDom);
    const html = DOMHelper.serializeDOMToString(newDom);
    data.html = html;
    data.pageName = this.currentPage;
    axios
      .post(`./api/${file}`, data)
      .then(() => showNotification('Успешно сохранено.', 'success'))
      .catch(() => showNotification('Ошибка!..', 'danger'))
      .finally(this.isLoaded)
      .finally(loadBackupsList ? this.loadBackupsList : null);
  };
  createBackup = (title, date, timestamp) => {
    const data = {
      title,
      date,
      timestamp
    };
    this.fileTransfer('createBackup.php', data, true);
  };
  save = () => {
    this.fileTransfer('savePage.php');
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
      .forEach((element) => {
        const id = element.getAttribute('nodeid');
        const virtualElement = this.virtualDOM.body.querySelector(
          `[nodeid="${id}"]`
        );

        new EditorText(element, virtualElement);
      });
    this.iframe.contentDocument.body
      .querySelectorAll('[editableimgid]')
      .forEach((element) => {
        const id = element.getAttribute('editableimgid');
        const virtualElement = this.virtualDOM.body.querySelector(
          `[editableimgid="${id}"]`
        );
        new EditorImages(
          element,
          virtualElement,
          dirname(this.currentPage),
          this.isLoading,
          this.isLoaded,
          showNotification
        );
      });
  };
  loadPageList = () => {
    axios
      .get('./api/pageList.php')
      .then((res) => this.setState({ pageList: res.data }));
    this.setState({ newPageName: '' });
  };
  loadBackupsList = () => {
    axios
      .get('./api/getBackups.php')
      .then((res) => {
        this.setState({
          backupsList: res.data.filter(
            (backup) => backup.page === this.currentPage
          )
        });
      })
      .catch(() => {});
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

  updateTimestamp = () => {
    this.setState({ timestamp: +new Date() });
  };
  render() {
    const {
      loading,
      pageList,
      backupsList,
      auth,
      loginError,
      loginLengthError,
      timestamp
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
        <Panel disabled={this.currentPage === null ? true : false}>
          <Record modal="modal-backup-create" onClick={this.updateTimestamp}>
            Backup
          </Record>
          <Record modal="modal-backup">Восстановить</Record>
          <Record modal="modal-open" canDisable={false} color="primary">
            Открыть
          </Record>
          <Record modal="modal-save" color="primary">
            Сохранить
          </Record>
          <Record modal="modal-meta">Редактировать META</Record>
          <Record modal="modal-logout" color="danger" canDisable={false}>
            Выход
          </Record>
        </Panel>
        <InputModal timestamp={timestamp} create={this.createBackup} />
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
            descr: (
              <>
                Вы действительно хотите выйти?
                <br />
                <span className="uk-text-danger">
                  НЕСОХРАНЁННЫЕ ДАННЫЕ БУДУТ УДАЛЕНЫ!!
                </span>
              </>
            ),
            btn: 'Выйти'
          }}
          target="modal-logout"
          method={this.logout}
        />
        <ChooseModal
          target="modal-open"
          data={pageList}
          redirect={this.init}
          notFound="Страницы не найдены.."
        />
        <ChooseModal
          target="modal-backup"
          data={backupsList}
          redirect={this.restoreBackup}
          notFound="Резервные копии не найдены :("
        />
        <EditorMeta
          virtualDOM={this.virtualDOM === null ? false : this.virtualDOM}
        />
      </>
    );
  }
}
