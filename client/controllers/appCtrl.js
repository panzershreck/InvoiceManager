angular.module('app').controller('AppController', function ($location, $rootScope, $scope, $timeout) {
    var that = this;

    this.isActive = function (route) {
        return route === $location.path();
    };

    $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
        var pageTitles = {
            '/invoice': 'Накладная',
            '/request': 'Заявка',
            '/settings': 'Настройки',
            '/production': 'Список продукции',
            '/clients': 'Список клиентов',
            '/invoices': 'Архив накладных'
        };

        that.pageTitle = pageTitles[$location.path()];
    });

    var gui = require('nw.gui');

    this.closeWindow = function () {
        gui.Window.get().close();
    };

    this.maximizeWindow = function () {
        gui.Window.get().maximize();
    };

    this.minimizeWindow = function () {
        gui.Window.get().minimize();
    };

    this.restoreWindow = function () {
        gui.Window.get().restore();
    };
});