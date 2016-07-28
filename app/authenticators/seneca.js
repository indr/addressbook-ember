import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';

const {
  RSVP,
  isEmpty,
  run,
  $: jQuery
} = Ember;

export default Base.extend({

  /**
   When authentication fails, the rejection callback is provided with the whole
   XHR object instead of it's response JSON or text.
   This is useful for cases when the backend provides additional context not
   available in the response body.
   @property rejectWithXhr
   @type Boolean
   @default false
   @public
   */
  rejectWithXhr: false,

  restore(/*data*/) {
    return RSVP.reject();
  },

  authenticate(username, password) {
    return new RSVP.Promise((resolve, reject) => {
      const authLoginEndpoint = '/auth/login';
      const data = {
        username: username,
        password: password
      };
      const headers = {};
      const useXhr = this.get('rejectWithXhr');

      this.makeRequest(authLoginEndpoint, data, headers).then((response) => {
        run(() => {
          if (!this._validate(response)) {
            reject(response['why']);
          }
          resolve(response['login']);
        });
      }, (xhr) => {
        run(null, reject, useXhr ? xhr : (xhr.responseJSON || xhr.responseText));
      });
    });
  },

  invalidate(/*data*/) {
    return new RSVP.Promise((resolve) => {
      const authLogoutEndpoint = '/auth/logout';

      this.makeRequest(authLogoutEndpoint, {}).then(resolve, resolve);
    });
  },

  makeRequest(url, data, headers = {}) {
    const options = {
      url,
      data: JSON.stringify(data),
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      headers
    };

    if (isEmpty(Object.keys(options.headers))) {
      delete options.headers;
    }

    return jQuery.ajax(options);
  },

  _validate(data) {
    const isOk = () => {
      return !isEmpty(data['ok']) && data['ok'] === true;
    };
    const hasToken = () => {
      return !isEmpty(data['login']) && !isEmpty(data['login']['token']);
    };
    return isOk() && hasToken();
  }
});