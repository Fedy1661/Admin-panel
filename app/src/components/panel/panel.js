import React from 'react';
import { connect } from 'react-redux';

export const Record = ({
  modal,
  children,
  onClick,
  disabled,
  handlePanel,
  unsavedChanges,
  setActiveModal,
  color = 'default',
  checkUnsavedChanges = false,
  canDisable = true
}) => {
  return (
    <button
      uk-toggle={
        checkUnsavedChanges && unsavedChanges
          ? `target: #modal-unsave`
          : `target: #${modal}`
      }
      className={`uk-button uk-button-${color} uk-margin-small-right panel__button`}
      disabled={canDisable ? disabled : false}
      onClick={() => {
        if (checkUnsavedChanges && unsavedChanges) setActiveModal(modal);
        handlePanel();
        typeof onClick === 'function' ? onClick() : null;
      }}
    >
      {children}
    </button>
  );
};

const panel = ({ disabled, children, unsavedChanges, setActiveModal }) => {
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
          return React.cloneElement(child, {
            disabled,
            handlePanel,
            unsavedChanges,
            setActiveModal
          });
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

const mapStateToProps = ({ unsavedChanges }) => ({ unsavedChanges });

export default connect(mapStateToProps)(panel);
