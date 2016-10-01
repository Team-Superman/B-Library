'use strict';

import 'jquery';

let NAV_SELECTOR = 'nav';
let MAIN_SELECTOR = 'main'

function loadPage(template, data) {
    let promise = new Promise((resolve, reject) => {
        $(MAIN_SELECTOR).html(template(data));
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

function loadUserNavigation(template) {
    let user = localStorage.getItem('USER_NAME');
    let promise = new Promise((resolve, reject) => {
        $(NAV_SELECTOR).html(template(user));
        resolve();
    });

    return promise;
}

function loadModal(template) {
    let promise = new Promise((resolve, reject) => {
        $(MAIN_SELECTOR).append(template());
        resolve();
    });

    return promise;
}

function loadAuthorBooksPage(template, data){
  let promise = new Promise((resolve, reject) => {
    $('.author-books').append(template(data));
    resolve();
  })

  return promise;
}

let pageLoader = {
    loadPage,
    loadFrontNavigation,
    loadUserNavigation,
    loadModal,
    loadAuthorBooksPage
};

export { pageLoader };
