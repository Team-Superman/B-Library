'use strict';

import 'jquery';
import Sammy from 'sammy';
import {appUrls} from 'application-urls';
import {kinveyUrls} from 'kinvey-urls';
import {request} from 'requester';
import {header} from 'header-generator';
import {template} from 'template-generator';

let CONTENT_SELECTOR = '#content';

let app = new Sammy(function(){

  this.get(appUrls.MAIN_URL, function(){
    template.get('front-page')
            .then(function(template){
              $(CONTENT_SELECTOR).html(template());
            })
  });

  this.get(appUrls.TEST_URL, function(){
    //let title = $('<h1>').html('TEST');
    //$(CONTENT_SELECTOR).html(title);

    let head = header.getHeader(false, false);
    request.get(`https://baas.kinvey.com/appdata/${kinveyUrls.KINVEY_APP_ID}`, head)
           .then((data) => console.log(data));
  })

});

app.run(appUrls.MAIN_URL);
