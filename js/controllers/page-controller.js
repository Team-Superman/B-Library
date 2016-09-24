'use strict';

import 'jquery';
import {notifier} from 'notifier';
import {userModel} from 'user-model';
import Sammy from 'sammy';

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

      Sammy(function(){
        this.trigger('redirectToUrl', '#/home');
      });
    });

    $('#sign-up-user').on('click', function(ev){
      let user = {
        "username": $('#input-username').val(),
        "password": $('#input-password').val(),
        "firstName": $('#input-first-name').val(),
        "lastName": $('#input-last-name').val(),
        "email": $('#input-email-address').val(),
        "readBooks": []
      };

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
