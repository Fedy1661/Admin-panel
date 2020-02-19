import axios from 'axios';
import showNotification from '../../helpers/showNotification';

export default class {
  constructor(
    element,
    virtualElement,
    path,
    ...[isLoading, isLoaded, showNotification]
  ) {
    this.element = element;
    this.virtualElement = virtualElement;
    this.path = path;

    this.element.addEventListener('click', () => this.onClick());
    this.imgUploader = document.querySelector('#img-upload');
    this.isLoading = isLoading;
    this.isLoaded = isLoaded;
  }
  onChange = () => {
    if (this.imgUploader.files && this.imgUploader.files[0]) {
      let formData = new FormData();
      formData.append('image', this.imgUploader.files[0]);
      formData.append('path', this.path);
      this.isLoading();
      axios
        .post('./api/uploadImage.php', formData, {
          headers: {
            'Content-type': 'multipart/form-data'
          }
        })
        .then((res) => {
          this.virtualElement.src = this.element.src = `${this.path}/img/${res.data}`;
          showNotification(`Картинка заменена на ${res.data}.`, 'success');
        })
        .catch(() => showNotification('Ошибка сохранения!..', 'danger'))
        .finally(() => {
          this.imgUploader.value = null;
          this.isLoaded();
          this.imgUploader.removeEventListener('change', this.onChange);
        });
    }
  };
  onClick() {
    this.imgUploader.click();
    this.imgUploader.addEventListener('change', this.onChange);
  }
}
