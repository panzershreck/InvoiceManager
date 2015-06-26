(function (angular) {
    angular.module('app').directive('numberOnlyInput', function () {
        return {
            restrict: 'EA',
            template: '<input id="{{ inputId }}" class="form-control" max="{{ inputMax }}" min="{{ inputMin }}" type="number" name="{{ inputName }}" ng-model="inputValue" />',
            scope: {
                inputValue: '=',
                inputName: '=',
                inputId: '=',
                inputMax: '=',
                inputMin: '='
            },
            link: function (scope) {
                scope.$watch('inputValue', function (newValue, oldValue) {
                    if (isNaN(newValue)) {
                        scope.inputValue = oldValue;
                    }
                });
            }
        };
    });
})(angular);