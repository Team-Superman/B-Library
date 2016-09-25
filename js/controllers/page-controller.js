'use strict';

import 'jquery';

let ROOT_SELECTOR = '#root';


function loadHomePage(template) {
    let promise = new Promise((resolve, reject) => {
        $(ROOT_SELECTOR).html(template());
        resolve();
    });

    return promise;
}

function loadUserMainPage(template, data) {    
    let promise = new Promise((resolve, reject) => {
        $(ROOT_SELECTOR).append(template(data));
        resolve();
    });

    return promise;
}

function loadAuthorsPage(template, data){
    let promise = new Promise((resoleve, reject) => {
        $(ROOT_SELECTOR).append(template(data));
        resolve();
    });
}

function loadUserNavigation(template) {
    let user = localStorage.getItem('USER_NAME');
    let promise = new Promise((resolve, reject) => {
        $(ROOT_SELECTOR).empty();
        $(ROOT_SELECTOR).append(template(user));
        resolve();
    });

    return promise;
}


let pageLoader = {
    loadHomePage,
    loadUserNavigation,
    loadUserMainPage,
    loadAuthorsPage
};

export { pageLoader };