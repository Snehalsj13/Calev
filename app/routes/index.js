import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    var controller = this.controllerFor('index');
    controller.set('isAuth', controller.get('authentication').isAuthenticated());
  }
});
