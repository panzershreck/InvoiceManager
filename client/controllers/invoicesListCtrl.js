(function (angular) {
    angular.module('app')
        .controller('InvoicesListController', function ($scope, $filter, $modal, $location, $rootScope, Invoice, Client, Product, InvoiceManager, Utils) {
            $scope.invoices = [];

            $scope.currentPage = 1;
            $scope.itemsPerPage = 10;
            $scope.numPages = undefined;

            $scope.edit = function (invoice) {
                InvoiceManager.setCurrent(invoice);

                $location.path('/invoice');
            };

            $scope.copy = function (invoice) {
                InvoiceManager.createCopy(invoice);

                $location.path('/invoice');
            };

            $scope.isEditable = function (invoice) {
                if ($scope.settings.invoiceEditPeriod < 0) {
                    return true;
                } else {
                    invoice.date.setHours(0, 0, 0, 0);

                    return invoice.date > Utils.getDateWithOffset(-$rootScope.settings.invoiceEditPeriod);
                }
            };

            $scope.isCurrentDate = function (date) {
                return date.toDateString() === Utils.getDateWithOffset(1).toDateString();
            };

            $scope.updateList = function () {
                Invoice.findAndCountAll({
                    order: [['date', 'DESC'], ['updatedAt', 'DESC']],
                    limit: $scope.itemsPerPage,
                    offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
                    include: [Client, Product]
                }).then(function (result) {
                    $scope.$apply(function () {
                        result.rows.forEach(function (invoice) {
                            invoice.sum = 0;
                            
                            invoice.Products.forEach(function (product) {
                                invoice.sum += product.invoiceProducts.count * product.invoiceProducts.price;
                            });
                        });

                        $scope.invoices = result.rows;
                        $scope.totalItems = result.count;
                    });
                });
            };

            $scope.updateList();

            $scope.remove = function (invoice, index) {

                var modalInstance = $modal.open({
                    templateUrl: 'client/views/removeModal.html',
                    animation: false,
                    controller: function ($scope, $modalInstance) {
                        $scope.name = 'Накладная для "' + invoice.Client.title + '" от ' + $filter('date')(invoice.date, 'mediumDate');

                        $scope.ok = function () {
                            $modalInstance.close();
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss();
                        };
                    },
                    size: 'sm'
                });

                modalInstance.result.then(function () {
                    invoice.destroy().then(function () {
                        $scope.$apply(
                            $scope.invoices.splice(index, 1)
                        );
                    });
                }, function () {
                });
            };
        });
})(angular);