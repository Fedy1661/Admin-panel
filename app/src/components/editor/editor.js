import '../../helpers/iframeLoader.js';
import axios from 'axios';
import React, { Component } from 'react';
import DOMHelper from '../../helpers/dom-helper';
import EditorText from '../editor-text';
import UIkit from 'uikit';
import Spinner from '../spinner';
import ConfrimModal from '../confrim-modal';
import ChooseModal from '../choose-modal/index.js';

export default class extends Component {
  constructor() {
    super();
    this.currentPage = 'index.html';
    this.state = {
      pageList: [],
      newPageName: '',
      loading: true
    };
    this.createNewPage = this.createNewPage.bind(this);
    this.virtualDOM = null;
    this.isLoaded = this.isLoaded.bind(this);
    this.isLoading = this.isLoading.bind(this);
    this.save = this.save.bind(this);
    this.init = this.init.bind(this);
  }

  componentDidMount() {
    this.init(null, this.currentPage);
  }
  init(e, page) {
    if (e) e.preventDefault();
    this.isLoading();
    this.iframe = document.querySelector('iframe');
    this.open(page);
    this.loadPageList();
  }
  open(page) {
    this.currentPage = page;

    axios
      .get(`../${page}?rnd=${Math.random()}`)
      .then(res => DOMHelper.parseStrToDOM(res.data))
      .then(DOMHelper.wrapTextNodes)
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
    // this.iframe.load(this.currentPage, () => {

    // });
  }

  save(onSuccess, onError) {
    this.isLoading();
    const newDom = this.virtualDOM.cloneNode(this.virtualDOM);
    DOMHelper.unwrapTextNodes(newDom);
    const html = DOMHelper.serializeDOMToString(newDom);
    axios
      .post('./api/savePage.php', { pageName: this.currentPage, html })
      .then(onSuccess)
      .catch(onError)
      .finally(this.isLoaded);
  }
  injectStyles() {
    const style = this.iframe.contentDocument.createElement('style');
    style.innerHTML = `
    text-editor:hover {
      outline: 3px solid orange;
      outline-offset: 8px;
    }
    text-editor:focus {
      outline: 3px solid red;
      outline-offset: 8px;
    }
    `;
    this.iframe.contentDocument.head.appendChild(style);
  }
  enableEditing() {
    this.iframe.contentDocument.body
      .querySelectorAll('text-editor')
      .forEach(element => {
        const id = element.getAttribute('nodeid');
        const virtualElement = this.virtualDOM.body.querySelector(
          `[nodeid="${id}"]`
        );

        new EditorText(element, virtualElement);
      });
  }

  loadPageList() {
    axios
      .get('./api/pageList.php')
      .then(res => this.setState({ pageList: res.data }));
    this.setState({ newPageName: '' });
  }
  createNewPage() {
    axios
      .post('./api/createNewPage.php', { name: this.state.newPageName })
      .then(this.loadPageList())
      .catch(() => alert('Старница уже существует'));
  }
  deletePage(page) {
    axios
      .post('./api/deletePage.php', { name: page })
      .then(this.loadPageList())
      .catch(() => alert('Страницы не существует!'));
  }
  isLoading() {
    this.setState({ loading: true });
  }
  isLoaded() {
    this.setState({ loading: false });
  }
  render() {
    const { loading, pageList } = this.state;
    return (
      <>
        <iframe src="" frameBorder="0"></iframe>

        <Spinner active={loading} />

        <div className="panel">
          <button
            uk-toggle="target: #modal-open"
            className="uk-button uk-button-primary uk-margin-small-right"
          >
            Открыть
          </button>
          <button
            uk-toggle="target: #modal-save"
            className="uk-button uk-button-primary"
          >
            Сохранить
          </button>
        </div>
        <ConfrimModal target="modal-save" method={this.save} />
        <ChooseModal target="modal-open" data={pageList} redirect={this.init} />
      </>
    );
  }
}
