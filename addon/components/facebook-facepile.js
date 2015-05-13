import Ember from 'ember';
import LoadWithOptionsMixin from 'ember-social/mixins/load-with-options';

export default Ember.Component.extend(LoadWithOptionsMixin, {
  socialApiClient: null, //injected

  url: null, // Defaults to specified Facebook app_id
  'fb-colorscheme': 'light', // Valid options: 'light' or 'dark'

  createFacebookFacepile: Ember.on('didInsertElement', function() {
    var self = this;
    this.loadSocialApiClient().then(function(FB) {
      if (self._state !== 'inDOM') { return; }
      var attrs = [];
      var url = self.get('url');
      if (url) {
        attrs.push('data-href="' + url + '"');
      }
      var fbColorScheme = self.get('fb-colorscheme');
      if (fbColorScheme) {
        attrs.push('data-colorscheme="' + fbColorScheme + '"');
      }
      self.$().html('<div class="fb-facepile" ' + attrs.join(' ') + '></div>');
      FB.XFBML.parse(self.get('element'));
    });
  })
});
