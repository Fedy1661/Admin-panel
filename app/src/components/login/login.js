import React, { useState } from 'react';
import { connect } from 'react-redux';
import { fetchCheckLogin } from '../../actions';
import { bindActionCreators } from 'redux';
const Login = (props) => {
  const [password, setPassword] = useState();
  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const { fetchCheckLogin, loginError } = props;
  return (
    <div className="login-container">
      <div className="login">
        <h2 className="uk-modal-title uk-text-center">Авторизация</h2>
        <div className="uk-margin-top uk-text-lead">Пароль:</div>
        <input
          type="password"
          className="uk-input uk-margin-top"
          placeholder="Пароль"
          onChange={onPasswordChange}
        />
        {loginError && <span className="login-error">{loginError}</span>}
        <button
          onClick={() => fetchCheckLogin(password)}
          className="uk-button uk-button-primary uk-margin-top"
          type="button"
        >
          Вход
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = ({ loginError }) => ({ loginError });
const mapDispathToProps = (dispatch) =>
  bindActionCreators({ fetchCheckLogin }, dispatch);

export default connect(mapStateToProps, mapDispathToProps)(Login);
