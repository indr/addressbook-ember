import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service(),
  
  canReview: Ember.computed('session.data.authenticated.sync_enabled', function () {
    return this.get('session').get('data.authenticated.sync_enabled');
  })
});
