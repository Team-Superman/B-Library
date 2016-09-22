'use strict';

import 'jquery';

let request = (function () {

    function createRequest(url, method, headers, data) {
        let promise = new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                method: method,
                headers: headers,
                data: data ? JSON.stringify(data) : null,
                success(response) {
                    resolve(response);
                },
                error(error) {
                    reject(error);
                }
            });
        });

        return promise;
    }

    class Requester {
      constructor(){
      }

        get(url, headers) {
            return createRequest(url, 'GET', headers);
        }

        post(url, headers, data) {
            return createRequest(url, 'POST', headers, data);
        }

        put(url, headers, data) {
            return createRequest(url, 'PUT', headers, data);
        }

        delete(url, headers) {
            return createRequest(url, 'DELETE', headers);
        }
    }

    return new Requester('asd');
}());

export {request}
