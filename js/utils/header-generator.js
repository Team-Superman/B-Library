'use strict';

import 'jquery';
import { kinveyUrls } from 'kinvey-urls';
import { userModel } from 'user-model';

let header = (function() {

    function createUserCredentials() {
        let authtoken = userModel.current().authtoken;
        let authorization = `Kinvey ${authtoken}`;

        return authorization;
    }

    function createBasicCredentials() {
        let token = btoa(`${kinveyUrls.KINVEY_APP_ID}:${kinveyUrls.KINVEY_APP_SECRET}`);
        let authorization = `Basic ${token}`;

        return authorization;
    }

    class Header {
        getHeader(authorizationRequired, dataRequired) {
            let headers = {};

            if (authorizationRequired) {
                headers.Authorization = createUserCredentials();
            } else {
                headers.Authorization = createBasicCredentials();
            }

            return headers;
        }
    }

    return new Header();
}());

export { header }