import React from 'react';

export const Record = ({
  modal,
  children,
  onClick,
  disabled,
  color = 'default',
  handlePanel,
  canDisable = true
}) => {
  return (
    <button
      uk-toggle={`target: #${modal}`}
      className={`uk-button uk-button-${color} uk-margin-small-right panel__button`}
      disabled={canDisable ? disabled : false}
      onClick={() => {
        handlePanel();
        typeof onClick === 'function' ? onClick() : null;
      }}
    >
      {children}
    </button>
  );
};

export default ({ disabled, children }) => {
  let panel;
  let hamburger;
  const handlePanel = () => {
    hamburger.classList.toggle('hamburger_active');
    panel.classList.toggle('panel_active');
  };
  return (
    <nav className="navbar">
      <div className="panel" ref={(el) => (panel = el)}>
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, { disabled, handlePanel });
        })}
      </div>
      <div
        className="hamburger"
        onClick={handlePanel}
        ref={(el) => (hamburger = el)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};
