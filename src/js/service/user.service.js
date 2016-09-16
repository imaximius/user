(function () {
    'use strict';

    angular
        .module('admin.user')
        .factory('User', User);

    User.$inject = ['$http'];

    /**
     * User Service
     *
     * @param $http
     * @returns {{
     *  name: string,
     *  email: string,
     *  picture: string,
     *  settings: {},
     *  authorized: boolean,
     *  setSettings: setSettings,
     *  getSettings: getSettings,
     *  setAsNotAuthorized: setAsNotAuthorized,
     *  isAuthorized: isAuthorized,
     *  setData: setData
     * }}
     * @constructor
     */
    function User($http) {
        /* jshint eqeqeq: false */

        var dataSource = {
            resource: {
                method: 'GET',
                url: '/master/user/data'
            },
            pending: false
        };
        var service = {
            name: '',
            email: '',
            picture: '/public/admin/build/img/user/no-image.jpg',
            settings: {},
            authorized: false,
            init: init,
            setSettings: setSettings,
            getSettings: getSettings,
            setAsNotAuthorized: setAsNotAuthorized,
            isAuthorized: isAuthorized,
            setData: setData
        };

        return service;

        function init(callback) {
            if (dataSource.pending) {
                return;
            }
            dataSource.pending = true;
            $http(dataSource.resource)
                .then(function (response) {
                    dataSource.pending = false;
                    setData(response.data);
                    if (typeof callback == 'function') {
                        callback(service);
                    }
                }, function () {
                    dataSource.pending = false;
                });
        }

        function getSettings() {
            return service.settings;
        }

        function setSettings(settings, onSuccess, onError) {
            $http({
                    url: '/master/profile/settings',
                    method: "POST",
                    data: JSON.stringify(settings),
                    headers: {'Content-Type': 'application/json'}
                })
                .success(function (response) {
                    service.settings = settings;
                    if (typeof onSuccess == 'function') {
                        onSuccess(response);
                    }
                })
                .error(function (response) {
                    if (typeof onError == 'function') {
                        onError(response);
                    }
                });
        }

        function setAsNotAuthorized() {
            service.authorized = false;
        }

        function isAuthorized() {
            return service.authorized;
        }

        function setData(data) {
            (['name', 'email', 'settings', 'authorized', 'picture']).forEach(function (field) {
                if (typeof data[field] == 'undefined') {
                    return;
                }
                service[field] = data[field];
            });
        }

    }

})();