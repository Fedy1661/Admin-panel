import React from 'react';

export default ({ target, method, text, redirectToModal = false }) => {
  return (
    <div id={target} className="uk-flex-top" uk-modal="true">
      <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
        <div className="uk-modal-header">
          <h2 className="uk-modal-title uk-text-center">{text.title}</h2>
        </div>
        <p className="uk-text-center">{text.descr}</p>
        <p className="uk-text-center">
          <button
            {...(redirectToModal
              ? { 'uk-toggle': `target: #${redirectToModal}` }
              : {})}
            className={`uk-button uk-button-default uk-margin-small-right ${
              redirectToModal === false ? 'uk-modal-close' : ''
            }`}
            type="button"
          >
            Нет
          </button>
          <button
            {...(redirectToModal
              ? { 'uk-toggle': `target: #${redirectToModal}` }
              : {})}
            onClick={() => method()}
            className={`uk-button uk-button-primary ${
              redirectToModal === false ? 'uk-modal-close' : ''
            }`}
            type="button"
          >
            {text.btn}
          </button>
        </p>
      </div>
    </div>
  );
};
