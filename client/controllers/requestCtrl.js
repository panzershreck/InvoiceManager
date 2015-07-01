(function (angular) {
    angular.module('app').controller('RequestController', function ($scope, $rootScope, Invoice, Client, Product, Utils) {
        $scope.datepickerOpened = false;
        $scope.date = Utils.getDateWithOffset(1);


        $scope.generateTable = function () {
            $scope.request = {};
            $scope.products = [];
            $scope.totals = {};

            $scope.isGenerated = false;
            $scope.isEmpty = true;

            Product.findAll({ order: 'title' }).then(function (products) {
                $scope.$apply(function () {
                    $scope.products = products;
                });
            });

            Invoice.findAll({
                where: {
                    timestamp: {
                        $gte: $scope.date.setHours(0, 0, 0, 0),
                        $lte: $scope.date.setHours(23, 59, 59, 100)
                    }
                },
                include: [Product, Client]
            }).then(function (invoices) {
                $scope.$apply(function () {
                    $scope.isEmpty = invoices.length === 0;

                    invoices.forEach(function (invoice) {
                        $scope.request[invoice.id] = {
                            clientTitle: invoice.Client.title,
                            products: {}
                        };

                        invoice.Products.forEach(function (product) {
                            $scope.totals[product.id] = ($scope.totals[product.id] || 0) + product.invoiceProducts.count;

                            $scope.request[invoice.id].products[product.id] = product.invoiceProducts.count;
                        });
                    });

                    $scope.isGenerated = true;
                });
            });
        };

        $scope.generateTable();

        $scope.print = function () {
            window.print();
        };

        $scope.today = function () {
            $scope.date = new Date();

            $scope.generateTable();
        };

        $scope.tomorrow = function () {
            $scope.date = Utils.getDateWithOffset(1);

            $scope.generateTable();
        };

        $scope.yesterday = function () {
            $scope.date = Utils.getDateWithOffset(-1);

            $scope.generateTable();
        };

        $scope.openDatepicker = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.datepickerOpened = true;
        };
    });
})(angular);