import React, { useState } from 'react';
export default props => {
  const [password, setPassword] = useState();
  const onPasswordChange = e => {
    setPassword(e.target.value);
  };

  const { login, lengthErr, logErr } = props;

  return (
    <div className="login-container">
      <div className="login">
        <h2 className="uk-modal-title uk-text-center">Авторизация</h2>
        <div className="uk-margin-top uk-text-lead">Пароль:</div>
        <input
          type="password"
          className="uk-input uk-margin-top"
          placeholder="Пароль"
          value={password}
          onChange={onPasswordChange}
        />
        {logErr && <span className="login-error">Введен неверный пароль</span>}
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
};
