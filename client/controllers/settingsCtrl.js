(function (angular, dbFile) {
    angular.module('app').controller('SettingsController', function ($scope, $rootScope, AlertsManager, Settings) {
        $scope.alerts = [];

        $scope.saveSettings = function () {
            $scope.$broadcast('show-errors-check-validity');

            if ($scope.settingsForm.$valid) {
                $rootScope.settings.save().then(function () {
                    $scope.$apply(function () {
                        AlertsManager.show($scope, 'Настройки сохранены', 'success');

                        $scope.$broadcast('show-errors-reset');
                    });
                });
            }
        };

        var fs = require('fs');

        $scope.exportDb = function () {
            exportFile('#export-db-file', dbFile)
        };

        $scope.importDb = function () {
            importFile('#import-db-file');
        };

        function exportFile(name, source) {
            var chooser = document.querySelector(name);
            chooser.addEventListener('change', function (e) {
                fs.createReadStream(source).pipe(fs.createWriteStream(this.value));
            }, false);

            chooser.click();
        }

        function importFile(name) {
            var chooser = document.querySelector(name);
            chooser.addEventListener('change', function(e) {
                var that = this;

                fs.readFile(dbFile, function (err, data) {
                    if (!err) {
                        fs.writeFile(dbFile + '_' + new Date().getTime(), data, function (err) {
                            if (!err) {
                                fs.readFile(that.value, function (err, data) {
                                    fs.writeFile(dbFile, data, function (err) {
                                        if (!err) {
                                            $scope.$apply(function () {
                                                AlertsManager.show($scope, 'База данных импортирована', 'success');

                                                Settings.findOrCreate({ where: 1 }).then(function (result) {
                                                    $rootScope.settings = result[0];
                                                });
                                            });
                                        }
                                    })
                                });
                            }
                        });
                    }
                });
            }, false);

            chooser.click();
        }

        $scope.addAlert = function (message, type) {
            return $scope.alerts.push({ msg: message, type: type }) - 1;
        };

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };
    });
})(angular, dbFile);