'use strict';

const KINVEY_APP_ID = 'kid_SJuw__R3',
      KINVEY_APP_SECRET = '944d173ef3234dad97ebfd260ed0866a',
      KINVEY_BASE_URL = 'https://baas.kinvey.com',
      KINVEY_USER_URL = `${KINVEY_BASE_URL}/user/${KINVEY_APP_ID}`,
      KINVEY_APPDATA_URL = `${KINVEY_BASE_URL}/appdata/${KINVEY_APP_ID}`,
      KINVEY_BOOKS_URL = `${KINVEY_APPDATA_URL}/books`,
      KINVEY_AUTHORS_URL = `${KINVEY_APPDATA_URL}/authors`,
      KINVEY_AVATAR_IDS = ['57efc5828a9b42fe6cb4b479', '57efc81c400f60af530288a9', '57efc86f853cf76723f1c7e8',
                           '57efc8d48eb6eedf66a547ad', '57efc90cebbf986646a20f07', '57efc9368a9b42fe6cb4c831',
                           '57efc9908eb6eedf66a54af1', '57efca20ebbf986646a2155e', '57efd7538a9b42fe6cb515a1',
                           '57efd758853cf76723f218c3'];

let kinveyUrls = {
  KINVEY_APP_ID,
  KINVEY_APP_SECRET,
  KINVEY_USER_URL,
  KINVEY_APPDATA_URL,
  KINVEY_BOOKS_URL,
  KINVEY_AUTHORS_URL,
  KINVEY_AVATAR_IDS
}

export {kinveyUrls}
