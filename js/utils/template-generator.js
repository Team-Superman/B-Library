'use strict';

import handlebars from 'handlebars';
import Handlebars from 'handlebars';
import 'jquery';

var cache = {};

function get(name){
  let promise = new Promise((resolve, reject) => {

    if(cache[name]){
     resolve(cache[name]);
     return;
    }

    let url = `templates/${name}.handlebars`;
    $.get(url, function(templateHtml){
      let template = handlebars.compile(templateHtml);
      cache[name] = template;
      resolve(template);
    })
  });

  return promise;
}

let template = {
  get: get
};

export {template}
