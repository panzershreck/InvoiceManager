(function (angular) {
    angular.module('app')
        .controller('InvoiceController', function ($scope, $timeout, $filter, Client, Product, Invoice, InvoiceManager, AlertsManager, Utils) {
            $scope.currentInvoice = InvoiceManager.getCurrent();

            $scope.printQueue = InvoiceManager.getQueue();

            $scope.productFilter = {};

            $scope.products = [];
            $scope.alerts = [];
            $scope.isSaving = false;
            $scope.page = {
                isCollapsed: true
            };

            var productsList;

            Product.findAll({ order: 'position' }).then(function (products) {
                productsList = products;

                getInvoiceProducts($scope.currentInvoice, products, $filter('getById'), $scope);

                $scope.page.isCollapsed = false;
            });

            Client.findAll().then(function (clients) {
                $scope.$apply(function () {
                    $scope.clients = clients.map(function (client) {
                        return {
                            id: client.id,
                            title: client.title
                        };
                    });
                });
            });

            $scope.toQueue = function () {
                $scope.saveInvoice(function () {
                    $scope.currentInvoice.printCopies = 1;

                    InvoiceManager.addToQueue($scope.currentInvoice);

                    $scope.reset();
                });
            };

            $scope.saveInvoice = function (callback) {
                $scope.$broadcast('show-errors-check-validity');

                if (!$scope.invoiceForm.$valid) {
                    return;
                }

                $scope.isSaving = true;

                $scope.currentInvoice
                    .set({
                        date: $scope.currentInvoice.date,
                        timestamp: $scope.currentInvoice.date.getTime(),
                    })
                    .save()
                    .then(function (invoice) {
                        invoice.setProducts($scope.products.filter(function (product) {
                            return product.invoiceProducts.count > 0;
                        })).then(function () {
                            invoice.setClient($scope.currentInvoice.ClientId);

                            Invoice.findOne({
                                where: { id: invoice.id },
                                include: [Client, Product]
                            }).then(function (invoice) {
                                $scope.$apply(function () {
                                    AlertsManager.show($scope, 'Накладная сохранена', 'success');

                                    $scope.currentInvoice = invoice;
                                    $scope.getTotal();

                                    $scope.products.forEach(function (product) {
                                        product.invoiceProducts.count = 0;
                                    });

                                    InvoiceManager.setCurrent(invoice.id);

                                    $scope.isSaving = false;

                                    if (callback) {
                                        callback();
                                    }
                                });
                            });
                        });
                    });
            };

            $scope.reset = function () {
                $scope.currentInvoice = InvoiceManager.getDefault();
                InvoiceManager.refresh();

                $scope.invoiceForm.$setPristine();
                $scope.invoiceForm.$setUntouched();

                $scope.$broadcast('show-errors-reset');
            };

            $scope.getTotal = function () {
                if (!$scope.currentInvoice) {
                    return;
                }

                $scope.currentInvoice.totals = {
                    count: 0,
                    sum: 0
                };

                $scope.products.forEach(function (product) {
                    if (product.invoiceProducts.count > 0) {
                        $scope.currentInvoice.totals.sum += product.price * product.invoiceProducts.count;
                        $scope.currentInvoice.totals.count += product.invoiceProducts.count;
                    }
                });

                return $scope.currentInvoice.totals;
            };

            $scope.closeAlert = AlertsManager.getClose($scope);

            $scope.today = function () {
                $scope.currentInvoice.date = new Date();
            };

            $scope.tomorrow = function () {
                $scope.currentInvoice.date = Utils.getDateWithOffset(1);
            };

            $scope.yesterday = function () {
                $scope.currentInvoice.date = Utils.getDateWithOffset(-1);
            };

            $scope.openDatepicker = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.datepickerOpened = true;
            };

            $scope.$on('invoice:edit', function (event, index) {
                event.stopPropagation();

                $scope.currentInvoice = $scope.printQueue.splice(index, 1)[0];

                getInvoiceProducts($scope.currentInvoice, productsList, $filter('getById'), $scope);
            });

            $scope.$on('queue:clear', function (event) {
                event.stopPropagation();

                $scope.printQueue = [];
                InvoiceManager.clearQueue();
            });

            function getInvoiceProducts(invoice, products, filter, $scope) {
                $scope.$apply(function () {
                    $scope.products = products.map(function (product) {
                        var prod = (invoice.Products && invoice.Products.length > 0) ? filter(invoice.Products, product.id, 'invoiceProducts') : null;

                        product.invoiceProducts = {
                            count: prod ? prod.count : null,
                            price: product.price
                        };

                        return product;
                    });
                });
            }
        })

        .controller('PrintQueueController', function ($scope, $timeout, $rootScope) {
            $rootScope.pageSize = 'landscape';

            $scope.invoicesForPrint = [];

            $scope.clear = function () {
                $scope.$emit('queue:clear');
            };

            $scope.print = function (queue) {
                angular.forEach(queue, function (invoice) {
                    for (var i = 1; i <= invoice.printCopies; i++) {
                        $scope.invoicesForPrint.push(invoice);
                    }
                });

                $timeout(function () {
                    window.print();

                    $scope.invoicesForPrint = [];
                }, 100);
            };

            $scope.edit = function (index) {
                $scope.$emit('invoice:edit', index);
            };

            $scope.remove = function (index, queue) {
                queue.splice(index, 1);
            };
        });
})(angular);