var dbFile = 'database.sqlite',
    Sequelize = require('sequelize'),
    sequelize = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    // SQLite only
    storage: dbFile
});

angular.module('app', [
    'ui.bootstrap',
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap.showErrors',
    'ui.select',
    'ngSanitize',
    'ui.sortable'
]);

angular.module('app').config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/invoice', {
            templateUrl: 'client/views/invoice/index.html',
            controller: 'InvoiceController'
        })
        .when('/request', {
            templateUrl: 'client/views/request/index.html',
            controller: 'RequestController'
        })
        .when('/production', {
            templateUrl: 'client/views/lists/production.html',
            controller: 'ProductionListController'
        })
        .when('/clients', {
            templateUrl: 'client/views/lists/clients.html',
            controller: 'ClientsListController'
        })
        .when('/invoices', {
            templateUrl: 'client/views/lists/invoices.html',
            controller: 'InvoicesListController'
        })
        .when('/settings', {
            templateUrl: 'client/views/settings/index.html',
            controller: 'SettingsController'
        })
        .otherwise({ redirectTo: '/invoice' });
});

angular.module('app').run(function ($rootScope, Settings) {
    Settings.findOrCreate({ where: 1 }).then(function (result) {
        $rootScope.settings = result[0];
    });
});