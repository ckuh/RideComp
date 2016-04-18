angular.module('graphFactory', [])
  .factory('graphFactory', function($state, $localStorage, $http, $timeout) {
    var chartOptionsStorage = {};

    var service = {
      chartOptionsStorage: chartOptionsStorage,
      chartOptionsStorageInit: chartOptionsStorageInit,
      setChartOptions: setChartOptions
    }
    return service;

    function setChartOptions(storage) {
      return {
        options: {
          legend: {
            enabled: false
          },
          chart: {
            type: 'columnrange',
            inverted: true,
          },
          tooltip: {
            formatter: function() {
              return '<b>' + this.x + '</b> available for $<b>' + this.point.low + '</b>-<b>' + this.point.high + '</b>';
            }
          },
          plotOptions: {
            columnrange: {
              dataLabels: {
                enabled: true,
                formatter: function() {
                  return '$' + this.y;
                }
              }
            },
          }
        },
        xAxis: {
          categories: storage.all.rideType,
          tickColor: 'rgba(0,0,0,0)'
        },
        yAxis: {
          title: {
            text: 'Price ($)'
          },
          gridLineColor: 'rgba(0,0,0,0)',
          visible: false
        },
        credits: {
          enabled: true,
          text: 'uber.com/lyft.com/taxifarefinder.com'
        },
        series: [{
          name: 'taxi',
          data: storage.all.price.taxiPrice,
          color: '#F7B731'
        }, {
          name: 'lyft',
          data: storage.all.price.lyftLinePrice,
          color: 'rgba(0,0,0,0)'
        }, {
          name: 'lyft',
          data: storage.all.price.lyftPrice,
          color: '#FF00BF'
        }, {
          name: 'uber',
          data: storage.all.price.uberPrice,
          color: '#161629'
        }],
        title: {
          text: 'Ride Price Estimates'
        },
        func: function(chart) {
          $timeout(function() {
            chart.reflow();
          }, 0);
        }
      };
    }

    function chartOptionsStorageInit() {
      chartOptionsStorage.all = {
        rideType: ['Taxi'],
        price: {
          taxiPrice: [],
          uberPrice: [],
          lyftPrice: [
            [null, null]
          ],
          lyftLinePrice: [
            [null, null]
          ]
        },
        series: []
      }
      chartOptionsStorage.small = {
        categories: ['Taxi'],
        taxi: {
          series: {
            data: [],
            name: 'taxi',
            color: '#F7B731'
          }
        },
        lyft: {
          series: {
            data: [
              [null, null]
            ],
            name: 'lyft',
            color: '#FF00BF'
          }
        },
        uber: {
          series: {
            data: [
              [null, null],
              [null, null]
            ],
            name: 'uber',
            color: '#161629'
          }
        }
      }
    }
  })
