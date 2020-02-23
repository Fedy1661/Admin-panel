import axios from 'axios';

// export const ... = () => ({type: ...})
export const UPDATE_TIMESTAMP = 'UPDATE_TIMESTAMP';
export const CHECK_AUTH = 'CHECK_AUTH';
export const CHECK_LOGIN = 'CHECK_LOGIN';
export const ERROR_LOGIN = 'ERROR_LOGIN';
export const BACKUPS_LOADED = 'BACKUPS_LOADED';
export const PAGE_LOADED = 'PAGE_LOADED';
export const SET_STATUS_DOM = 'SET_STATUS_DOM';
// export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
// =================================================

export const setStatusDOM = (payload) => ({ type: SET_STATUS_DOM, payload });

export const updateTimestamp = () => ({
  type: UPDATE_TIMESTAMP,
  payload: +new Date()
});
export const checkAuth = (payload) => ({
  type: CHECK_AUTH,
  payload
});
export const errorLogin = (payload) => ({
  type: ERROR_LOGIN,
  payload
});
export const backupsLoaded = (payload) => ({
  type: BACKUPS_LOADED,
  payload
});
export const pageLoaded = (payload) => ({
  type: PAGE_LOADED,
  payload
});

export const fetchPages = () => (dispatch) => {
  axios.get('./api/pageList.php').then((res) => dispatch(pageLoaded(res.data)));
};
export const fetchBackups = (page) => (dispatch) => {
  axios
    .get('./api/getBackups.php')
    .then((res) => {
      dispatch(
        backupsLoaded(res.data.filter((backup) => backup.page === page))
      );
    })
    .catch(() => {});
};
export const fetchCheckAuth = () => (dispatch) => {
  axios
    .get('./api/checkAuth.php')
    .then((res) => dispatch(checkAuth(res.data.auth)));
};
export const fetchCheckLogin = (password) => (dispatch) => {
  if (password.length > 5) {
    axios.post('./api/login.php', { password }).then((res) => {
      dispatch(checkAuth(res.data.auth));
      dispatch(errorLogin(!res.data.auth ? 'Введен неверный пароль' : ''));
      window.scrollTo(0, 0);
    });
  } else {
    dispatch(errorLogin('Пароль должен быть длиннее 5 символов'));
  }
};
