(function () {
    'use strict';

    angular
        .module('admin.user')
        .directive('compareWith', function () {
            return {
                restrict: 'A',
                scope: true,
                require: 'ngModel',
                link: function (scope, elem, attrs, ctrl) {
                    var checker = function () {
                        /* jshint eqeqeq: false */
                        var origin = scope.$eval(attrs.ngModel);
                        var compareWith = scope.$eval(attrs['compareWith']);
                        return origin == compareWith;
                    };
                    scope.$watch(checker, function (n) {
                        ctrl.$setValidity('match', n);
                    });
                }
            };
        });

})();