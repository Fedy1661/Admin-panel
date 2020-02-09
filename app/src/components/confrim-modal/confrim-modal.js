import React from 'react';
import UIkit from 'uikit';

export default ({ target, method }) => {
  return (
    <div id={target} className="uk-flex-top" uk-modal="true">
      <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
        <div className="uk-modal-header">
          <h2 className="uk-modal-title uk-text-center">Сохранение</h2>
        </div>
        <p className="uk-text-center">
          Вы уверены, что хотите сохранить и опубликовать страницу?
        </p>
        <p className="uk-text-center">
          <button
            className="uk-button uk-button-default uk-modal-close uk-margin-small-right"
            type="button"
          >
            Нет
          </button>
          <button
            onClick={() =>
              method(
                () =>
                  UIkit.notification({
                    message: 'Успешно сохранено.',
                    status: 'success',
                    pos: 'bottom-right'
                  }),
                () =>
                  UIkit.notification({
                    message: 'Ошибка!..',
                    status: 'danger',
                    pos: 'bottom-right'
                  })
              )
            }
            className="uk-button uk-modal-close uk-button-primary"
            type="button"
          >
            Уверен
          </button>
        </p>
      </div>
    </div>
  );
};
