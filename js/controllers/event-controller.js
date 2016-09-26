'use strict';

import 'jquery';
import { notifier } from 'notifier';
import { userModel } from 'user-model';
import { validator } from 'validator';
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
        } else {
            confirmPassword.parents('.form-group').addClass('has-error');
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

        if (validator.validateNames(user.firstName, user.lastName) &&
            validator.validateUsername(user.username) &&
            validator.validatePassword()) {
            userModel.register(user);
        }
    });
}

function loadUserNavigationEvents() {
    $('#sign-out-user').on('click', function(ev) {
        userModel.logout();
    });
}

function loadAuthorsPageEvents(data) {
    $('#search-author-button').on('click', function(ev) {
        console.log("ubavec");
        console.log(data);
        console.log(data.authors);
        let firstNameValue = $('#first-name-search').val();
        let lastNameValue = $('#last-name-search').val();
        //TODO:filter(x => x.firstName)

        function getSearchedAuthors(firstNameValue, lastNameValue){
            if(firstNameValue !== ""){
                for (var index = 0; index < data.authors.length; index++) {
                    var element = data.authors[index];
                        if(element.firstName === firstNameValue){
                            console.log(index);
                            let currentAuthorId = "#" + data.authors[index]._id;
                            console.log(currentAuthorId);
                            $(currentAuthorId).show();
                            break;
                        }
                }
            }
        }

       
        getSearchedAuthors(firstNameValue, lastNameValue);
    
    });

    $('#first-name-search').on('input', function(ev) {
        for (var index = 0; index < data.authors.length; index++) {
                    var element = data.authors[index];
                       
                    let currentAuthorId = "#" + data.authors[index]._id;

                    $(currentAuthorId).hide();
                           
        }
        $('#search-name-change').text("Search Results");
    });

    $('#show-all-authors').on('click', function(){
        for (var index = 0; index < data.authors.length; index++) {
                    var element = data.authors[index];
                       
                    let currentAuthorId = "#" + data.authors[index]._id;

                    $(currentAuthorId).show();
                           
        }
    });

    
}

let eventLoader = {
    loadFrontPageEvents,
    loadAuthorsPageEvents,
    loadUserNavigationEvents
}

export { eventLoader }