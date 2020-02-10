import React, { Component } from 'react';
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meta: {
        title: '',
        keywords: '',
        description: ''
      }
    };
    this.applyMeta = this.applyMeta.bind(this);
  }

  componentDidMount() {
    this.getMeta(this.props.virtualDOM);
  }

  getMeta(virtualDOM) {
    this.title =
      virtualDOM.head.querySelector('title') ||
      virtualDOM.head.appendChild(virtualDOM.createElement('title'));
    this.keywords = virtualDOM.head.querySelector("meta[name='keywords']");
    if (!this.keywords) {
      this.keywords = virtualDOM.head.appendChild(
        virtualDOM.createElement('meta')
      );
      this.keywords.setAttribute('name', 'keywords');
      this.keywords.setAttribute('content', '');
    }
    this.description = virtualDOM.head.querySelector(
      "meta[name='description']"
    );
    if (!this.description) {
      this.description = virtualDOM.head.appendChild(
        virtualDOM.createElement('meta')
      );
      this.description.setAttribute('name', 'description');
      this.description.setAttribute('content', '');
    }
    this.setState({
      meta: {
        title: this.title.innerHTML,
        keywords: this.keywords.getAttribute('content'),
        description: this.description.getAttribute('content')
      }
    });
  }

  applyMeta() {
    this.title.innerHTML = this.state.meta.title;
    this.keywords.setAttribute('content', this.state.meta.keywords);
    this.description.setAttribute('content', this.state.meta.description);
  }
  onValueChange(e) {
    const type = e.target.getAttribute('data-type');
    e.persist();
    this.setState(({ meta }) => ({
      meta: {
        ...meta,
        [type]: e.target.value
      }
    }));
  }
  componentDidUpdate(prevProps) {
    if (this.props.virtualDOM !== prevProps.virtualDOM) {
      this.getMeta(this.props.virtualDOM);
    }
  }
  render() {
    const { target } = this.props;
    const { title, keywords, description } = this.state.meta;
    return (
      <div id={target} className="uk-flex-top" uk-modal="true">
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
          <div className="uk-modal-header">
            <h2 className="uk-modal-title uk-text-center">
              Редактирование МЕТА-тэгов
            </h2>

            <form>
              <div className="uk-margin">
                <input
                  data-type="title"
                  className="uk-input"
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={e => this.onValueChange(e)}
                />
              </div>
              <div className="uk-margin">
                <textarea
                  data-type="keywords"
                  className="uk-textarea"
                  rows="5"
                  placeholder="Keywords"
                  value={keywords}
                  onChange={e => this.onValueChange(e)}
                ></textarea>
              </div>
              <div className="uk-margin">
                <textarea
                  data-type="description"
                  className="uk-textarea"
                  rows="5"
                  placeholder="Description"
                  value={description}
                  onChange={e => this.onValueChange(e)}
                ></textarea>
              </div>
            </form>
          </div>
          <p className="uk-text-center">
            <button
              className="uk-button uk-button-default uk-modal-close uk-margin-small-right"
              type="button"
            >
              Отменить
            </button>
            <button
              className="uk-button uk-modal-close uk-button-primary"
              type="button"
              onClick={this.applyMeta}
            >
              Применить
            </button>
          </p>
        </div>
      </div>
    );
  }
}
