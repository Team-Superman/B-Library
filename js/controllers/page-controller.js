'use strict';

import 'jquery';

let NAV_SELECTOR = 'nav';
let MAIN_SELECTOR = 'main'

function loadFrontPage(template) {
    let promise = new Promise((resolve, reject) => {
        $(MAIN_SELECTOR).html(template());
        resolve();
    });

    return promise;
}

function loadFrontNavigation(template) {
    let promise = new Promise((resolve, reject) => {
        $(NAV_SELECTOR).html(template())
        resolve();
    })

    return promise;
}

function loadUserHomePage(template, data) {
    let promise = new Promise((resolve, reject) => {
        $(MAIN_SELECTOR).html(template(data));
        resolve();
    });

    return promise;
}

function loadAuthorsPage(template, data) {
    let promise = new Promise((resolve, reject) => {
        $(MAIN_SELECTOR).html(template(data));
        resolve();
    });
}

function loadUserNavigation(template) {
    let user = localStorage.getItem('USER_NAME');
    let promise = new Promise((resolve, reject) => {
        $(NAV_SELECTOR).html(template(user));
        resolve();
    });

    return promise;
}

function loadErrorPage() {
    let promise = new Promise((resolve, reject) => {
        let errorBackground = $('<img/>').attr('src', '../../assets/images/error-page.jpg')
            .attr('class', 'img-responsive');
        $(MAIN_SELECTOR).html(errorBackground);
        resolve();
    });

    return promise;
}

function loadProfilePage(template, data) {
    let promise = new Promise((resolve, reject) => {
        $(MAIN_SELECTOR).html(template(data));
        resolve();
    })

    return promise;
}


let pageLoader = {
    loadFrontPage,
    loadFrontNavigation,
    loadUserNavigation,
    loadUserHomePage,
    loadAuthorsPage,
    loadErrorPage,
    loadProfilePage
};

export { pageLoader };