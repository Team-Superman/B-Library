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

let eventLoader = (function(){

  function getUserLoginDetails() {
      let user = {
          "username": $('#login-username').val(),
          "password": CryptoJS.SHA1($('#login-password').val()).toString(),
      }

      return user;
  };

  class EventController {

    loadFrontPageEvents() {

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
            let randomAvatarNumber = Math.floor(Math.random() * 10)
            let user = {
                "username": $('#input-username').val(),
                "password": CryptoJS.SHA1($('#input-password').val()).toString(),
                "firstName": $('#input-first-name').val(),
                "lastName": $('#input-last-name').val(),
                "email": $('#input-email-address').val(),
                "favoriteAuthors": {},
                "readBooks": [],
                "avatar": {
                    "_type": "KinveyRef",
                    "_id": kinveyUrls.KINVEY_AVATAR_IDS[randomAvatarNumber],
                    "_collection": "avatars"
                }
            };

            if (validator.validateNames(user.firstName, user.lastName) &&
                validator.validateUsername(user.username) &&
                validator.validateEmail(user.email) &&
                validator.validatePassword()) {
                userModel.register(user);
            }
        });
    };

    loadUserNavigationEvents() {
        $('#sign-out-user').on('click', function(ev) {
            userModel.logout();
        });
    };

    loadAuthorModalEvent(data) {
        $('.author-learn-more').on('click', function(ev) {
            let authorName = $(ev.target).parent().find('h2').html();
            if (!authorName) {
                authorName = $(ev.target).parents().eq(2).find('h2').html();
            }

            let author = data.authors.find(x => { return `${x.firstName} ${x.lastName}` === authorName; });

            $('#author-img').attr('src', author.picture._downloadURL);
            $('#author-info .author-content h2').html(`${author.firstName} ${author.lastName}`);
            $('#author-info .author-content .author-content-genre').html(`<b>Genre:</b> ${author.genre}`);
            $('#author-info .author-content .author-content-birth-date').html(`<b>Date of birth:</b> ${author.dateOfBirth}`);
            $('#author-info .author-content .author-content-birth-place').html(`<b>Place of birth:</b> ${author.born}`);
            $('#author-info .author-content .author-content-description').html(author.description);

        });
    };

    loadAuthorContainerEvents(data) {
        this.loadAuthorModalEvent(data);

        $('.page').on('click', function(ev) {
            let $this = $(ev.target);
            let pageNumber = $this.html();
            let startIndex = (pageNumber * 4) - 4;
            for (let i = startIndex; i < startIndex + 4; i += 1) {
                let fieldID = `#author-field-${i - startIndex}`;
                let selectorCover = `${fieldID} .thumbnail img`;
                let selectorHiddenTitle = `${fieldID} .thumbnail h2`;
                let selectorAnchor = `${fieldID} .thumbnail > a `;
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
    };

    loadBookModalEvent(data) {
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

        $('.mark-as-read').on('click', function(ev) {
            let bookTitle = $(ev.target).parent().find('h2').html();
            if (!bookTitle) {
                bookTitle = $(ev.target).parents().eq(2).find('h2').html();
            }

            $('#book-read').find('legend').html(bookTitle);
        });
    };

    loadBooksContainerEvent(data) {
        this.loadBookModalEvent(data);

        $('.page').on('click', function(ev) {
            let $this = $(ev.target);
            let pageNumber = $this.html();
            let booksOnPage = data.firstBooks.length;
            let startIndex = (pageNumber * booksOnPage) - booksOnPage;
            for (let i = startIndex; i < startIndex + booksOnPage; i += 1) {
                let fieldID = `#book-field-${i - startIndex}`;
                let selectorCover = `${fieldID} .thumbnail img`;
                let selectorHiddenTitle = `${fieldID} .thumbnail h2`;
                let selectorAnchor = `${fieldID} .thumbnail > a`;
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
      };

      loadModalEvents(data) {
          this.loadAuthorModalEvent(data);
          this.loadBookModalEvent(data);

          let promise = new Promise((resolve, reject) => {
              resolve(data);
          })

          return promise;
      };

      loadHomePageEvents(data) {
          let promise = new Promise((resolve, reject) => {
              resolve(data);
          })

          return promise;
      };

      loadAuthorsPageEvents(data) {
          this.loadAuthorContainerEvents(data);
          let that = this;

          $('.btn-search').on('click', function(ev) {
              let matchedAuthors = {};
              let pattern = $('.input-author-search').val();
              matchedAuthors.authors = data.authors.filter((author) =>
                  author.firstName.toLowerCase().indexOf(pattern.toLowerCase()) >= 0 ||
                  author.lastName.toLowerCase().indexOf(pattern.toLowerCase()) >= 0);
              let selector = '.search-authors';

              matchedAuthors.totalAuthorPages = matchedAuthors.authors.length / 4;
              matchedAuthors.firstAuthors = matchedAuthors.authors.slice(0, 4);

              template.get('list-authors')
                  .then(temp => pageLoader.loadColletionsList(temp, matchedAuthors, selector))
                  .then(() => that.loadAuthorContainerEvents(matchedAuthors));

          })

          let promise = new Promise((resolve, reject) => {
              resolve(data);
          });

          return promise;
      };

      loadBooksPageEvents(data) {
          this.loadBooksContainerEvent(data);
          let that = this;

          $('.btn-search').on('click', function(ev) {
              let matchedBooks = {};
              let pattern = $('.input-book-search').val();
              matchedBooks.books = data.books.filter((book) => {
                  return book.title.toLowerCase().indexOf(pattern.toLowerCase()) >= 0
              });
              let selector = '.search-books';

              matchedBooks.totalBookPages = matchedBooks.books.length / 8;
              matchedBooks.firstBooks = matchedBooks.books.slice(0, 8);

              template.get('list-books')
                  .then(temp => pageLoader.loadColletionsList(temp, matchedBooks, selector))
                  .then(() => that.loadBooksContainerEvent(matchedBooks));

          })

          $('.btn-book-genre').on('click', function(ev){
            let matchedBooks = {};
            let pattern = $(ev.target).html();
            matchedBooks.books = data.books.filter((book) => {
              return book.genre.toLowerCase().indexOf(pattern.toLowerCase()) >=0;
            });
            let selector = '.search-books';

            matchedBooks.totalBookPages = matchedBooks.books.length / 8;
            matchedBooks.firstBooks = matchedBooks.books.slice(0, 8);

            template.get('list-books')
                .then(temp => pageLoader.loadColletionsList(temp, matchedBooks, selector))
                .then(() => that.loadBooksContainerEvent(matchedBooks));
          });

          let promise = new Promise((resolve, reject) => {
              resolve(data);
          });

          return promise;
      };

      loadBooksButtonEvent(data) {
        let books;
        if(data.books){
          books = data.books;
        }else if(data.readBooks){
          books = data.readBooks.map(b => {return b.book});
        }

          $('.read-review').on('click', function(ev) {
              let reviewModal = $(ev.target).parent().parent();

              let bookTitle = reviewModal.find('legend').html();
              let book = books.find(x => x.title === bookTitle);

              let review = reviewModal.find('textarea').val();
              let rating = reviewModal.find('select').val() | 0;

              let head = header.getHeader(true, false);
              head['add-book'] = 'true';

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


          $('.close-read').on('click', function(ev) {
              let reviewModal = $(ev.target).parent().parent();

              reviewModal.find('textarea').val('');
              reviewModal.find('select').val('1');
          });

          let promise = new Promise((resolve, reject) => {
              resolve(data);
          });

          return promise;
      };

      loadAuthorButtonEvent(data) {
        let authors;
        if(data.authors){
          authors = data.authors;
        }else if(data.favoriteAuthors){
           authors = data.favoriteAuthors;
        }

          $('.author-add-favorite').on('click', function(ev) {
              let authorName = $(ev.target).parent().find('h2').html();
              if (!authorName) {
                  authorName = $(ev.target).parents().eq(2).find('h2').html();
              }

              let author = authors.find(x => { return `${x.firstName} ${x.lastName}` === authorName });
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

      loadUserContainerEvents(data) {
          $('.page').on('click', function(ev) {
              let $this = $(ev.target);
              let users = data.users;
              let pageNumber = $this.html();
              let startIndex = (pageNumber * 8) - 8;

              for (let i = startIndex; i < startIndex + 8; i += 1) {
                  let fieldID = `#user-field-${i - startIndex}`;
                  if (users[i]) {
                      let selectorProfile = `${fieldID} .profile-links`;
                      let selectorImg = `${fieldID} .users-image`;
                      let selectorUsername = `${fieldID} .profile-content-community h3`;
                      let selectorName = `${fieldID} .user-personal-name`;
                      $(selectorProfile).attr('href', `./#/community/${users[i].username}`)
                      $(selectorImg).attr('src', `${users[i].avatar.avatar._downloadURL}`)
                      $(selectorUsername).html(users[i].username);
                      $(selectorName).html(`${users[i].firstName} ${users[i].lastName}`);
                      $(fieldID).show();
                  } else {
                      $(fieldID).hide();
                  }

              }
          });
      };

      loadUserPageEvents(data) {
          this.loadUserContainerEvents(data);
          let that = this;

          $('.btn-search').on('click', function(ev) {
              let matchedUsers = {};
              let pattern = $('.input-user-search').val();
              matchedUsers.users = data.users.filter((user) =>
                  user.firstName.toLowerCase().indexOf(pattern.toLowerCase()) >= 0 ||
                  user.lastName.toLowerCase().indexOf(pattern.toLowerCase()) >= 0 ||
                  user.username.toLowerCase().indexOf(pattern.toLowerCase()) >= 0);
              let selector = '.search-users';
              matchedUsers.totalUserPages = matchedUsers.users.length / 8;
              matchedUsers.firstUsers = matchedUsers.users.slice(0, 8);
              matchedUsers.noUsers = matchedUsers.totalUserPages <= 0;
              template.get('list-users')
                  .then(temp => pageLoader.loadColletionsList(temp, matchedUsers, selector))
                  .then(() => that.loadUserContainerEvents(matchedUsers));

          })
      };

      loadProfilePageEvents(data) {

          this.loadBooksButtonEvent(data);
          this.loadAuthorButtonEvent(data);

          $('.page').on('click', function(ev) {
              let $this = $(ev.target);
              let pageNumber = $this.html();
              let startIndex = (pageNumber * 4) - 4;

              for (let i = startIndex; i < startIndex + 4; i += 1) {
                  if ($this.parents('#read-books').length > 0) {
                      let fieldID = `#book-field-${i - startIndex}`;
                      let selectorCover = `${fieldID} .thumbnail img`;
                      let selectorHiddenTitle = `${fieldID} .thumbnail h2`;
                      let selectorAnchor = `${fieldID} .thumbnail > a`
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
                      let selectorAnchor = `${fieldID} .thumbnail > a`;
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

          $('.author-learn-more').on('click', function(ev) {
              let authorName = $(ev.target).parents().eq(3).find('h2').html();
              let author = data.favoriteAuthors.find(x => { return `${x.firstName} ${x.lastName}` === authorName; });

              $('#author-img').attr('src', author.picture._downloadURL);
              $('#author-info .author-content h2').html(`${author.firstName} ${author.lastName}`);
              $('#author-info .author-content .author-content-genre').html(`<b>Genre:</b> ${author.genre}`);
              $('#author-info .author-content .author-content-birth-date').html(`<b>Date of birth:</b> ${author.dateOfBirth}`);
              $('#author-info .author-content .author-content-birth-place').html(`<b>Place of birth:</b> ${author.born}`);
              $('#author-info .author-content .author-content-description').html(author.description);

          });

          $('.book-read-review').on('click', function(ev) {
              let bookTitle = $(ev.target).parents().eq(2).find('h2').html();
              let reviewedBook = data.readBooks.find(x => x.book.title === bookTitle);

              $('#book-review-img').attr('src', reviewedBook.book.cover._downloadURL);
              $('#book-review .book-content h2').html(reviewedBook.book.title);
              $('#book-review .book-content .book-content-rating').html(`<b>Rating:</b> ${reviewedBook.rating}`);
              $('#book-review .book-content .book-content-review').html(`${reviewedBook.review}`);
          });

          $('.mark-as-read').on('click', function(ev) {
              let bookTitle = $(ev.target).parent().find('h2').html();
              if (!bookTitle) {
                  bookTitle = $(ev.target).parents().eq(2).find('h2').html();
              }

              $('#book-read').find('legend').html(bookTitle);
          });

          $('.book-remove-read').on('click', function(ev) {
              let bookTitle = $(ev.target).parents().eq(2).find('h2').html();
              let reviewedBook = data.readBooks.find(x => x.book.title === bookTitle);
              let newUser = {};
              let bookIndex = -1;
              let head = header.getHeader(true, false);

              request.get(`${kinveyUrls.KINVEY_USER_URL}/?pattern=${localStorage.USER_NAME}&resolve_depth=2&retainReferences=false`, head)
                  .then((user) => {
                      newUser = user[0];

                      for (var i = 0, len = newUser.readBooks.length; i < len; i += 1) {
                          if (newUser.readBooks[i].book._id === reviewedBook.book._id) {
                              bookIndex = i;
                          }
                      }

                      if (bookIndex >= 0) {
                          newUser.readBooks.splice(bookIndex, 1);
                      }else{
                        throw new Error("Book has already been removed from read. Please, reload page to see changes");
                      }
                  })
                  .then(() => { return request.put(`${kinveyUrls.KINVEY_USER_URL}/${localStorage.USER_ID}`, head, newUser); })
                  .then(() => { return request.get(`${kinveyUrls.KINVEY_BOOKS_URL}/${reviewedBook.book._id}`, head); })
                  .then((book) => {

                      let oldCountRead = reviewedBook.book.countRead;
                      let oldBookRating = reviewedBook.book.rating;
                      let newCountRead = oldCountRead - 1;
                      let newBookRating = ((oldBookRating * oldCountRead) - reviewedBook.rating) / newCountRead;
                      newBookRating = Math.round(newBookRating * 10) / 10;

                      if (newCountRead === 0) {
                          newBookRating = 0;
                      }

                      book.rating = newBookRating;
                      book.countRead = newCountRead;

                      return request.put(`${kinveyUrls.KINVEY_BOOKS_URL}/${reviewedBook.book._id}`, head, book);
                  })
                  .then((response) => {
                      notifier.show('Book removed successfully. Reload page to see changes.', 'success');
                  })
                  .catch((err) => {
                      if(err.responseJSON){
                        err = err.responseJSON.error;
                      }else{
                        err = err.message;
                      }
                      notifier.show(err, 'error');
                  });
          });

          $('.author-remove-favorite').on('click', function(ev) {
              let authorName = $(ev.target).parents().eq(3).find('h2').html();
              let author = data.favoriteAuthors.find(x => { return `${x.firstName} ${x.lastName}` === authorName; });
              let newUser = {};
              let authorIndex = -1;
              let head = header.getHeader(true, false);

              request.get(`${kinveyUrls.KINVEY_USER_URL}/?pattern=${localStorage.USER_NAME}&resolve_depth=2&retainReferences=false`, head)
                  .then((user) => {
                      newUser = user[0];

                      for (var i = 0, len = newUser.favoriteAuthors.length; i < len; i += 1) {
                          if (newUser.favoriteAuthors[i]._id === author._id) {
                              authorIndex = i;
                          }
                      }

                      if (authorIndex >= 0) {
                          newUser.favoriteAuthors.splice(authorIndex, 1);
                      }else{
                        throw new Error("Author has already been removed from favorites. Please, reload to see changes.")
                      }
                  })
                  .then(() => { return request.put(`${kinveyUrls.KINVEY_USER_URL}/${localStorage.USER_ID}`, head, newUser); })
                  .then(() => { return request.get(`${kinveyUrls.KINVEY_AUTHORS_URL}/${author._id}`, head); })
                  .then((author) => {
                      author.amountOfFavorites = author.amountOfFavorites - 1;
                      return request.put(`${kinveyUrls.KINVEY_AUTHORS_URL}/${author._id}`, head, author);
                  })
                  .then((response) => {
                      notifier.show('Author removed successfully. Reload page to see changes.', 'success');
                  })
                  .catch((err) => {
                    if(err.responseJSON){
                      err = err.responseJSON.error;
                    }else{
                      err = err.message;
                    }
                      notifier.show(err, 'error');
                  });
          });

          $('.selected-avatar').on('click', function(ev) {
              let newAvatarId = $(ev.target).parent().attr('id');
              let head = header.getHeader(true, false);

              request.get(`${kinveyUrls.KINVEY_USER_URL}/${localStorage.USER_ID}`, head)
                  .then((user) => {
                      let newAvatar = {
                          '_type': 'KinveyRef',
                          '_id': newAvatarId,
                          '_collection': "avatars"
                      }
                      user.avatar = newAvatar;
                      return request.put(`${kinveyUrls.KINVEY_USER_URL}/${localStorage.USER_ID}`, head, user);
                  })
                  .then((response) => {
                      notifier.show('Avatar changed successfully. Reload page to see changes.', 'success');
                  })
                  .catch((err) => {
                    notifier.show(err, 'error');
                  });

              setTimeout(() => {
                  $('.close-read').trigger('click');
              }, 500);

          })

          let promise = new Promise((resolve, reject) => {
              resolve(data);
          });

          return promise;
      }

  };

  return new EventController();
}());

export { eventLoader }
