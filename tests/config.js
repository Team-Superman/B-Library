SystemJS.config({
     'transpiler': 'plugin-babel',
     'map': {
         'plugin-babel': '../node_modules/systemjs-plugin-babel/plugin-babel.js',
         'systemjs-babel-build': '../node_modules/systemjs-plugin-babel/systemjs-babel-browser.js',

         //Libraries:
         'jquery': '../bower_components/jquery/dist/jquery.js',
         'sammy': '../bower_components/sammy/lib/sammy.js',
         'handlebars': '../bower_components/handlebars/handlebars.js',
         'toastr': '../bower_components/toastr/toastr.js',
         'cryptojs': '../bower_components/crypto-js/crypto-js.js',

         //Utils
         'requester': '../js/utils/requester.js',
         'header-generator': '../js/utils/header-generator.js',
         'template-generator': '../js/utils/template-generator.js',
         'notifier': '../js/utils/notifier.js',
         'validator': '../js/utils/validator.js',

         //Constants
         'application-urls': '../js/utils/constants/application-urls.js',
         'kinvey-urls': '../js/utils/constants/kinvey-urls.js',

         //Controllers
         'page-controller': '../js/controllers/page-controller.js',
         'event-controller': '../js/controllers/event-controller.js',

         //Models
         'user-model': '../js/models/user-model.js',

         //Main script
         'tests': './js/tests.js'
     }
 });

System.import('tests');
