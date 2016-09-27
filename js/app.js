'use strict';

import 'jquery';
import Sammy from 'sammy';
import { appUrls } from 'application-urls';
import { kinveyUrls } from 'kinvey-urls';
import { request } from 'requester';
import { header } from 'header-generator';
import { template } from 'template-generator';
import { pageLoader } from 'page-controller';
import { eventLoader } from 'event-controller';

let app = new Sammy(function() {

    this.get(appUrls.MAIN_URL, function() {
        if (localStorage.AUTH_TOKEN) {
          this.redirect(appUrls.HOME_URL);
          return;
        }

        template.get('front-navigation')
            .then(temp => pageLoader.loadFrontNavigation(temp));

        template.get('front-page')
            .then(temp => pageLoader.loadFrontPage(temp))
            .then(() => eventLoader.loadFrontPageEvents());
    });

    this.get(appUrls.HOME_URL, function() {
        if (!localStorage.AUTH_TOKEN) {
          this.redirect(appUrls.MAIN_URL);
          return;
        }

        let top5 = {};

        template.get('user-navigation')
            .then(temp => pageLoader.loadUserNavigation(temp))
            .then(() => eventLoader.loadUserNavigationEvents());

        let head = header.getHeader(true, false);
        request.get(`https://baas.kinvey.com/appdata/${kinveyUrls.KINVEY_APP_ID}/books/?query={}&limit=5&sort={"countRead": -1}`, head)
            .then((books) => { top5.books = books })
            .then(() => {
                request.get(`https://baas.kinvey.com/appdata/${kinveyUrls.KINVEY_APP_ID}/authors?query={}&limit=5&sort={"amountOfFavorites": -1}`, head)
                    .then((auth) => { top5.authors = auth })
                    .then(() => {
                        template.get('home-page')
                            .then(temp => pageLoader.loadUserHomePage(temp, top5))
                            .then(() => eventLoader.loadHomePageEvents(top5));
                    })
            });
    });

    this.get(appUrls.AUTHORS_URL, function() {
        if (!localStorage.AUTH_TOKEN) {
          this.redirect(appUrls.MAIN_URL);
          return;
        }
        let data = {};

        let head = header.getHeader(true, false);

        request.get(`https://baas.kinvey.com/appdata/${kinveyUrls.KINVEY_APP_ID}/authors`, head)
            .then((auth) => { data.authors = auth })
            .then(() => {
              template.get('authors-page')
                  .then(temp => pageLoader.loadAuthorsPage(temp, data))
                  .then(() => eventLoader.loadAuthorsPageEvents(data));
            })
        });

    // this.get(appUrls.BOOKS_URL, function() {

    // })

    // this.get(appUrls.COMMUNITY_URL, function() {

    // })

    // this.get(appUrls.PROFILE_URL, function() {

    // })

    this.get(/.*/, function () {
      if (localStorage.AUTH_TOKEN) {
        template.get('user-navigation')
            .then(temp => pageLoader.loadUserNavigation(temp))
            .then(() => eventLoader.loadUserNavigationEvents());
      }else{
        template.get('front-navigation')
            .then(temp => pageLoader.loadFrontNavigation(temp))
            .then(() => eventLoader.loadFrontPageEvents());
      }

      pageLoader.loadErrorPage();

    });

    this.bind('redirectToUrl', function(event, url) {
        this.redirect(url);
    });

});

app.run(appUrls.MAIN_URL);
