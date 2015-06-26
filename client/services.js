(function (angular) {
    angular.module('app')
        .factory('InvoiceManager', function InvoiceManagerFactory($location, Invoice, Product, Utils) {
            var current,
                queue = [],
                defaults = {
                    date: Utils.getDateWithOffset(1),
                    timestamp: Utils.getDateWithOffset(1).getTime()
                };

            return {
                setCurrent: function (invoice) {
                    current = invoice;
                },
                getCurrent: function () {
                    queue.forEach(function (invoice, i) {
                        if (current.id === invoice.id) {
                            queue.splice(i, 1);
                        }
                    });

                    return current || Invoice.build(defaults);
                    //return Invoice.findOrBuild({ where: { id: current }, include: [Product], defaults: defaults });
                },
                getDefault: function () {
                    return Invoice.build(defaults, { include: Product });
                },
                createCopy: function (invoice) {
                    var copy = Invoice.build(defaults);

                    copy.ClientId = invoice.ClientId;
                    copy.Products = invoice.Products;

                    this.setCurrent(copy);
                },
                addToQueue: function (invoice) {
                    queue.push(invoice);
                },
                getQueue: function () {
                    return queue;
                },
                clearQueue: function () {
                    queue = [];
                },
                refresh: function () {
                    current = false;
                }
            };
        })
        .factory('Utils', function UtilsFactory($q, Settings) {
            return {
                getDateWithOffset: function (offset) {
                    var date = new Date();

                    date.setHours(0, 0, 0, 0);

                    return new Date(date.getTime() + (offset || 0) * 24 * 60 * 60 * 1000);
                },
                isJsonString: function (str) {
                    try {
                        JSON.parse(str);
                    } catch (e) {
                        return false;

                    }

                    return true;
                }
            };
        })
        .factory('AlertsManager', function AlertsManagerFactory($timeout) {
            return {
                show: function ($scope, message, type, delay) {
                    $scope.alerts = [];

                    var index = $scope.alerts.push({ msg: message, type: type }) - 1;

                    $timeout(function () {
                        $scope.alerts.splice(index, 1);
                    }, delay || 2000);
                },
                getClose: function ($scope) {
                    return function (index) {
                        $scope.alerts.splice(index, 1);
                    };
                }
            };
        });
})(angular);