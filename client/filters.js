(function (angular) {
    angular.module('app').filter('getById', function () {
        return function (input, id, prop) {
            var result;

            angular.forEach(input, function (el) {
                if (el.id === id) {
                    result = el;
                }
            });

            if (result) {
                return prop ? result[prop] : result;
            }
        }
    });
})(angular);