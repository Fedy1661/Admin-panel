import React from 'react';

export default () => {
  return (
    <div className="panel">
      <button
        uk-toggle="target: #modal-backup"
        className="uk-button uk-button-default uk-margin-small-right"
      >
        Восстановить
      </button>
      <button
        uk-toggle="target: #modal-open"
        className="uk-button uk-button-primary uk-margin-small-right"
      >
        Открыть
      </button>
      <button
        uk-toggle="target: #modal-save"
        className="uk-button uk-button-primary uk-margin-small-right"
      >
        Сохранить
      </button>
      <button
        uk-toggle="target: #modal-meta"
        className="uk-button uk-button-primary uk-margin-small-right"
      >
        Редактировать META
      </button>
      <button
        uk-toggle="target: #modal-logout"
        className="uk-button uk-button-danger"
      >
        Выход
      </button>
    </div>
  );
};
