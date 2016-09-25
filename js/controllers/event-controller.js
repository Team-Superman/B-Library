'use strict';

import 'jquery';
import { notifier } from 'notifier';
import { userModel } from 'user-model';
import CryptoJS from 'cryptojs';

function getUserLoginDetails() {
    let user = {
        "username": $('#login-username').val(),
        "password": CryptoJS.SHA1($('#login-password').val()).toString(),
    }

    return user;
}

function loadHomePageEvents() {

    $('#sign-in-user').on('click', function(ev) {
        userModel.login(getUserLoginDetails());
    });

    $('#login-password').on('keydown', function(ev) {
        if (ev.which === 13) {
            userModel.login(getUserLoginDetails());
        }
    });

    $('#sign-up-user').on('click', function(ev) {
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
    });
}

function loadUserNavigationEvents() {
    $('#sign-out-user').on('click', function(ev) {
        userModel.logout();
    });
}

function loadAuthorsPageEvents(){
     $('#search-author-button').on('click', function(ev){
                console.log("ubavec");
            });
}

let eventLoader = {
    loadHomePageEvents,
    loadAuthorsPageEvents,
    loadUserNavigationEvents
}

export { eventLoader }