import Service from '@ember/service';
import Ember from 'ember';

export default Service.extend({
  firebaseApp: Ember.inject.service(),
  signIn(email, password) {
    return this.get('firebaseApp').auth().signInWithEmailAndPassword(email, password);
  },
  getCurrentUserToken() {
    this.get('firebaseApp').auth().currentUser.getToken()
      .then(
        (token) => {
          localStorage.setItem('isLoggedIn', token);
        });
    localStorage.getItem('isLoggedIn');
  },
  logout() {
    this.get('firebaseApp').auth().signOut();
    localStorage.removeItem('isLoggedIn');
  },
  getTok() {
    const userKey = Object.keys(window.localStorage)
      .filter(it => it.startsWith('firebase:authUser'))[0];
    const user = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined;
    const uid = user.uid;
    return uid;
  },
  isAuthenticated() {
    return (localStorage.getItem('isLoggedIn')) ? true : false;
  }
});
