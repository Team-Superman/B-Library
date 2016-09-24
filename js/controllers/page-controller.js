'use strict';

import 'jquery';
import {notifier} from 'notifier';

let CONTENT_SELECTOR = '#content';

function loadHomePage(template){
    let promise = new Promise((resolve, reject) => {
      $(CONTENT_SELECTOR).html(template());
      resolve();
    });

    return promise;
  }

function loadHomePageEvents(){
  //handle requests for sign in and sign up here
    $('#sign-in-user').on('click', function(ev){
      notifier.show('SIGN IN', 'error');
    });

    $('#sign-up-user').on('click', function(ev){
      notifier.show('SIGN UP', 'success');
    });
  }

let pageLoader = {
  loadHomePage,
  loadHomePageEvents
}

export {pageLoader};
