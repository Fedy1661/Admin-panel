import {
  UPDATE_TIMESTAMP,
  CHECK_AUTH,
  ERROR_LOGIN,
  BACKUPS_LOADED,
  PAGE_LOADED,
  SET_STATUS_DOM
} from './actions';

const initialState = {
  timestamp: null,
  auth: false,
  loginError: '',
  backups: [],
  pages: [],
  unsavedChanges: false
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case UPDATE_TIMESTAMP:
      return { ...state, timestamp: payload };
    case CHECK_AUTH:
      return { ...state, auth: payload };
    case ERROR_LOGIN:
      return { ...state, loginError: payload };
    case BACKUPS_LOADED:
      return { ...state, backups: payload };
    case PAGE_LOADED:
      return { ...state, pages: payload };
    case SET_STATUS_DOM:
      return { ...state, unsavedChanges: payload };
    // case SET_CURRENT_PAGE:
    //   return { ...state, currentPage: payload };
    default:
      return state;
  }
};
