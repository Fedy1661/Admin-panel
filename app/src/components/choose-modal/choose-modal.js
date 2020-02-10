import React from 'react';

export default ({ target, data, redirect }) => {
  const list = data.map(item => {
    if (item.time) {
      return (
        <li key={item.file}>
          <a
            onClick={e => redirect(e, item.file)}
            className="uk-link-muted uk-modal-close"
            href="#"
          >
            Резерв. от {item.time}
          </a>
        </li>
      );
    } else {
      return (
        <li key={item}>
          <a
            onClick={e => redirect(e, item)}
            className="uk-link-muted uk-modal-close"
            href="#"
          >
            {item}
          </a>
        </li>
      );
    }
  });
  const message =
    data.length < 1 ? (
      <div className="uk-text-center">Резервные копии не найдены :(</div>
    ) : null;
  return (
    <div id={target} className="uk-flex-top" uk-modal="true">
      <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
        <div className="uk-modal-header">
          <h2 className="uk-modal-title uk-text-center">Открыть</h2>
          {message}
          <ul className="uk-list uk-list-divider">{list}</ul>
        </div>
        <p className="uk-text-center">
          <button
            className="uk-button uk-button-default uk-modal-close uk-margin-small-right"
            type="button"
          >
            Нет
          </button>
        </p>
      </div>
    </div>
  );
};
