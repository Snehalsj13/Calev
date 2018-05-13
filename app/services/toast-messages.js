import Service from '@ember/service';

export default Service.extend({
  message: '',
  SnackBar(message) {
    if (!message) {
      throw new Error('No message supplied.');
    }
    this.message = message;
  },
  displayMessage(timeout) {
    var x = document.getElementById('snackbar');
    $(x).html(this.message);
    x.className = "";
    x.className = "show";
    setTimeout(() => {
      x.className = x.className.replace("show", "");
    }, timeout);
  },
  removeMessage() {
    var x = document.getElementById('snackbar');
    x.className = "";
    x.className = x.className.replace("show", "");
  }
});
