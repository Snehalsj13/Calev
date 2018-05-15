import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  firebaseApp: Ember.inject.service(),
  authentication: Ember.inject.service(),
  toastMessages: Ember.inject.service(),
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
  validatePassword(pass) {
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    return re.test(String(pass));
  },
  actions: {
    goBackToIndex() {
      this.transitionToRoute('index');
    },
    signUp() {
      var name = this.get('name2');
      var email = this.get('email');
      var pass = this.get('password');

      var htmlMessage = '';

      if (!name || !email || !pass) {
        var message = '<p>All fields are mandatory. Please enter all the required information.</p>';
        var el = this.get('toastMessages');
        el.SnackBar(message);
        el.displayMessage(4800);
      } else {
        if (!this.validateEmail(email)) {
          htmlMessage = htmlMessage + '<p>Please enter a valid email</p>'
        } else {
          email = email.toLowerCase();
        }
        if (!this.validatePassword(pass)) {
          htmlMessage = htmlMessage + '<p>Please enter a valid password which contains at least one digit, one lowercase character, one uppercase character & 8 characters minimum(No specials).</p>'
        }
      }

      if (htmlMessage != '') {
        var el = this.get('toastMessages');
        el.SnackBar(htmlMessage);
        el.displayMessage(4800);
      } else {
        this.get('firebaseApp').auth().createUserWithEmailAndPassword(email, pass).then((userResponse) => {
          this.get('firebaseApp').database().ref('users/' + userResponse.uid).set({
            uid: userResponse.uid,
            email: email,
            name: name,
            company: false
          }).then(() => {
            var message = '<p>Signed up successfully. Please log in to the application.</p>'
            var el = this.get('toastMessages');
            el.SnackBar(message);
            el.displayMessage(4800)
            setTimeout(() => {
              this.transitionToRoute('sign-in');
            }, 3500);
          })
        }, (error) => {
          var message = '<p>Could not sign you up. Please try again later</p>'
          var el = this.get('toastMessages');
          el.SnackBar(message);
          el.displayMessage(4800);
        });
      }
    },
    companySignUp() {
      var name = this.get('name');
      var address = this.get('address');
      var email = this.get('email1');
      var pass = this.get('password1');
      var timelineEl = $(document.querySelectorAll('.timeline'));
      var timeline = timelineEl.find(":selected").text();

      var htmlMessage = '';

      if (!name || !address || !email || !pass || (timeline == ' -- Timeline -- ')) {
        var message = '<p>All fields are mandatory. Please enter all the required information.</p>';
        var el = this.get('toastMessages');
        el.SnackBar(message);
        el.displayMessage(4800);
        return;
      } else {
        if (!this.validateEmail(email)) {
          htmlMessage = htmlMessage + '<p>Please enter a valid email</p>'
        } else {
          email = email.toLowerCase();
        }
        if (!this.validatePassword(pass)) {
          htmlMessage = htmlMessage + '<p>Please enter a valid password which contains at least one digit, one lowercase character, one uppercase character & 8 characters minimum(No specials).</p>'
        }
      }

      if (htmlMessage != '') {
        var el = this.get('toastMessages');
        el.SnackBar(htmlMessage);
        el.displayMessage(4800);
      } else {
        this.get('firebaseApp').auth().createUserWithEmailAndPassword(email, pass).then((userResponse) => {
          this.get('firebaseApp').database().ref('users/' + userResponse.uid).set({
            uid: userResponse.uid,
            email: email,
            name: name,
            address: address,
            timeline: timeline,
            company: true
          }).then(() => {
            var message = '<p>Signed up successfully. Please log in to the application.</p>';
            var el = this.get('toastMessages');
            el.SnackBar(message);
            el.displayMessage(4800);
            setTimeout(() => {
              this.transitionToRoute('sign-in');
            }, 3500);
          })
        }, (error) => {
          var message = "<p>There was some issue signing you up. Please try again later";
          var el = this.get('toastMessages');
          el.SnackBar(message);
          el.displayMessage(4800);
        });
      }
    },
    switchCompany() {
      var el = $(document.querySelectorAll('.signUpheader1'));
      var el1 = $(document.querySelectorAll('.signUpheader2'));
      el.css('transition', 'all 1s');
      el.css('transform', 'translateX(-500px)');
      el.css('opacity', '0');

      el.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
        () => {
          el.hide();
          el.css('transition', 'none');
          el.css('z-index', '-1');
          el1.css('z-index', '1');
          el.css('transform', 'translateX(0px)');
          el1.css('transition', 'all .1s');
          el1.css('opacity', '1');
          el1.show();
        });
    },
    switchUser() {
      var el = $(document.querySelectorAll('.signUpheader1'));
      var el1 = $(document.querySelectorAll('.signUpheader2'));
      el1.css('transition', 'all 1s');
      el1.css('transform', 'translateX(-500px)');
      el1.css('opacity', '0');

      el1.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
        () => {
          el1.hide();
          el1.css('transition', 'none');
          el1.css('z-index', '-1');
          el.css('z-index', '1');
          el1.css('transform', 'translateX(0px)');
          el.css('transition', 'all .1s');
          el.css('opacity', '1');
          el.show();
        });
    }
  }
});
