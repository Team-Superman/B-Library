'use strict';

import 'jquery';
import {notifier} from 'notifier';
import {userModel} from 'user-model';
import CryptoJS from 'cryptojs';

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
      let user = {
        "username": $('#login-username').val(),
        "password": CryptoJS.SHA1($('#login-password').val()).toString(),
      }

      userModel.login(user);
    });

    $('#sign-up-user').on('click', function(ev){
      let user = {
        "username": $('#input-username').val(),
        "password": CryptoJS.SHA1($('#input-password').val()).toString(),
        "firstName": $('#input-first-name').val(),
        "lastName": $('#input-last-name').val(),
        "email": $('#input-email-address').val(),
        "readBooks": []
      };
      //validate data here
      userModel.register(user);
      notifier.show('SIGN UP', 'success');

      //TODO redirect
    });
  }

let pageLoader = {
  loadHomePage,
  loadHomePageEvents
};

export {pageLoader};
