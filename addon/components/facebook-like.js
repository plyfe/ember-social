import Ember from 'ember';
import LoadWithOptionsMixin from 'ember-social/mixins/load-with-options';

export default Ember.Component.extend(LoadWithOptionsMixin, {
  socialApiClient: null, // injected

  url: null, // Defaults to current url
  'fb-layout': 'standard', // Valid options: 'standard', 'button_count', 'button', or 'box_count'
  'fb-action': 'like', // Valid options: 'like' or 'recommend'

  createFacebookLikeButton: Ember.on('didInsertElement', function() {
    var self = this;
    this.loadSocialApiClient().then(function(FB) {
      if (self._state !== 'inDOM') { return; }
      var attrs = [];
      var url = self.get('url');
      if (url) {
        attrs.push('data-href="' + url + '"');
      }
      var fbLayout = self.get('fb-layout');
      if (fbLayout) {
        attrs.push('data-layout="' + fbLayout + '"');
      }
      var fbAction = self.get('fb-action');
      if (fbAction) {
        attrs.push('data-action="' + fbAction + '"');
      }
      self.$().html('<div class="fb-like" ' + attrs.join(' ') +'></div>');
      FB.XFBML.parse(self.get('element'));
    });
  })

});
