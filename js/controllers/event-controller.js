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

function loadFrontPageEvents() {

    $('#sign-in-user').on('click', function(ev) {
        userModel.login(getUserLoginDetails());
    });

    $('#login-password').on('keydown', function(ev) {
        if (ev.which === 13) {
            userModel.login(getUserLoginDetails());
        }
    });

    $('#input-confirm-password').on('input', function(ev) {
        let $this = $(ev.target);
        
        if ($this.val() !== $('#input-password').val()) {
            $this.parents('.form-group').addClass('has-error');
        } else {
            $this.parents('.form-group').removeClass('has-error');
        }
    })

    $('#input-password').on('input', function(ev) {
        let $this = $(ev.target);
        let confirmPassword = $('#input-confirm-password')
        if ($this.val() === confirmPassword.val()) {
            confirmPassword.parents('.form-group').removeClass('has-error');
        }
    })

    $('#sign-up-user').on('click', function(ev) {

        let user = {
            "username": $('#input-username').val(),
            "password": CryptoJS.SHA1($('#input-password').val()).toString(),
            "firstName": $('#input-first-name').val(),
            "lastName": $('#input-last-name').val(),
            "email": $('#input-email-address').val(),
            "readBooks": []
        };

        if ($('#input-password').val() !== $('#input-confirm-password').val()) {
            notifier.show('Confirm password field is different than password field', 'error');
            return;
        }

        if (user.username.length < 4 || user.username.length > 20) {
            notifier.show('Username must be between 4 and 20 characters long inclusive!', 'error');
            return;
        }

        if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test($('#input-password').val())) {
            notifier.show('Password must contain at least one upper case letter, one lower case and one digit!',
                'error');
            return;
        }
        userModel.register(user);
    });
}

function loadUserNavigationEvents() {
    $('#sign-out-user').on('click', function(ev) {
        userModel.logout();
    });
}

function loadAuthorsPageEvents() {
    $('#search-author-button').on('click', function(ev) {
        console.log("ubavec");
    });
}

let eventLoader = {
    loadFrontPageEvents,
    loadAuthorsPageEvents,
    loadUserNavigationEvents
}

export { eventLoader }