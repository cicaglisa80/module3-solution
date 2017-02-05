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

      var promise = MenuSearchService.getMatchedMenuItems(list.textToSearch);

      promise.then(function (response) {
          list.found = response;
          console.log('response.data ', list.found);
        })
        .catch(function (error) {
          console.log("Something went terribly wrong.");
        });
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
      },
      controller: FoundItemsDirectiveController,
      controllerAs: 'list',
      bindToController: true
    };

    return ddo;
  }

  function FoundItemsDirectiveController() {
    var list = this;

    list.cookiesInList = function () {
      for (var i = 0; i < list.items.length; i++) {
        var name = list.items[i].name;
        if (name.toLowerCase().indexOf("cookie") !== -1) {
          return true;
        }
      }

      return false;
    };
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
