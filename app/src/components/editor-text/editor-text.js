import { setStatusDOM } from '../../actions';

export default class {
  constructor(element, virtualElement, checkStatusDOM) {
    this.element = element;
    this.virtualElement = virtualElement;
    this.element.addEventListener('click', () => this.onClick());
    this.element.addEventListener('blur', () => this.onBlur());
    this.element.addEventListener('keypress', (e) => this.onKeypress(e));
    this.element.addEventListener('change', () => this.onTextEdit());
    if (
      this.element.parentNode.nodeName === 'A' ||
      this.element.parentNode.nodeName === 'BUTTON'
    ) {
      this.element.addEventListener('contextmenu', (e) => this.onCtxMenu(e));
    }
    this.checkStatusDOM = checkStatusDOM;
  }
  onCtxMenu(e) {
    e.preventDefault();
    this.onClick();
  }
  onKeypress = (e) => {
    if (e.keyCode === 13) {
      this.onBlur();
    }
  };
  onClick = () => {
    this.element.contentEditable = 'true';
    this.element.focus();
  };
  onBlur = () => {
    if (this.virtualElement.innerHTML !== this.element.innerHTML) {
      this.virtualElement.innerHTML = this.element.innerHTML;
      this.checkStatusDOM();
    }
    this.element.removeAttribute('contenteditable');
  };
  onTextEdit = () => {
    this.virtualElement.innerHTML = this.element.innerHTML;
  };
}
