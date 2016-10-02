'use strict';

import 'jquery';

let pageLoader = (function(){
  let NAV_SELECTOR = 'nav';
  let MAIN_SELECTOR = 'main';

  class PageController {
    loadPage(template, data) {
        let promise = new Promise((resolve, reject) => {
            $(MAIN_SELECTOR).html(template(data));
            resolve();
        });

        return promise;
    }

    loadColletionsList(template, data, selector) {
        let promise = new Promise((resolve, reject) => {
            $(selector).html(template(data));
            resolve();
        });

        return promise;
    }

    loadFrontNavigation(template) {
        let promise = new Promise((resolve, reject) => {
            $(NAV_SELECTOR).html(template())
            resolve();
        })

        return promise;
    }

    loadUserNavigation(template) {
        let user = localStorage.getItem('USER_NAME');
        let promise = new Promise((resolve, reject) => {
            $(NAV_SELECTOR).html(template(user));
            resolve();
        });

        return promise;
    }

    loadModal(template, data) {
        let promise = new Promise((resolve, reject) => {
            $(MAIN_SELECTOR).append(template(data));
            resolve();
        });

        return promise;
    }

    loadAuthorBooksPage(template, data) {
        let promise = new Promise((resolve, reject) => {
            $('.author-books').append(template(data));
            resolve();
        })

        return promise;
    }
  }

  return new PageController();
}());

export { pageLoader };
