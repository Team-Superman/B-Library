'use strict';

import {header} from 'header-generator';
import {request} from 'requester';
import {kinveyUrls} from 'kinvey-urls';


function register(data){
  let head = header.getHeader(false, true);
  request.post(`https://baas.kinvey.com/user/${kinveyUrls.KINVEY_APP_ID}`, head, data)
         .then((data) => console.log(data));
}

function login(){

}

function logout(){

}

function current(){

}

let userModel = {register, login, logout, current};
export {userModel};
