import { notifier } from 'notifier';

let validator = (function() {
    function validatePassword() {
        if ($('#input-password').val() !== $('#input-confirm-password').val()) {
            notifier.show('Confirm password field is different than password field', 'error');
            return false;
        }

        if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test($('#input-password').val())) {
            notifier.show('Password must contain at least one upper case letter, one lower case and one digit!',
                'error');
            return false;
        }

        return true;
    }

    function validateUsername(username) {
        if (username.length < 4 || username.length > 20) {
            notifier.show('Username must be between 4 and 20 characters long inclusive!', 'error');
            return false;
        }

        return true;
    }

    function validateNames(firstname, lastname) {
        if (/[^A-Za-z]/.test(firstname) ||
            /[^A-Za-z]/.test(lastname) ||
            firstname.length < 1 ||
            lastname.length < 1) {
            notifier.show('Firt and Last name must have at least 1 charercter and can contain only latin letters!', 'error');
            return false;
        }

        return true;
    }

    function validateEmail(email) {
        if (!(/^\w.+@[a-zA-Z]+?\.[a-zA-Z]{2,3}$/.test(email))) {
            notifier.show('Email must be in the following format name@maildomain where "name" can contain latin letters, numbers, _ and .',
              'error');
            return false;
        }

        return true;
    }

    return {
        validateUsername,
        validatePassword,
        validateNames,
        validateEmail
    }
})();

export { validator }
