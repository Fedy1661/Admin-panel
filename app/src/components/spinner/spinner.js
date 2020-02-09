import React from 'react';

export default ({ active }) => {
  return (
    <div className={active ? 'spinner active' : 'spinner'}>
      <div uk-spinner="ratio: 3"></div>
    </div>
  );
};
