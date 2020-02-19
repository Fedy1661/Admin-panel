import UIkit from 'uikit';

export default (message, status) => {
  UIkit.notification({
    message,
    status,
    pos: 'bottom-right'
  });
};
