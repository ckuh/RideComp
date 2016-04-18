angular.module('App')
  .controller('GraphController', function($scope, $state, compFactory, graphFactory) {
    var vm = this;
    vm.graphDataLoaded = false;
    vm.chartOptionsStorage = graphFactory.chartOptionsStorage;

    vm.setGraph = function() {
      vm.chartOptions = graphFactory.setChartOptions(vm.chartOptionsStorage);
      vm.chartOptionsStorage.all.series = vm.chartOptions.series;
      vm.lyftUberX();
      vm.graphDataLoaded = true;
      compFactory.loadSpinner.showSpinner = false;
    }


    vm.lyftUberX = function() {
      vm.chartOptions.xAxis.categories = vm.chartOptionsStorage.small.categories;
      vm.chartOptions.series = [vm.chartOptionsStorage.small.taxi.series, vm.chartOptionsStorage.small.lyft.series, vm.chartOptionsStorage.small.uber.series];
    }

    vm.allGraph = function() {
      vm.chartOptions.xAxis.categories = vm.chartOptionsStorage.all.rideType;
      vm.chartOptions.series = vm.chartOptionsStorage.all.series;
    }

    vm.setGraph();
  });
