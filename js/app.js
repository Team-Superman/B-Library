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
        template.get('front-navigation')
            .then(temp => pageLoader.loadFrontNavigation(temp));

        template.get('front-page')
            .then(temp => pageLoader.loadFrontPage(temp))
            .then(() => eventLoader.loadFrontPageEvents());
    });

    this.get(appUrls.HOME_URL, function() {
        template.get('user-navigation')
            .then(temp => pageLoader.loadUserNavigation(temp))
            .then(() => eventLoader.loadUserNavigationEvents());

        let head = header.getHeader(true, false);
        let data = {};
        request.get(`https://baas.kinvey.com/appdata/${kinveyUrls.KINVEY_APP_ID}/books`, head)
            .then((res) => { data.books = res })
            .then(() => {
                request.get(`https://baas.kinvey.com/appdata/${kinveyUrls.KINVEY_APP_ID}/authors`, head)
                    .then((res) => { data.authors = res })
                    .then(() => {
                        template.get('home-page')
                            .then(temp => pageLoader.loadUserHomePage(temp, data))
                    })
            });

        //$('#root').html('HOMEPAGE WHEN USER IS LOGGED IN');
    });

    this.get(appUrls.AUTHORS_URL, function() {
        let head = header.getHeader(true, false);
        let data = {};

        request.get(`https://baas.kinvey.com/appdata/${kinveyUrls.KINVEY_APP_ID}/authors`, head)
            .then((auth) => { data.authors = auth })
            .then(() => {
                template.get('authors-page')
                    .then(temp => pageLoader.loadAuthorsPage(temp, data))
                    .then(() => eventLoader.loadAuthorsPageEvents())
            });

    });

    // this.get(appUrls.PROFILE_URL, function() {

    // })

    this.bind('redirectToUrl', function(event, url) {
        this.redirect(url);
    });

});

app.run(appUrls.MAIN_URL);