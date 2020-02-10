import React, { Component } from 'react';
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: ''
    };
  }

  onPasswordChange(e) {
    this.setState({
      password: e.target.value
    });
  }

  render() {
    const { password } = this.state;
    const { login, lengthErr, logErr } = this.props;

    return (
      <div className="login-container">
        <div className="login">
          <h2 className="uk-modal-title uk-text-center">Авторизация</h2>
          <div className="uk-margin-top uk-text-lead">Пароль:</div>
          <input
            type="password"
            name=""
            id=""
            className="uk-input uk-margin-top"
            placeholder="Пароль"
            value={password}
            onChange={e => this.onPasswordChange(e)}
          />
          {logErr && (
            <span className="login-error">Введен неверный пароль</span>
          )}
          {lengthErr && (
            <span className="login-error">
              Пароль должен быть длиннее 5 символов
            </span>
          )}
          <button
            onClick={() => login(password)}
            className="uk-button uk-button-primary uk-margin-top"
            type="button"
          >
            Вход
          </button>
        </div>
      </div>
    );
  }
}
