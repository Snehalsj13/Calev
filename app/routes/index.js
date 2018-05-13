import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    var controller = this.controllerFor('index');
    controller.isAuth = controller.get('authentication').isAuthenticated();
  }
});
