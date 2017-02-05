(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItemsDirective)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com/");

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        items: '<',
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

    list.itemsInList = function () {
      if (list.items.length > 0) {
        return true;
      }

      return false;
    };
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var list = this;
    list.found = [];
    list.isListEmpty = false;

    list.searchItems = function () {

      if (!list.textToSearch) {
        list.found = [];
        list.isListEmpty = true;
        return;
      }

      var promise = MenuSearchService.getMatchedMenuItems(list.textToSearch);

      promise.then(function (response) {
          list.found = response.data.menu_items;
          if (list.found > 0) {
            list.isListEmpty = false;
          } else {
            list.isListEmpty = true;
          }
        })
        .catch(function (error) {
          console.log(error);
        })
      };

     list.removeItem = function (itemIndex) {
       list.found.splice(itemIndex, 1);
     };
  }

MenuSearchService.$inject = ['$http', 'ApiBasePath'];

function MenuSearchService($http, ApiBasePath) {
    var service = this;
    var foundItems = [];

    service.getMatchedMenuItems = function (searchTerm) {
       var response = $http({
         method: "GET",
         url: (ApiBasePath + "/menu_items.json"),
         params: {
           description: searchTerm
         }
       })
       .then(function (result) {
         foundItems = [];
         for (var i = 0; i < result.data.menu_items.length; i++) {
           if (~result.data.menu_items[i].description.indexOf(searchTerm))
           {
             foundItems.push(result.data.menu_items[i]);
           }
         }

         result.data.menu_items = foundItems;
         return result;
       });

       return response;
    }
  }
})();
