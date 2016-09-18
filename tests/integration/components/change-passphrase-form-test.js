import { expect } from 'chai';
import { describeComponent, it } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import instanceInitializer from '../../../instance-initializers/ember-intl';

describeComponent('change-passphrase-form', 'Integration: ChangePassphraseFormComponent', {
    integration: true,
    setup() {
      // manually invoke the ember-intl initializer
      instanceInitializer.initialize(this);
      let intl = this.container.lookup('service:intl');
      intl.setLocale('en-us');
    }
  },
  function () {
    it('renders', function () {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#change-passphrase-form}}
      //     template content
      //   {{/change-passphrase-form}}
      // `);
      
      this.render(hbs`{{change-passphrase-form}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);