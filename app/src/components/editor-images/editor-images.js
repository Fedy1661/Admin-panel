import axios from 'axios';

export default class {
  constructor(
    element,
    virtualElement,
    ...[isLoading, isLoaded, showNotification]
  ) {
    this.element = element;
    this.virtualElement = virtualElement;

    this.element.addEventListener('click', () => this.onClick());
    this.imgUploader = document.querySelector('#img-upload');
    this.isLoading = isLoading;
    this.isLoaded = isLoaded;
    this.showNotification = showNotification;
    this.onChange = this.onChange.bind(this);
  }
  onChange() {
    if (this.imgUploader.files && this.imgUploader.files[0]) {
      let formData = new FormData();
      formData.append('image', this.imgUploader.files[0]);
      this.isLoading();
      axios
        .post('./api/uploadImage.php', formData, {
          headers: {
            'Content-type': 'multipart/form-data'
          }
        })
        .then(res => {
          this.virtualElement.src = this.element.src = `./img/${res.data.src}`;
          this.showNotification(
            `Картинка заменена на ${res.data.src}`,
            'success'
          );
        })
        .catch(() => this.showNotification('Ошибка сохранения!..', 'danger'))
        .finally(() => {
          this.imgUploader.value = null;
          this.isLoaded();
          this.imgUploader.removeEventListener('change', this.onChange);
        });
    }
  }
  onClick() {
    this.imgUploader.click();
    this.imgUploader.addEventListener('change', this.onChange);
  }
}
