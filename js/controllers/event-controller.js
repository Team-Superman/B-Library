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
            validator.validateEmail(user.email) &&
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

function loadHomePageEvents(data) {
    $('.book-learn-more').on('click', function(ev) {
        let bookTitle = $(ev.target).parent().find('h2').html();
        let book = data.books.find(x => x.title === bookTitle);

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
        let authorNames = $(ev.target).parent().find('h2').html().split(' ');
        let author = data.authors.find(x => x.firstName === authorNames[0] && x.lastName === authorNames[1]);

        $('#author-img').attr('src', author.picture._downloadURL);
        $('#author-info .author-content h2').html(`${author.firstName} ${author.lastName}`);
        $('#author-info .author-content .author-content-genre').html(`<b>Genre:</b> ${author.genre}`);
        $('#author-info .author-content .author-content-birth-date').html(`<b>Date of birth:</b> ${author.dateOfBirth}`);
        $('#author-info .author-content .author-content-birth-place').html(`<b>Place of birth:</b> ${author.born}`);
        $('#author-info .author-content .author-content-description').html(author.description);

    });
}

function loadAuthorsPageEvents(data) {
    $('#no-results-paragraph').hide();
    $('#search-author-button').on('click', function(ev) {     
       
        let firstNameValue = $('#first-name-search').val();
        let lastNameValue = $('#last-name-search').val();  
        //TODO:filter(x => x.firstName)

        
        function searchByFirstName(firstNameValue){                
            if (firstNameValue !== "") {          
                let newArray = data.authors.filter(x => x.firstName.indexOf(firstNameValue) >= 0); 
                console.log("here");
                console.log(newArray);
                if(newArray.length === 0){
                    $('#no-results-paragraph').show();                    
                } else {
                    $('#no-results-paragraph').hide();                    
                }          
                newArray.forEach(function(element){                    
                    $(`#${element._id}`).show();
                });                
            }    
        }          

        function searchByLastName(lastNameValue){                              
            if (lastNameValue !== "") {          
            let newArray = data.authors.filter(x => x.lastName.indexOf(lastNameValue) >= 0);
            if(newArray.length === 0){
                    $('#no-results-paragraph').show();                    
            } else {
                    $('#no-results-paragraph').hide();                    
            }    
            newArray.forEach(function(element){                    
                $(`#${element._id}`).show();
            });                
            }
        }


        searchByFirstName(firstNameValue);
        searchByLastName(lastNameValue);
        


       

    });

    $('#first-name-search').on('input', function(ev) {     
        data.authors.forEach(function(element){
            $(`#${element._id}`).hide();
        });
        
        $('#search-name-change').text("Search Results");
    });

    $('#last-name-search').on('input', function(){
        data.authors.forEach(function(element){
            $(`#${element._id}`).hide();
        });

        $('#search-name-change').text("Search Results");
    });

    $('#show-all-authors').on('click', function() {       
        data.authors.forEach(function(element){
            $(`#${element._id}`).show();
        });
    });


}

function loadBooksPageEvents(data) {  
    $('#no-results-paragraph').hide();

    $('#search-book-button').on('click', function(){
        let bookTitleValue = $('#book-title-search').val();
        let bookGenreValue = $('#book-genre-search').val();  

         function searchByTitle(bookTitleValue){                
            if (bookTitleValue !== "") {          
                let newArray = data.books.filter(x => x.title.indexOf(bookTitleValue) >= 0); 
                console.log("here");
                console.log(newArray);
                if(newArray.length === 0){
                    $('#no-results-paragraph').show();                    
                } else {
                    $('#no-results-paragraph').hide();                    
                }          
                newArray.forEach(function(element){                    
                    $(`#${element._id}`).show();
                });                
            }    
        }          

        function searchByGenre(bookGenreValue){                              
            if (bookGenreValue !== "") {          
                let newArray = data.books.filter(x => x.genre.indexOf(bookGenreValue) >= 0);
                if(newArray.length === 0){
                        $('#no-results-paragraph').show();                    
                } else {
                        $('#no-results-paragraph').hide();                    
                }    
                newArray.forEach(function(element){                    
                    $(`#${element._id}`).show();
                });                
            } 
        }


       searchByTitle(bookTitleValue);
       searchByGenre(bookGenreValue);

    })

    $('#show-all-books').on('click', function() {
            console.log(data.books);
        data.books.forEach(function(element){
            $(`#${element._id}`).show();
        });
    });

    $('#book-title-search').on('input', function(ev) {     
        data.books.forEach(function(element){
            $(`#${element._id}`).hide();
        });
        
        $('#search-name-change').text("Search Results");
    });

    $('#book-genre-search').on('input', function(){
        data.books.forEach(function(element){
            $(`#${element._id}`).hide();
        });

        $('#search-name-change').text("Search Results");
    });



}


let eventLoader = {
    loadFrontPageEvents,
    loadAuthorsPageEvents,
    loadUserNavigationEvents,
    loadHomePageEvents,
    loadBooksPageEvents
}

export { eventLoader }
