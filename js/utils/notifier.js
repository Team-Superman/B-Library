'use strict';

import * as toastr from 'toastr';

function show(message, type){
  toastr.options.closeMethod = 'fadeout';
  toastr.options.closeDuration = 1000;
  toastr.options.positionClass = 'toast-top-center';

  if(type === 'success'){
    toastr.success(message);
  }else if(type === 'error'){
    toastr.error(message);
  }
};

let notifier = {
  show
};

export {notifier};
