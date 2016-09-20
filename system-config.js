'use strict';

SystemJS.config({
  'transpiler': 'plugin-babel',
    'map': {
        'plugin-babel': './node_modules/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': './node_modules/systemjs-plugin-babel/systemjs-babel-browser.js',

        //Libraries:
        'jquery': './node_modules/jquery/dist/jquery.js',
        'handlebars': './bower_components/handlebars/handlebars.min.js',
        'toastr': './bower_components/toastr/toastr.min.js',
        'sammy': './bower_components/sammy/lib/min/sammy-latest.min.js',

        //Utils
        'application-urls' : './js/utils/constants/application-urls.js',

        //Main script
        'app': './js/app.js'
      }
});

System.import('app');
