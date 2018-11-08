
    var app = angular.module('myApp', []);
    app.controller('rightCtrl', function($scope) {
        $scope.input1 = "Hc";
        $scope.lastName = "Jry";
        $scope.output = function() {
            return $scope.input1 + " LIke " + $scope.lastName;
        }
    })
