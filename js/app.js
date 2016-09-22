'use strict';

import 'jquery';
import Sammy from 'sammy';
import {appUrls} from 'application-urls';
import {kinveyUrls} from 'kinvey-urls';
import {request} from 'requester';
import {header} from 'header-generator';

let CONTENT_SELECTOR = '#content';

let app = new Sammy(function(){

  this.get(appUrls.MAIN_URL, function(){
    let title = $('<h1>').html('HOME');
    $(CONTENT_SELECTOR).html(title);
  });

  this.get(appUrls.TEST_URL, function(){
    let title = $('<h1>').html('TEST');
    $(CONTENT_SELECTOR).html(title);

    let head = header.getHeader(false, false);
    request.get(`https://baas.kinvey.com/appdata/${kinveyUrls.KINVEY_APP_ID}`, head)
           .then((data) => console.log(data));
  })

});

app.run(appUrls.MAIN_URL);
