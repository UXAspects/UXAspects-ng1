describe('Search Builder directive', function() {

    var $compile, $rootScope, $timeout, $templateCache, $q, element;

    beforeEach(module("ux-aspects.searchBuilder"));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _$templateCache_, _$q_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        $templateCache = _$templateCache_;
        $q = _$q_;
    }));

    beforeEach(function() {
        //create any templates
        var textComponent = '<search-component><label class="form-label">Text</label><input placeholder="Enter Text" class="form-control" ng-model="model" /></search-component>';
        $templateCache.put('textComponent.html', textComponent);

        var hasAttachmentComponent = '<search-component><label class="form-label">Has Attachments?</label><input placeholder="Enter Text" class="form-control" ng-model="model" /></search-component>';
        $templateCache.put('hasAttachmentsComponent.html', hasAttachmentComponent);

        var searchGroup = "<div class=\"search-group\" ng-class=\"{'read-only': sg.readOnly}\">";
        searchGroup += "";
        searchGroup += "  <p class=\"search-group-title\" ng-bind=\"groupTitle\"><\/p>";
        searchGroup += "";
        searchGroup += "  <div class=\"search-group-content\">";
        searchGroup += "    <div class=\"operator-label {{ operator }}\" ng-class=\"{ 'search-builder-show': sg.components.length > 1 }\">";
        searchGroup += "      {{ operator }}";
        searchGroup += "    <\/div>";
        searchGroup += "    <div class=\"field-list\">";
        searchGroup += "      <ul class=\"field-collection\" ng-class=\"{ 'search-builder-show': sg.components.length > 0 }\">";
        searchGroup += "        <li class=\"field\" ng-repeat=\"component in sg.components\" component-id=\"{{ component.componentId }}\">";
        searchGroup += "          <ng-include src=\"component.templateUrl\"><\/ng-include>";
        searchGroup += "        <\/li>";
        searchGroup += "      <\/ul>";
        searchGroup += "      <div class=\"placeholder-field\" ng-show=\"sg.showPlaceholder\">";
        searchGroup += "        <label class=\"form-label\">New field<\/label>";
        searchGroup += "        <div class=\"form-control\"><\/div>";
        searchGroup += "      <\/div>";
        searchGroup += "    <\/div>";
        searchGroup += "    <div class=\"add-field-list\">";
        searchGroup += "      <div class=\"add-field\" ng-repeat=\"button in sg.getAddFields()\" ng-class=\"{ 'limit-reached' : sg.maxFields && (sg.components.length >= maxFields) }\">";
        searchGroup += "        <div class=\"button-container\" ng-click=\"sg.addNewField($index)\">";
        searchGroup += "          <div class=\"add-button\"><span class=\"hpe-icon hpe-add\"><\/span><\/div>";
        searchGroup += "          <span class=\"add-text\" single-line-overflow-tooltip ng-bind=\"sg.getButtonText($index)\"><\/span>";
        searchGroup += "        <\/div>";
        searchGroup += "      <\/div>";
        searchGroup += "    <\/div>";
        searchGroup += "  <\/div>";
        searchGroup += "  <hr class=\"group-divider\" \/>";
        searchGroup += "<\/div>";

        $templateCache.put('searchBuilder/templates/searchGroup.html', searchGroup);

        var searchComponent = "<div class=\"search-component\">";
        searchComponent += "  <div class=\"component-container\">";
        searchComponent += "  <\/div>";
        searchComponent += "  <div class=\"component-remove\">";
        searchComponent += "      <span class=\"hpe-icon hpe-close\" ng-click=\"sc.removeComponent()\"><\/span>";
        searchComponent += "  <\/div>";
        searchComponent += "<\/div>";

        $templateCache.put('searchBuilder/templates/searchComponent.html', searchComponent);

        this.scope = createElement({});
    });

    it("should have the correct search groups", function() {
        var searchGroups = element.find('.search-group');

        expect(searchGroups.length).toBe(3);
    });

    it("should have search groups with the correct titles", function() {
        var titles = element.find('.search-group-title');

        expect(titles.length).toBe(3);
        expect(titles.get(0).innerHTML).toBe('Text Keywords');
        expect(titles.get(1).innerHTML).toBe('ANY of the following');
        expect(titles.get(2).innerHTML).toBe('ALL of the following');
    });

    it("should have search groups with the correct button text", function() {
        var buttonText = element.find('.add-text');

        expect(buttonText.length).toBe(3);
        expect(buttonText.get(0).innerHTML).toBe('Add text keywords');
        expect(buttonText.get(1).innerHTML).toBe('Add a field');
        expect(buttonText.get(2).innerHTML).toBe('Add a field');
    });

    it("should have search groups with the correct operator", function() {
        var operators = element.find('.operator-label');

        expect(operators.length).toBe(3);
        expect(operators.get(0).innerHTML.trim()).toBe('or');
        expect(operators.get(1).innerHTML.trim()).toBe('or');
        expect(operators.get(2).innerHTML.trim()).toBe('and');
    });

    it("should have search groups with no components", function() {
        var componentLists = element.find('.field-collection');

        expect(componentLists.length).toBe(3);
        expect(componentLists.get(0).children.length).toBe(0);
        expect(componentLists.get(1).children.length).toBe(0);
        expect(componentLists.get(2).children.length).toBe(0);
    });

    it("should have the ability to add a simple component", function() {
        var button = element.find('.button-container');

        expect(button.length).toBe(3);

        angular.element(button.get(0)).click();

        this.scope.$digest();

        var componentLists = element.find('.field-collection');

        expect(componentLists.length).toBe(3);
        expect(componentLists.get(0).children.length).toBe(1);
        expect(componentLists.get(1).children.length).toBe(0);
        expect(componentLists.get(2).children.length).toBe(0);
    });

    it("should show placeholder when waiting on resolution", function() {
        var button = element.find('.button-container');

        expect(button.length).toBe(3);

        angular.element(button.get(1)).click();

        this.scope.$digest();

        var placeholders = element.find('.placeholder-field');
        expect(placeholders.length).toBe(3);

        expect(angular.element(placeholders.get(0)).hasClass('ng-hide')).toBe(true);
        expect(angular.element(placeholders.get(1)).hasClass('ng-hide')).toBe(false);
        expect(angular.element(placeholders.get(2)).hasClass('ng-hide')).toBe(true);
    });

    it("should hide placeholder after promise resolved", function(done) {
      var button = element.find('.button-container');

      expect(button.length).toBe(3);

      angular.element(button.get(1)).click();

      this.scope.$digest();

      var placeholders = element.find('.placeholder-field');
      expect(placeholders.length).toBe(3);

      expect(angular.element(placeholders.get(0)).hasClass('ng-hide')).toBe(true);
      expect(angular.element(placeholders.get(1)).hasClass('ng-hide')).toBe(false);
      expect(angular.element(placeholders.get(2)).hasClass('ng-hide')).toBe(true);

      const that = this;
      setTimeout(function() {
        that.scope.$digest();
        expect(angular.element(placeholders.get(0)).hasClass('ng-hide')).toBe(true);
        expect(angular.element(placeholders.get(1)).hasClass('ng-hide')).toBe(true);
        expect(angular.element(placeholders.get(2)).hasClass('ng-hide')).toBe(true);
        done();
      }, 1100);
    });

    it("should generate search query when adding a field without a default value", function(done) {
      var button = element.find('.button-container');

      expect(button.length).toBe(3);

      angular.element(button.get(1)).click();

      this.scope.$digest();

      const that = this;
      setTimeout(function() {
        that.scope.$digest();

        expect(JSON.stringify(that.scope.searchQuery)).toBe('{"anyFields":{"text-promise":{"component":"text","value":null}}}');

        done();
      }, 1100);
    });

    it("should generate search query when adding a field with a default value", function(done) {
      var button = element.find('.button-container');

      expect(button.length).toBe(3);

      angular.element(button.get(2)).click();

      this.scope.$digest();

      const that = this;
      setTimeout(function() {
        that.scope.$digest();

        expect(JSON.stringify(that.scope.searchQuery)).toBe('{"allFields":{"has_attachments-0":{"component":"has_attachments","value":true}}}');

        done();
      }, 1100);
    });



    function createElement(searchQuery) {
        var html = '<search-builder search-query="searchQuery" components="components">';
        html += ' <search-group group-id="\'keywords\'" group-title="\'Text Keywords\'" operator="\'or\'" button-text="\'Add text keywords\'" add-field="addKeywordField"></search-group>';
        html += ' <search-group group-id="\'anyFields\'" group-title="\'ANY of the following\'" operator="\'or\'" button-text="\'Add a field\'" add-field="addCustomField"></search-group>';
        html += ' <search-group group-id="\'allFields\'" group-title="\'ALL of the following\'" operator="\'and\'" button-text="\'Add a field\'" add-field="addEnumerationField"></search-group>';
        html += '</search-builder>';

        var $scope = $rootScope.$new();

        $scope.searchQuery = searchQuery;
        $scope.components = [{
            name: 'text',
            templateUrl: 'textComponent.html'
        },
        {
            name: 'has_attachments',
            templateUrl: 'hasAttachmentsComponent.html'
        }];

        $scope.addKeywordField = function() {
            return {
                id: 'textComponent1',
                component: 'text'
            };
        };

        $scope.addCustomField = function() {
            var defer = $q.defer();

            setTimeout(function() {
                defer.resolve({
                    id: 'text-promise',
                    component: 'text'
                });
            }, 1000);

            return defer.promise;
        };

        $scope.addEnumerationField = function () {
            return {
                id: 'has_attachments-0',
                component: 'has_attachments',
                value: true
            };
        }

        element = $compile(html)($scope);

        //ensure everything is ready
        $scope.$digest();

        return $scope;
    }

});
