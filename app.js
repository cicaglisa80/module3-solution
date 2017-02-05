(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItemsDirective)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com/");

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var list = this;
    list.found = [];

    list.searchItems = function () {

    list.found = MenuSearchService.getMatchedMenuItems(list.textToSearch);
      console.log('response.data ', list.found);
    };

     list.removeItem = function (itemIndex) {
       MenuSearchService.removeItem(itemIndex);
     };
  }

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        found: '<',
        onRemove: '&'
      }
    };

    return ddo;
  }

MenuSearchService.$inject = ['$http', 'ApiBasePath'];

function MenuSearchService($http, ApiBasePath) {
    var service = this;
    var foundItems = [];

    service.getMatchedMenuItems = function (searchTerm) {
       return $http({
         method: "GET",
         url: (ApiBasePath + "/menu_items.json"),
         params: {
           description: searchTerm
         }
       }).then(function (result) {

         console.log('result ', result);
         for (var i = 0; i < result.data.menu_items.length; i++) {
           if (~result.data.menu_items[i].description.indexOf(searchTerm))
           {
             foundItems.push(result.data.menu_items[i]);
           }
         }

         console.log('foundItems total: ', foundItems.length);
         return foundItems;
       });
    }

    service.removeItem = function (itemIndex) {
      foundItems.splice(itemIndex, 1);
    };
  }
})();
