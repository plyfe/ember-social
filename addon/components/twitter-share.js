import Ember from 'ember';

export default Ember.Component.extend({
  socialApiClient: null, // injected

  tagName: 'div', // set tagName to 'a' in handlebars to use your own css/content
                  // instead of the standard Twitter share button UI
  useWebIntent: Ember.computed.equal('tagName', 'a'),

  url: null, // Defaults to current url
  text: null, // Defaults to current page title
  via: null, // Attribute the source of a Tweet to a Twitter username.
  related: null, // A comma-separated list of accounts related to the content of the shared URI.
  hashtags: null, // A comma-separated list of hashtags to be appended to default Tweet text.
  count: 'none', // valid values: 'none', 'vertical', or 'horizontal'
                 // This option does nothing when tagName is 'a'

  attributeBindings: ['webIntentUrl:href'],
  webIntentUrl: Ember.computed('useWebIntent', 'url', 'text', 'via', 'related', 'hashtags', function(){
    var intentUrl = 'https://twitter.com/intent/tweet',
      intentParams = [],
      params = [
        {name: 'url', value: this.get('url')},
        {name: 'text', value: this.get('text')},
        {name: 'via', value: this.get('via')},
        {name: 'related', value: this.get('related')},
        {name: 'hashtags', value: this.get('hashtags')}
      ];

    if (!this.get('useWebIntent')) { return; }

    params.forEach(function(param) {
      if (param.value) {
        intentParams.push(param.name + '=' + encodeURIComponent(param.value));
      }
    });

    return intentUrl + '?' + intentParams.join('&');
  }),

  loadTwitterClient: Ember.on('didInsertElement', function() {
    var self = this;
    this.socialApiClient.load().then(function(twttr) {
      if (self._state !== 'inDOM') { return; }
      self.twttr = twttr;
      self.trigger('twitterLoaded');
    });
  }),

  createTwitterShareButton: Ember.on('twitterLoaded', function() {
    if (this.get('useWebIntent')) { return; }
    this.twttr.widgets.createShareButton(
      this.get('url'),
      this.get('element'),
      {
        count: this.get('count'),
        text: this.get('text'),
        related: this.get('related'),
        hashtags: this.get('hashtags'),
        via: this.get('via')
      }).then(function (/*el*/) {
        Ember.Logger.debug('Twitter Share Button created.');
      }
    );
  })

});
