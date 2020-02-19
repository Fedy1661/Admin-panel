import React, { useState, useEffect } from 'react';
import axios from 'axios';
import showNotification from '../../helpers/showNotification';
import deleteImage from '../../img/delete.png';
import editImage from '../../img/edit.png';
import UIkit from 'uikit';

export default ({ target, data, redirect, open, notFound }) => {
  const [info, setInfo] = useState(data);
  useEffect(() => {
    setInfo(data);
  }, [data]);
  const list = info.map((item) => {
    if (item.date) {
      const title = (
        <div
          uk-tooltip={`title: Дата создания: <br>${item.date};
           duration: 450; animation: uk-animation-fade`}
        >
          {item.name}
        </div>
      );
      return (
        <li className="list-item" key={item.file}>
          <a
            onClick={(e) => redirect(e, item.file)}
            className="uk-link-muted uk-modal-close uk-text-bold"
            href="#"
          >
            {title}
          </a>
          <div
            className="icon delete"
            onClick={() =>
              axios
                .post('./api/deleteBackup.php', { fileName: item.file })
                .then((res) => {
                  setInfo(res.data);
                  showNotification('Успешно удалено.', 'warning');
                })
                .catch(() => showNotification('Ошибка!..', 'danger'))
            }
          >
            <img src={deleteImage} alt="delete" />
          </div>
          <div
            className="icon edit"
            onClick={() =>
              UIkit.modal.prompt('Название:', item.name).then((newName) =>
                axios
                  .post('./api/changeNameBackup.php', {
                    fileName: item.file,
                    newName
                  })
                  .then((res) => setInfo(res.data))
              )
            }
          >
            <img src={editImage} alt="edit" />
          </div>
        </li>
      );
    } else {
      return (
        <li key={item}>
          <a
            onClick={(e) => redirect(e, item)}
            className="uk-link-muted uk-modal-close"
            href="#"
          >
            {item.match(/[..\/]+(.*)/)[1]}
          </a>
        </li>
      );
    }
  });
  const message =
    info.length < 1 ? <div className="uk-text-center">{notFound}</div> : null;
  return (
    <div
      id={target}
      className={
        `uk-flex-top ` + (open !== undefined ? 'uk-modal uk-flex uk-open' : '')
      }
      uk-modal="true"
    >
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
