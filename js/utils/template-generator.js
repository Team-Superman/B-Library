'use strict';

import handlebars from 'handlebars';
import Handlebars from 'handlebars';
import 'jquery';

function get(name){
  let promise = new Promise((resolve, reject) => {
    let url = `templates/${name}.handlebars`;
    $.get(url, function(templateHtml){
      let template = handlebars.compile(templateHtml);

      resolve(template);
    })
  });

  return promise;
}

let template = {
  get: get
};

export {template}
