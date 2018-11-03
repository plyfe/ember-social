import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';


export default Component.extend({
  socialApiClient: service('twitter-api-client'), // injected

  tagName: 'div', // set tagName to 'a' in handlebars to use your own css/content
                  // instead of the standard Twitter share button UI
  useWebIntent: equal('tagName', 'a'),

  url: null, // Defaults to current url
  text: null, // Defaults to current page title
  via: null, // Attribute the source of a Tweet to a Twitter username.
  related: null, // A comma-separated list of accounts related to the content of the shared URI.
  hashtags: null, // A comma-separated list of hashtags to be appended to default Tweet text.

  attributeBindings: ['webIntentUrl:href'],
  webIntentUrl: computed('useWebIntent', 'url', 'text', 'via', 'related', 'hashtags', function(){
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

  didInsertElement() {
    this._super(...arguments);
    var self = this;
    this.get('socialApiClient').load().then((twttr) => {
      if (self._state !== 'inDOM') { return; }
      self.twttr = twttr;
      

      if (this.get('useWebIntent')) { return; }
      this.twttr.widgets.createShareButton(
        this.get('url'),
        this.get('element'),
        {
          text: this.get('text'),
          via: this.get('via'),
          hashtags: this.get('hashtags'),
          related: this.get('related')
        }).then(function (/*el*/) {
        
        }
      );

    });
  }
  
});
