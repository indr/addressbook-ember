/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';
import TrackerMixin from './../mixins/tracker-mixin';
import { validator, buildValidations } from 'ember-cp-validations';
import ValidationErrorsMixin from '../mixins/validation-errors-mixin';

const Validations = buildValidations({
  passphrase: {
    validators: [
      validator('presence', true),
      validator('length', {min: 8, max: 64})
    ]
  },
  newPassphrase: {
    validators: [
      validator('presence', true),
      validator('length', {min: 8, max: 64})
    ]
  },
  confirmPassphrase: {
    validators: [
      validator('presence', true),
      validator('confirmation', {
        on: 'newPassphrase', messageKey: 'errors.confirmation-new-passphrase'
      })
    ]
  }
});

export default Ember.Component.extend(Validations, ValidationErrorsMixin, TrackerMixin, {
  keystore: Ember.inject.service(),
  
  actions: {
    changePassphrase() {
      const flash = this.get('flashMessages');
      
      flash.clearMessages();
      
      this.track('changePassphraseState', this.get('keystore').changePassphrase(this.getProperties('passphrase', 'newPassphrase'))).then(() => {
        flash.successT('profile.change-passphrase.success');
        this.sendAction('changed');
      }).catch((error) => {
        if (error.message && error.message.indexOf('Invalid passphrase') >= 0) {
          flash.dangerT('errors.invalid-current-passphrase');
          return
        }
        flash.dangerT('profile.change-passphrase.unknown-error', error);
      });
    }
  }
});
