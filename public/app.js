angular.module('App', [
    'ui.router',
    'ui.bootstrap',
    'ngStorage',
    'angularSpinner',
    'ngAnimate',
    'ngAria',
    'ngMaterial',
    'ngMessages',
    'google.places',
    'geolocation',
    'uiGmapgoogle-maps',
    'homeFactory',
    'compFactory'
  ])
  .config(function($stateProvider, $urlRouterProvider, $mdThemingProvider, usSpinnerConfigProvider, uiGmapGoogleMapApiProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        authenticate: false,
        views: {
          '': {
            templateUrl: 'pages/home/home.html'
          }
        }
      })
      .state('comp', {
        url: '/comp',
        authenticate: false,
        views: {
          '': {
            templateUrl: 'pages/comp/comp.html'
          }
        }
      })

    $urlRouterProvider
      .otherwise('/');

    usSpinnerConfigProvider.setTheme('bigBlue', {
      color: '#229ee4',
      lines: 17,
      length: 0,
      width: 5,
      radius: 10,
      scale: 0.50,
      corners: 1.0,
      opacity: 0.10,
      direction: 1,
      speed: 0.7,
      trail: 100
    });

    // uiGmapGoogleMapApiProvider.configure({
    //     key: 'AIzaSyCCbjiBoKsG7rC0VPJ5cR0rkjJNrx1wtpA',
    //     libraries: 'weather,geometry,visualization'
    // });
  })
  .run(function($rootScope, $state, $localStorage) {
    $rootScope.$on('$stateChangeStart', function(e, to) {
      if (!to.authenticate) {
        return;
      };
      e.preventDefault();

      if ($localStorage) {
        to.authenticate = false;
        $state.go(to.name);
      } else {
        $state.go('home');
      }
    });
  })
