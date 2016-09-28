'use strict';

import handlebars from 'handlebars';
import Handlebars from 'handlebars';
import 'jquery';

var cache = {};

(function() {
    handlebars.registerHelper('for', function(from, to, incr, block) {
        var accum = '';
        for (var i = from; i < to + 1; i += incr) {
            accum += block.fn(i);
        }
        return accum;
    });
})()

function get(name) {
    let promise = new Promise((resolve, reject) => {

        if (cache[name]) {
            resolve(cache[name]);
            return;
        }

        let url = `templates/${name}.handlebars`;
        $.get(url, function(templateHtml) {
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

export { template }