(function (angular) {
    angular.module('app')
        .controller('ClientsListController', function ($scope, $modal, Client, AlertsManager) {
            $scope.clients = [];
            $scope.client = {};

            Client.findAll({ order: 'title' }).then(function (clients) {
                $scope.$apply(function () {
                    $scope.clients = clients;
                });
            });

            $scope.add = function () {
                $scope.$broadcast('show-errors-check-validity');

                if (!$scope.clientForm.$valid) {
                    return;
                }

                $scope.client.errors = {};

                Client.create($scope.client).then(function (client) {
                    $scope.$apply(function () {
                        $scope.clients.push(client);
                        $scope.client = {};

                        AlertsManager.show($scope, 'Клиент добавлен', 'success');

                        $scope.$broadcast('show-errors-reset');
                    });
                }).catch(function (err) {
                    err.errors.forEach(function (error) {
                        $scope.client.errors[error.path] = true;
                    });
                });
            };

            $scope.update = function (client) {
                client.errors = {};

                client.save().then(function () {
                    $scope.$apply(function () {
                        AlertsManager.show($scope, 'Клиент сохранен', 'success');

                        client.editable = false;
                    });
                }).catch(function (err) {
                    err.errors.forEach(function (error) {
                        client.errors[error.path] = true;
                    });
                });
            };

            $scope.remove = function (client, index) {

                var modalInstance = $modal.open({
                    templateUrl: 'client/views/removeModal.html',
                    animation: false,
                    controller: function ($scope, $modalInstance) {
                        $scope.name = client.name;

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
                    client.destroy().then(function () {
                        $scope.$apply(
                            $scope.clients.splice(index, 1)
                        );
                    });
                }, function () {
                });
            };

            $scope.pressEnter = function(keyEvent, client) {
                if (keyEvent.which === 13) {
                    $scope.update(client);
                }
            };

            $scope.closeAlert = AlertsManager.getClose($scope);
        });
})(angular);