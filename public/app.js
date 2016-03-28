angular.module('App', [
    'ui.router',
    'ui.bootstrap',
    'ngStorage',
    'angularSpinner',
    'ngAnimate',
    'ngAria',
    'ngMaterial',
    'ngMessages',
    'homeFactory'
  ])
  .config(function($stateProvider, $urlRouterProvider, $mdThemingProvider, usSpinnerConfigProvider) {
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

    $urlRouterProvider
      .otherwise('/');

    usSpinnerConfigProvider.setTheme('bigBlue', {
      color: '#229ee4',
      lines: 17,
      length: 0,
      width: 15,
      radius: 40,
      scale: 0.50,
      corners: 1.0,
      opacity: 0.10,
      direction: 1,
      speed: 0.7,
      trail: 100
    });
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
