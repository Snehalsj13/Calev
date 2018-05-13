import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
  firebaseApp: Ember.inject.service(),
  authentication: Ember.inject.service(),
  toastMessages: Ember.inject.service(),
  listOfCompanies: [],
  init: function() {
    // Get list of all companies
    var promise = new Promise((resolve, reject) => {
      var data = this.get('firebaseApp').database().ref().child('users/');
      data.on('value', (snapshot) => {
        for(let val of Object.values(snapshot.val())) {
          if(val.company === true) {
            this.listOfCompanies.push(val);
          } else {
            continue;
          }
        }
        resolve();
      }, (error) => {
        Error(error);
        reject();
      });
    });

    promise.then(() => {
      var el = $(document.querySelector('.mainBox'));
      var promise2 = new Promise((resolve, reject) => {
        for(var i=0;i<this.listOfCompanies.length; i++) {
          el.append('<a data-uid="' + this.listOfCompanies[i].uid + '" class="boxCompany"><span class="insideText">' + this.listOfCompanies[i].name + '</span></a>');
        }
        resolve();
      });
      promise2.then(() => {
        $('.boxCompany').on('click', (event) => {
          this.transitionToRoute('user-calendar', { queryParams: { cN: event.target.dataset.uid }});
        });
      });
    });


  },
  actions: {
  }
});
