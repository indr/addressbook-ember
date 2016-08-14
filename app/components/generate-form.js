import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  passphrase: validator('presence', true)
});

export default Ember.Component.extend(Validations, {
  keychain: Ember.inject.service(),
  session: Ember.inject.service(),
  
  passphrase: null,
  
  actions: {
    generate() {
      const self = this;
      const keychain = self.get('keychain');
      const flash = this.get('flashMessages');
      
      const userId = self.get('session.data.authenticated.id');
      const emailAddress = self.get('session.data.authenticated.email');
      const passphrase = self.get('passphrase');
      
      flash.infoT('generate.generating');
      keychain.generateKey(userId, emailAddress, passphrase).then(() => {
        flash.successT('generate.success');
      }).catch((reason) => {
        flash.dangerT(reason, 'generate.unknown-error');
      });
    }
  }
});
