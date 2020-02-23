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
import {
  updateTimestamp,
  fetchCheckAuth,
  fetchBackups,
  fetchPages,
  setStatusDOM
} from '../../actions.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class App extends Component {
  currentPage = null;
  virtualDOM = null;
  untouchedDOM = null;
  state = {
    loading: true,
    nextModal: null
  };
  componentDidMount() {
    this.props.fetchCheckAuth();
  }
  componentDidUpdate(prevProps) {
    if (this.props.auth !== prevProps.auth) {
      this.init(null, this.currentPage);
    }
  }
  login = (password) => {
    this.props.fetchCheckLogin(password);
  };
  init = (e, page) => {
    if (e) e.preventDefault();
    if (this.props.auth) {
      this.isLoading();
      this.iframe = document.querySelector('iframe');
      this.open(page);
      this.props.fetchPages();
      this.props.fetchBackups(this.currentPage);
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
          this.virtualDOM = dom;
          this.untouchedDOM = DOMHelper.serializeDOMToString(dom);
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
    DOMHelper.unwrapTextNodes(newDom);
    DOMHelper.unwrapImages(newDom);
    const html = DOMHelper.serializeDOMToString(newDom);
    data.html = html;
    data.pageName = this.currentPage;
    axios
      .post(`./api/${file}`, data)
      .then(() => {
        this.untouchedDOM = DOMHelper.serializeDOMToString(this.virtualDOM);
        this.checkStatusDOM();
        showNotification('Успешно сохранено.', 'success');
      })
      .catch(() => showNotification('Ошибка!..', 'danger'))
      .finally(this.isLoaded)
      .finally(
        loadBackupsList ? () => this.props.fetchBackups(this.currentPage) : null
      );
  };
  createBackup = (title, { date, timestamp }) => {
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

        new EditorText(element, virtualElement, this.checkStatusDOM);
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
          this.checkStatusDOM
        );
      });
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

  getFormatData = () => {
    const { timestamp } = this.props;
    if (timestamp !== null) {
      const time = new Date(timestamp);
      const date = {
        hours: time.getHours(),
        minutes: time.getMinutes(),
        seconds: time.getSeconds(),
        day: time.getDate(),
        month: time.getMonth(),
        year: time.getFullYear()
      };
      for (const key in date) {
        let num = date[key];
        if (('' + num).length < 2) num = '0' + num;
        date[key] = num;
      }
      return `${date.hours}:${date.minutes}:${date.seconds} ${date.day}.${date.month}.${date.year}`;
    }
    return '';
  };
  checkStatusDOM = () => {
    if (this.untouchedDOM === null) return;
    const status = !!(
      this.untouchedDOM === DOMHelper.serializeDOMToString(this.virtualDOM)
    );
    this.props.setStatusDOM(!status);
  };

  setNextModal = (nextModal) => this.setState({ nextModal });

  render() {
    const { loading } = this.state;
    const { timestamp, auth, backups, pages } = this.props;
    const formatData = this.getFormatData();

    if (!auth) return <Login />;

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
        <Panel
          disabled={this.currentPage === null ? true : false}
          setActiveModal={this.setNextModal}
        >
          <Record
            modal="modal-backup-create"
            onClick={this.props.updateTimestamp}
          >
            Backup
          </Record>
          <Record modal="modal-backup" checkUnsavedChanges={true}>
            Восстановить
          </Record>
          <Record
            modal="modal-open"
            checkUnsavedChanges={true}
            canDisable={false}
            color="primary"
          >
            Открыть
          </Record>
          <Record modal="modal-save" color="primary">
            Сохранить
          </Record>
          <Record modal="modal-meta">Редактировать META</Record>
          <Record
            checkUnsavedChanges={true}
            modal="modal-logout"
            color="danger"
            canDisable={false}
          >
            Выход
          </Record>
        </Panel>
        <ConfrimModal
          text={{
            title: 'Сохранение',
            descr: 'Имеются несохранённые изменения. Хотите сохранить?',
            btn: 'Сохранить'
          }}
          target="modal-unsave"
          redirectToModal={this.state.nextModal}
          method={this.save}
        />
        <InputModal
          title="BACKUP"
          target="modal-backup-create"
          value={`Резерв. от ${formatData}`}
          func={this.createBackup}
          data={{ date: formatData, timestamp }}
        />
        <ConfrimModal
          text={{
            title: 'Сохранение',
            descr: 'Вы уверены, что хотите сохранить и опубликовать страницу?',
            btn: 'Уверен(a)'
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
          data={pages}
          redirect={this.init}
          notFound="Страницы не найдены.."
        />
        <ChooseModal
          target="modal-backup"
          data={backups}
          redirect={this.restoreBackup}
          notFound="Резервные копии не найдены :("
        />
        <EditorMeta
          virtualDOM={this.virtualDOM === null ? false : this.virtualDOM}
          checkStatusDOM={this.checkStatusDOM}
        />
      </>
    );
  }
}

const mapStateToProps = ({ timestamp, auth, backups, pages }) => ({
  timestamp,
  auth,
  backups,
  pages
});
const mapDispathToProps = (dispatch) => {
  return bindActionCreators(
    {
      updateTimestamp,
      fetchCheckAuth,
      fetchBackups,
      fetchPages,
      setStatusDOM
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispathToProps)(App);
