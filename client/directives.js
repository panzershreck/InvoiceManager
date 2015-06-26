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
                    //var arr = String(newValue).split('');
                    //
                    //if (arr.length === 0) {
                    //    return
                    //}

                    //if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.' )) {
                    //    return
                    //}
                    //if (arr.length === 2 && newValue === '-.') {
                    //    return
                    //}

                    if (isNaN(newValue)) {
                        scope.inputValue = oldValue;
                    }
                });
            }
        };
    });
})(angular);