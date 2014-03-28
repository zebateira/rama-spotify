describe('Views Module', function() {
  jasmine.getFixtures().fixturesPath = 'test/fixtures';

  afterEach(function() {
    Views.reset();
  });

  var controllers = {
    nowplaying: nowplaying,
    toplist: toplist,
    search: search
  };

  describe('Header View', function() {

    it('should throw an exception if no header is specified', function() {
      function noHeader() {
        Views.initConfig({});
      }

      expect(noHeader).toThrowError(HeaderMissingException);
    });
    it('should set header path to default value if no path file is specified',
      function() {

        Views.initConfig({
          header: {},
          tabs: []
        });

        expect(Header.path).toBe(Header.DEFAULT_PATH);
      }
    );
    it('should set the path property', function() {
      var headerPath = 'path/to/header/html/file';

      Views.initConfig({
        header: {
          path: headerPath
        },
        tabs: []
      });

      expect(Header.path).toBe(headerPath);
    });

    it('should load link if property is specified', function() {
      appendLoadFixtures('header.html');

      var linkAttr = 'link.to.site';

      Views.initConfig({
        header: {
          path: "path/to/file",
          link: linkAttr
        },
        tabs: []
      });

      Header.afterLoad();

      expect($('.header-link')).toBeVisible();
      expect($('.header-link > a')).toHaveAttr('href', linkAttr);
    });

    it('shouldn\'t load link if property is not specified', function() {
      appendLoadFixtures('header.html');

      Views.initConfig({
        header: {
          path: "path/to/file"
        },
        tabs: []
      });

      Header.afterLoad();

      expect($('.header-link')).toBeHidden();
    });
  });

  describe('Tabs View', function() {

    it('should launch exception on tabs config missing', function() {

      function noTabs() {
        Views.initConfig({
          header: true
        });
      }

      expect(noTabs).toThrowError(TabsMissingException);
    });

    it('should set viewId, name and path', function() {
      var tab = {
        viewId: 'index',
        name: 'Main',
        path: 'path/to/file/',
        controller: controllers.nowplaying
      };

      Views.initConfig({
        header: true,
        tabs: [tab]
      });

      expect(TabBar.tabs[0].viewId).toBe(tab.viewId);
      expect(TabBar.tabs[0].name).toBe(tab.name);
      expect(TabBar.tabs[0].path).toBe(tab.path);
    });
    it('should set default path if it\'s not specified', function() {

      var tab = {
        viewId: 'index',
        name: 'Main',
        controller: controllers.nowplaying
      };
      var defaultPath = Views.DEFAULT_PATH + tab.viewId + '.html';

      Views.initConfig({
        header: true,
        tabs: [tab]
      });

      expect(TabBar.tabs[0].path).toBe(defaultPath);
    });
    it('should throw exception if no viewId is specified', function() {
      expect(function() {
        Views.initConfig({
          header: true,
          tabs: [{
            name: 'asdf'
          }]
        });
      }).toThrowError();
    });
    it('should throw exception if no name is specified', function() {
      expect(function() {
        Views.initConfig({
          header: true,
          tabs: [{
            viewId: 'asdf'
          }]
        });
      }).toThrowError(TabInfoMissingException);
    });
    it('should throw exception if no name or viewId are specified', function() {
      expect(function() {
        Views.initConfig({
          header: true,
          tabs: [{}]
        });
      }).toThrowError(TabInfoMissingException);
    });

    it('should set controller', function() {
      Views.initConfig({
        header: true,
        tabs: [{
          viewId: 'id',
          name: 'Fancy tab name',
          controller: controllers.nowplaying
        }]
      });

      expect(TabBar.tabs[0].controller.name).toBe(controllers.nowplaying.name);
    });

    it('should throw exception if no controller was configured', function() {
      expect(function() {
        Views.initConfig({
          header: true,
          tabs: [{
            viewId: 'id',
            name: 'fancy name'
          }]
        });
      }).toThrowError(TabMissingControllerException);
    });
  });

});