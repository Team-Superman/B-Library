'use strict';

import 'jquery';
import { notifier } from 'notifier';
import { request } from 'requester';
import { header } from 'header-generator';
import { template } from 'template-generator';
import { pageLoader } from 'page-controller';
import { userModel } from 'user-model';
import { validator } from 'validator';
import { kinveyUrls } from 'kinvey-urls';
import CryptoJS from 'cryptojs';

function getUserLoginDetails() {
    let user = {
        "username": $('#login-username').val(),
        "password": CryptoJS.SHA1($('#login-password').val()).toString(),
    }

    return user;
}

function loadFrontPageEvents() {

    $('#sign-in-user').unbind('click');
    $('#sign-in-user').on('click', function(ev) {
        userModel.login(getUserLoginDetails());
    });

    $('#login-password').unbind('keydown');
    $('#login-password').on('keydown', function(ev) {
        if (ev.which === 13) {
            userModel.login(getUserLoginDetails());
        }
    });

    $('#input-confirm-password').unbind('input');
    $('#input-confirm-password').on('input', function(ev) {
        let $this = $(ev.target);

        if ($this.val() !== $('#input-password').val()) {
            $this.parents('.form-group').addClass('has-error');
        } else {
            $this.parents('.form-group').removeClass('has-error');
        }
    })

    $('#input-password').unbind('input');
    $('#input-password').on('input', function(ev) {
        let $this = $(ev.target);
        let confirmPassword = $('#input-confirm-password')
        if ($this.val() === confirmPassword.val()) {
            confirmPassword.parents('.form-group').removeClass('has-error');
        } else {
            confirmPassword.parents('.form-group').addClass('has-error');
        }
    })

    $('#sign-up-user').unbind('click');
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
            validator.validateEmail(user.email) &&
            validator.validatePassword()) {
            userModel.register(user);
        }
    });
}

function loadUserNavigationEvents() {
    $('#sign-out-user').unbind('click');
    $('#sign-out-user').on('click', function(ev) {
        userModel.logout();
    });
}

function loadModalEvents(data) {
    $('.book-learn-more').unbind('click');
    $('.book-learn-more').on('click', function(ev) {
        let bookTitle = $(ev.target).parent().find('h2').html();
        if (!bookTitle) {
            bookTitle = $(ev.target).parents().eq(2).find('h2').html();
        }
        let book = data.books.find(x => x.title === bookTitle);

        $('#book-img').attr('src', book.cover._downloadURL);
        $('#book-info .book-content h2').html(book.title);
        $('#book-info .book-content .book-content-author').html(`by ${book.author}`);
        $('#book-info .book-content .book-content-rating').html(`<b>Rating:</b> ${book.rating}`);
        $('#book-info .book-content .book-content-publish-year').html(`<b>Published:</b> ${book.year}`);
        $('#book-info .book-content .book-content-pages').html(`<b>Pages:</b> ${book.pages}`);
        $('#book-info .book-content .book-content-isbn').html(`<b>ISBN:</b> ${book.isbn}`);
        $('#book-info .book-content .book-content-description').html(book.description);
    });

    $('.mark-as-read').unbind('click');
    $('.mark-as-read').on('click', function(ev) {
        let bookTitle = $(ev.target).parent().find('h2').html();
        if (!bookTitle) {
            bookTitle = $(ev.target).parents().eq(2).find('h2').html();
        }

        $('#book-read').find('legend').html(bookTitle);
    });

    $('.author-learn-more').unbind('click');
    $('.author-learn-more').on('click', function(ev) {
        let authorName = $(ev.target).parent().find('h2').html();
        if (!authorName) {
            authorName = $(ev.target).parents().eq(1).find('h2').html();
        }
        if (!authorName) {
            authorName = $(ev.target).parents().eq(2).find('h2').html();
        }
        console.log(authorName);

        let author = data.authors.find(x => { return `${x.firstName} ${x.lastName}` === authorName; });

        $('#author-img').attr('src', author.picture._downloadURL);
        $('#author-info .author-content h2').html(`${author.firstName} ${author.lastName}`);
        $('#author-info .author-content .author-content-genre').html(`<b>Genre:</b> ${author.genre}`);
        $('#author-info .author-content .author-content-birth-date').html(`<b>Date of birth:</b> ${author.dateOfBirth}`);
        $('#author-info .author-content .author-content-birth-place').html(`<b>Place of birth:</b> ${author.born}`);
        $('#author-info .author-content .author-content-description').html(author.description);

    });

    let promise = new Promise((resolve, reject) => {
        resolve(data);
    })

    return promise;
}

function loadHomePageEvents(data) {
    let promise = new Promise((resolve, reject) => {
        resolve(data);
    })

    return promise;
}

function loadAuthorsPageEvents(data) {
    $('.page').unbind('click');
    $('.page').on('click', function(ev) {
        let $this = $(ev.target);
        let pageNumber = $this.html();
        let startIndex = (pageNumber * 4) - 4;
        for (let i = startIndex; i < startIndex + 4; i += 1) {
            let fieldID = `#author-field-${i - startIndex}`;
            let selectorCover = `${fieldID} .thumbnail img`;
            let selectorHiddenTitle = `${fieldID} .thumbnail h2`;
            let selectorAnchor = `${fieldID} .thumbnail a `;
            if (data.authors[i]) {
                $(selectorCover).attr('src', data.authors[i].picture._downloadURL)
                $(selectorHiddenTitle).html(`${data.authors[i].firstName} ${data.authors[i].lastName}`);
                $(selectorAnchor).attr('href', `#/authors/${data.authors[i]._id}`);
                $(fieldID).show();
            } else {
                $(fieldID).hide();
            }
        };
    });

    $('.btn-search').unbind('click');
    $('.btn-search').on('click', function(ev) {
        let matchedAuthors = {};
        let pattern = $('.input-author-search').val();
        matchedAuthors.authors = data.authors.filter((author) =>
            author.firstName.toLowerCase().indexOf(pattern.toLowerCase()) >= 0 ||
            author.lastName.toLowerCase().indexOf(pattern.toLowerCase()) >= 0);
        let selector = '.search-authors';

        matchedAuthors.totalAuthorPages = matchedAuthors.authors.length / 4;
        matchedAuthors.firstAuthors = matchedAuthors.authors.slice(0, 4);
        console.log(matchedAuthors);
        template.get('list-authors')
            .then(temp => pageLoader.loadColletionsList(temp, matchedAuthors, selector))
            .then(() => eventLoader.loadAuthorsPageEvents(data))
            .then((data) => eventLoader.loadAuthorButtonEvent(data))
            .then((data) => eventLoader.loadModalEvents(data));

    })

    let promise = new Promise((resolve, reject) => {
        resolve(data);
    });

    return promise;
}

function loadBooksPageEvents(data) {
    $('.page').unbind('click');
    $('.page').on('click', function(ev) {
        let $this = $(ev.target);
        let pageNumber = $this.html();
        let booksOnPage = data.firstBooks.length;
        let startIndex = (pageNumber * booksOnPage) - booksOnPage;
        for (let i = startIndex; i < startIndex + booksOnPage; i += 1) {
            let fieldID = `#book-field-${i - startIndex}`;
            let selectorCover = `${fieldID} .thumbnail img`;
            let selectorHiddenTitle = `${fieldID} .thumbnail h2`;
            let selectorAnchor = `${fieldID} .thumbnail a`;
            if (data.books[i]) {
                $(selectorCover).attr('src', data.books[i].cover._downloadURL)
                $(selectorHiddenTitle).html(data.books[i].title);
                $(selectorAnchor).attr('href', `#/books/${data.books[i]._id}`);
                $(fieldID).show();
            } else {
                $(fieldID).hide();
            }
        };
    });

    //New search approach

    let promise = new Promise((resolve, reject) => {
        resolve(data);
    });

    return promise;
}

function loadBooksButtonEvent(data) {
    $('.read-review').unbind('click');
    $('.read-review').on('click', function(ev) {
        let reviewModal = $(ev.target).parent().parent();

        let bookTitle = reviewModal.find('legend').html();
        let book = data.books.find(x => x.title === bookTitle);

        let review = reviewModal.find('textarea').val();
        let rating = reviewModal.find('select').val() | 0;

        let head = header.getHeader(true, false);

        request.get(`${kinveyUrls.KINVEY_USER_URL}/${localStorage.USER_ID}`, head)
            .then((user) => {
                let readBook = {
                    'rating': rating,
                    'review': review,
                    'book': {
                        '_type': "KinveyRef",
                        '_id': book._id,
                        '_collection': "books"
                    }
                }
                user.readBooks.push(readBook);
                return request.put(`${kinveyUrls.KINVEY_USER_URL}/${localStorage.USER_ID}`, head, user);
            })
            .then(() => {
                let oldCountRead = book.countRead;
                let oldRating = book.rating;

                let newCountRead = oldCountRead + 1;
                let newBookRating = ((oldRating * oldCountRead) + rating) / newCountRead;
                newBookRating = Math.round(newBookRating * 10) / 10;

                book.countRead = newCountRead;
                book.rating = newBookRating;

                return request.put(`${kinveyUrls.KINVEY_BOOKS_URL}/${book._id}`, head, book);
            })
            .then((response) => {
                notifier.show('Book added successfully', 'success');
            })
            .catch((err) => {
                err = err.responseJSON.error;
                notifier.show(err, 'error');
            });

        setTimeout(() => {
            $('.close-read').trigger('click');
        }, 500);
    });

    $('.close-read').unbind('click');
    $('.close-read').on('click', function(ev) {
        let reviewModal = $(ev.target).parent().parent();

        reviewModal.find('textarea').val('');
        reviewModal.find('select').val('1');
    });

    let promise = new Promise((resolve, reject) => {
        resolve(data);
    });

    return promise;
}

function loadAuthorButtonEvent(data) {
    $('.author-add-favorite').unbind('click');
    $('.author-add-favorite').on('click', function(ev) {
        let authorName = $(ev.target).parent().find('h2').html();
        if (!authorName) {
            authorName = $(ev.target).parents().eq(2).find('h2').html();
        }

        let author = data.authors.find(x => { return `${x.firstName} ${x.lastName}` === authorName });

        let head = header.getHeader(true, false);

        request.get(`${kinveyUrls.KINVEY_USER_URL}/?pattern=${localStorage.USER_NAME}`, head)
            .then((users) => {
                let newUser = users[0];
                let favAuthor = {
                    '_type': "KinveyRef",
                    '_id': author._id,
                    '_collection': "authors"
                }

                head['custom-author'] = 'true';

                newUser.favoriteAuthors.push(favAuthor);

                return request.put(`${kinveyUrls.KINVEY_USER_URL}/${localStorage.USER_ID}`, head, newUser);
            })
            .then(() => {
                author.amountOfFavorites += 1;
                return request.put(`${kinveyUrls.KINVEY_AUTHORS_URL}/${author._id}`, head, author);
            })
            .then((response) => {
                notifier.show('Author added successfully', 'success');
            })
            .catch((err) => {
                err = err.responseJSON.error;
                notifier.show(err, 'error');
            })
    });

    let promise = new Promise((resolve, reject) => {
        resolve(data);
    })

    return promise;
};

function loadProfilePageEvents(data) {
    $('.page').unbind('click');
    $('.page').on('click', function(ev) {
        let $this = $(ev.target);
        let pageNumber = $this.html();
        let startIndex = (pageNumber * 4) - 4;

        for (let i = startIndex; i < startIndex + 4; i += 1) {
            if ($this.parents('#read-books').length > 0) {
                let fieldID = `#book-field-${i - startIndex}`;
                let selectorCover = `${fieldID} .thumbnail img`;
                let selectorHiddenTitle = `${fieldID} .thumbnail h2`;
                let selectorAnchor = `${fieldID} .thumbnail a`
                if (data.readBooks[i]) {
                    $(selectorCover).attr('src', data.readBooks[i].book.cover._downloadURL)
                    $(selectorHiddenTitle).html(data.readBooks[i].book.title);
                    $(selectorAnchor).attr('href', `#/books/${data.readBooks[i].book._id}`);
                    $(fieldID).show();
                } else {
                    $(fieldID).hide();
                }

            } else {
                let fieldID = `#author-field-${i - startIndex}`;
                let selector = `${fieldID} .thumbnail img`;
                let selectorAnchor = `${fieldID} .thumbnail a`;
                if (data.favoriteAuthors[i]) {
                    $(selector).attr('src', data.favoriteAuthors[i].picture._downloadURL);
                    $(selectorAnchor).attr('href', `#/authors/${data.favoriteAuthors[i]._id}`);
                    $(fieldID).show();
                } else {
                    $(fieldID).hide();
                }
            }
        };
    });

    $('.book-learn-more').unbind('click');
    $('.book-learn-more').on('click', function(ev) {
        let bookTitle = $(ev.target).parents().eq(2).find('h2').html();

        let reviewedBook = data.readBooks.find(x => x.book.title === bookTitle);
        let book = reviewedBook.book;

        $('#book-img').attr('src', book.cover._downloadURL);
        $('#book-info .book-content h2').html(book.title);
        $('#book-info .book-content .book-content-author').html(`by ${book.author}`);
        $('#book-info .book-content .book-content-rating').html(`<b>Rating:</b> ${book.rating}`);
        $('#book-info .book-content .book-content-publish-year').html(`<b>Published:</b> ${book.year}`);
        $('#book-info .book-content .book-content-pages').html(`<b>Pages:</b> ${book.pages}`);
        $('#book-info .book-content .book-content-isbn').html(`ISBN:</b> ${book.isbn}`);
        $('#book-info .book-content .book-content-description').html(book.description);
    });

    $('.author-learn-more').unbind('click');
    $('.author-learn-more').on('click', function(ev) {
        let authorName = $(ev.target).parents().eq(3).find('h2').html();

        console.log(data.favoriteAuthors);

        let author = data.favoriteAuthors.find(x => { return `${x.firstName} ${x.lastName}` === authorName; });

        $('#author-img').attr('src', author.picture._downloadURL);
        $('#author-info .author-content h2').html(`${author.firstName} ${author.lastName}`);
        $('#author-info .author-content .author-content-genre').html(`<b>Genre:</b> ${author.genre}`);
        $('#author-info .author-content .author-content-birth-date').html(`<b>Date of birth:</b> ${author.dateOfBirth}`);
        $('#author-info .author-content .author-content-birth-place').html(`<b>Place of birth:</b> ${author.born}`);
        $('#author-info .author-content .author-content-description').html(author.description);

    });

    $('.book-read-review').unbind('click');
    $('.book-read-review').on('click', function(ev) {
        let bookTitle = $(ev.target).parents().eq(2).find('h2').html();

        let reviewedBook = data.readBooks.find(x => x.book.title === bookTitle);

        $('#book-review-img').attr('src', reviewedBook.book.cover._downloadURL);
        $('#book-review .book-content h2').html(reviewedBook.book.title);
        $('#book-review .book-content .book-content-rating').html(`<b>Rating:</b> ${reviewedBook.rating}`);
        $('#book-review .book-content .book-content-review').html(`${reviewedBook.review}`);
    });

    let promise = new Promise((resolve, reject) => {
        resolve(data);
    });

    return promise;
}

let eventLoader = {
    loadFrontPageEvents,
    loadAuthorsPageEvents,
    loadUserNavigationEvents,
    loadHomePageEvents,
    loadBooksPageEvents,
    loadBooksButtonEvent,
    loadProfilePageEvents,
    loadModalEvents,
    loadAuthorButtonEvent
}

export { eventLoader }
