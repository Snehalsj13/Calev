import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel(transition) {
    var controller = this.controllerFor('sign-in');
    if (controller.get('isAuth')) {
      this.transitionTo('index');
    } else {
      return true;
    }
  }
});
