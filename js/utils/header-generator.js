'use strict';

import 'jquery';
import {kinveyUrls} from 'kinvey-urls';

let header = (function () {

  function createBasicCredentials(){
    let token = btoa(`${kinveyUrls.KINVEY_APP_ID}:${kinveyUrls.KINVEY_APP_SECRET}`);

    let authorization = `Basic ${token}`;

    return authorization;
  }

  class Header{
    getHeader(authorizationRequired, dataRequired){
      let headers = {};

      if(authorizationRequired){
        //TODO: make this part after making users
      }else{
          headers.Authorization = createBasicCredentials();
      }

      return headers;
    }
  }

  return new Header();
}());

export {header}
