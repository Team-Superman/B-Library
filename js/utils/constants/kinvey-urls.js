'use strict';

const KINVEY_APP_ID = 'kid_SJuw__R3',
      KINVEY_APP_SECRET = '944d173ef3234dad97ebfd260ed0866a',
      KINVEY_BASE_URL = 'https://baas.kinvey.com',
      KINVEY_USER_URL = `${KINVEY_BASE_URL}/user/${KINVEY_APP_ID}`,
      KINVEY_APPDATA_URL = `${KINVEY_BASE_URL}/appdata/${KINVEY_APP_ID}`,
      KINVEY_BOOKS_URL = `${KINVEY_APPDATA_URL}/books`,
      KINVEY_AUTHORS_URL = `${KINVEY_APPDATA_URL}/authors`;

let kinveyUrls = {
  KINVEY_APP_ID,
  KINVEY_APP_SECRET,
  KINVEY_USER_URL,
  KINVEY_APPDATA_URL,
  KINVEY_BOOKS_URL,
  KINVEY_AUTHORS_URL
}

export {kinveyUrls}
