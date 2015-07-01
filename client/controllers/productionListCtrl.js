(function (angular) {
    angular.module('app')
        .controller('ProductionListController', function ($scope, $modal, Product, Invoice, AlertsManager) {
            $scope.products = [];
            $scope.product = {
                units: 'шт.'
            };

            $scope.units = ['шт.', 'кг', 'г'];

            Product.findAll({ order: 'position' }).then(function (products) {
                $scope.$apply(function () {
                    $scope.products = products;
                });
            });

            $scope.add = function () {
                $scope.$broadcast('show-errors-check-validity');

                if (!$scope.productForm.$valid) {
                    return;
                }

                $scope.product.errors = {};

                Product.create($scope.product).then(function (product) {
                    $scope.$apply(function () {
                        $scope.products.push(product);
                        $scope.product = {};

                        AlertsManager.show($scope, 'Продукт добавлен', 'success');

                        $scope.$broadcast('show-errors-reset');
                    });
                }).catch(function (err) {
                    err.errors.forEach(function (error) {
                        $scope.product.errors[error.path] = true;
                    });
                });
            };

            $scope.update = function (product) {
                product.errors = {};

                product.save().then(function () {
                    $scope.$apply(function () {
                        AlertsManager.show($scope, 'Продукт сохранен', 'success');

                        product.editable = false;
                    });
                }).catch(function (err) {
                    err.errors.forEach(function (error) {
                        product.errors[error.path] = true;
                    });
                });
            };

            $scope.removeProduct = function (product, index) {

                var modalInstance = $modal.open({
                    templateUrl: 'client/views/removeModal.html',
                    animation: false,
                    controller: function ($scope, $modalInstance) {
                        $scope.name = product.name;

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
                    product.destroy().then(function () {
                        $scope.$apply(
                            $scope.products.splice(index, 1)
                        );
                    });
                }, function () {
                });
            };

            $scope.pressEnter = function(keyEvent, product) {
                if (keyEvent.which === 13) {
                    $scope.update(product);
                }
            };

            $scope.closeAlert = AlertsManager.getClose($scope);

            $scope.dragControlListeners = {
                orderChanged: function (event, a) {
                    $scope.products.forEach(function (product, i) {
                        product.position = i;

                        product.save();
                    });
                },
                containment: '.editable-list'
            };
        });
})(angular);