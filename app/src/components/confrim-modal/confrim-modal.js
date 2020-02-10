import React from 'react';

export default ({ target, method, text }) => {
  return (
    <div id={target} className="uk-flex-top" uk-modal="true">
      <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
        <div className="uk-modal-header">
          <h2 className="uk-modal-title uk-text-center">{text.title}</h2>
        </div>
        <p className="uk-text-center">{text.descr}</p>
        <p className="uk-text-center">
          <button
            className="uk-button uk-button-default uk-modal-close uk-margin-small-right"
            type="button"
          >
            Нет
          </button>
          <button
            onClick={() => method()}
            className="uk-button uk-modal-close uk-button-primary"
            type="button"
          >
            {text.btn}
          </button>
        </p>
      </div>
    </div>
  );
};
