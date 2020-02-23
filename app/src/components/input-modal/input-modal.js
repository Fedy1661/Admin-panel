import React, { Component } from 'react';
export default class extends Component {
  state = {
    value: ''
  };

  componentDidUpdate(prevProps) {
    if (this.props.data.timestamp !== prevProps.data.timestamp) {
      this.setState({ value: this.props.value });
    }
  }
  pushValues = () => {
    const { value } = this.state;
    const { data } = this.props;
    this.props.func(value, data);
  };

  onValueChange = (e) => {
    e.persist();
    this.setState({ value: e.target.value });
  };
  render() {
    const { value } = this.state;
    const { title, target } = this.props;
    return (
      <div id={target} className="uk-flex-top" uk-modal="true" bg-close="false">
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
          <div className="uk-modal-header">
            <h2 className="uk-modal-title uk-text-center">{title}</h2>

            <div className="uk-margin">
              <input
                data-type="title"
                className="uk-input"
                type="text"
                placeholder="Title"
                onChange={this.onValueChange}
                value={value}
              />
            </div>
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
              onClick={this.pushValues}
            >
              Применить
            </button>
          </p>
        </div>
      </div>
    );
  }
}
