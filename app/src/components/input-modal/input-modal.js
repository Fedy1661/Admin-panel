import React, { Component } from 'react';
export default class extends Component {
  state = {
    title: '',
    date: null
  };

  componentDidUpdate(prevProps) {
    if (this.props.timestamp !== prevProps.timestamp) {
      this.init();
    }
  }
  init = () => {
    const timestamp = new Date(this.props.timestamp);
    const date = {
      hours: timestamp.getHours(),
      minutes: timestamp.getMinutes(),
      seconds: timestamp.getSeconds(),
      day: timestamp.getDate(),
      month: timestamp.getMonth(),
      year: timestamp.getFullYear()
    };
    for (const key in date) {
      let num = date[key];
      if (('' + num).length < 2) num = '0' + num;
      date[key] = num;
    }
    const dateFormat = `${date.hours}:${date.minutes}:${date.seconds} ${date.day}.${date.month}.${date.year}`;
    this.setState({
      title: `Резерв. от ${dateFormat}`,
      date: dateFormat,
      timestamp: +timestamp
    });
  };
  pushValues = () => {
    const { title, date } = this.state;
    const { timestamp } = this.props;
    this.props.create(title, date, timestamp);
  };

  onValueChange = e => {
    e.persist();
    this.setState({ title: e.target.value });
  };
  render() {
    const { title } = this.state;
    return (
      <div id="modal-backup-create" className="uk-flex-top" uk-modal="true">
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
          <div className="uk-modal-header">
            <h2 className="uk-modal-title uk-text-center">BACKUP</h2>

            <div className="uk-margin">
              <input
                data-type="title"
                className="uk-input"
                type="text"
                placeholder="Title"
                onChange={this.onValueChange}
                value={title}
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
              Создать
            </button>
          </p>
        </div>
      </div>
    );
  }
}
