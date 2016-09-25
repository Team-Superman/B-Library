'use strict';

import { header } from 'header-generator';
import { request } from 'requester';
import { notifier } from 'notifier';
import { kinveyUrls } from 'kinvey-urls';
import CryptoJS from 'cryptojs';
import Sammy from 'sammy';


function register(data) {
    let head = header.getHeader(false, true);
    request.post(`https://baas.kinvey.com/user/${kinveyUrls.KINVEY_APP_ID}`, head, data)
        .then(response => {
            notifier.show('SIGN UP', 'success');
        });
}

function login(user) {
    var promise = new Promise(function(resolve, reject) {
        var data = {
            username: user.username,
            password: user.password
        };

        let head = header.getHeader(false, true);

        request.post(`https://baas.kinvey.com/user/${kinveyUrls.KINVEY_APP_ID}/login`, head, data)
            .then(response => {
                localStorage.setItem('AUTH_TOKEN', response._kmd.authtoken);
                localStorage.setItem('USER_NAME', response.username);
                localStorage.setItem('USER_ID', response._id);
                notifier.show('LOGIN SUCCESSFUL', 'success');
                setTimeout(function() {
                    Sammy(function() {
                        this.trigger('redirectToUrl', '#/home');
                    });
                })
            })
            .catch((error) => {
                notifier.show('Invalid username or password', 'error');
            });
    });

    return promise;
};

function logout() {
    var promise = new Promise((resolve, reject) => {
        localStorage.clear();
        notifier.show('SIGN OUT SUCCESSFUL', 'success');
        setTimeout(function() {
            Sammy(function() {
                this.trigger('redirectToUrl', '#/')
            })
        })
    })

    return promise;
}

function current() {
    return {
        authtoken: localStorage.getItem('AUTH_TOKEN'),
        username: localStorage.getItem('USER_NAME'),
        id: localStorage.getItem('ID')
    }
}

let userModel = { register, login, logout, current };
export { userModel };