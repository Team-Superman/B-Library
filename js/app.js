'use strict';

import $ from 'jquery';
import Sammy from 'sammy';
import {urls} from 'application-urls';

let CONTENT_SELECTOR = '#content';

let app = new Sammy(function(){

  this.get(urls.MAIN_URL, function(){
    let title = $('<h1>').html('HOME');
    $(CONTENT_SELECTOR).html(title);
  });

  this.get(urls.TEST_URL, function(){
    let title = $('<h1>').html('TEST');
    $(CONTENT_SELECTOR).html(title);
  })

});

app.run(urls.MAIN_URL);
