import Ember from 'ember';
import startApp from '../helpers/start-app';
import { module, test } from 'qunit';

var App;

module('Acceptance: Twitter', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('share', function(assert) {
  visit('/twitter/share');

  andThen(function() {
    assert.equal(currentPath(), 'twitter.share');

    var exampleElementIds = [
      'no-parameters',
      'custom-url-and-text',
      'count-display-none',
      'count-display-horizontal',
      'count-display-vertical'
    ];

    Ember.run.later(function() {
      exampleElementIds.forEach(function(exampleId) {
        assert.equal(find('#' + exampleId + ' iframe').length, 1, 'Renders ' + exampleId);
      });

      assert.equal(find('#block-provided a').length, 1, 'Renders web intent style');
      assert.equal(find('#block-provided a').attr('href'), "https://twitter.com/intent/tweet?url=http%3A%2F%2Fplyfe.github.io%2Fember-social&text=Help%2C%20I'm%20stuck%20in%20a%20tweet%20factory.&via=tweetfactory&related=tweet%2Cfactory&hashtags=tweet%2Cfactory", 'Renders href');
    }, 2500);
  });
});

test('tweet', function(assert){
  visit('/twitter/card');

  andThen(function(){
    assert.equal(currentPath(), 'twitter.card');

    Ember.run.later(function(){
      assert.equal(find('.twitter-tweet').length, 2, 'Two twitter tweets were rendered.');
    }, 2500);
  });
});
