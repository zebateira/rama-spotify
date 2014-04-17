describe('Components Module', function() {
  jasmine.getFixtures().fixturesPath = 'test/fixtures';

  afterEach(function() {
    Components.reset();
  });

  var controllers = {
    NowPlaying: NowPlaying,
    TopList: TopList
  };

  describe('Header View', function() {

    it('should throw an exception if no header is specified', function() {
      function noHeader() {
        Components.initConfig({});
      }

      expect(noHeader).toThrowError(HeaderMissingException);
    });
    it('should set header path to default value if no path file is specified',
      function() {

        Components.initConfig({
          header: {},
          tabs: [],
          artistmenu: {
            selector: '.artistmenu',
            path: '../views/artistmenu.html'
          }
        });

        expect(Header.path).toBe(Header.DEFAULT_PATH);
      }
    );
    it('should set the path property', function() {
      var headerPath = 'path/to/header/html/file';

      Components.initConfig({
        header: {
          path: headerPath
        },
        tabs: [],
        artistmenu: {
          selector: '.artistmenu',
          path: '../views/artistmenu.html'
        }
      });

      expect(Header.path).toBe(headerPath);
    });

    it('should load link if property is specified', function() {
      appendLoadFixtures('header.html');

      var linkAttr = 'link.to.site';

      Components.initConfig({
        header: {
          path: "path/to/file",
          link: linkAttr
        },
        tabs: [],
        artistmenu: {
          selector: '.artistmenu',
          path: '../views/artistmenu.html'
        }
      });

      Header.afterLoad();

      expect($('.header-link')).toBeVisible();
      expect($('.header-link > a')).toHaveAttr('href', linkAttr);
    });

    it('shouldn\'t load link if property is not specified', function() {
      appendLoadFixtures('header.html');

      Components.initConfig({
        header: {
          path: "path/to/file"
        },
        tabs: [],
        artistmenu: {
          selector: '.artistmenu',
          path: '../views/artistmenu.html'
        }
      });

      Header.afterLoad();

      expect($('.header-link')).toBeHidden();
    });
  });

  describe('Tabs View', function() {

    it('should launch exception on tabs config missing', function() {

      function noTabs() {
        Components.initConfig({
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
        controller: controllers.NowPlaying
      };

      Components.initConfig({
        header: true,
        tabs: [tab],
        artistmenu: {
          selector: '.artistmenu',
          path: '../views/artistmenu.html'
        }
      });

      expect(TabBar.tabs[0].viewId).toBe(tab.viewId);
      expect(TabBar.tabs[0].name).toBe(tab.name);
      expect(TabBar.tabs[0].path).toBe(tab.path);
    });
    it('should set default path if it\'s not specified', function() {

      var tab = {
        viewId: 'index',
        name: 'Main',
        controller: controllers.NowPlaying
      };
      var defaultPath = Components.DEFAULT_PATH + tab.viewId + '.html';

      Components.initConfig({
        header: true,
        tabs: [tab],
        artistmenu: {
          selector: '.artistmenu',
          path: '../views/artistmenu.html'
        }
      });

      expect(TabBar.tabs[0].path).toBe(defaultPath);
    });
    it('should throw exception if no viewId is specified', function() {
      expect(function() {
        Components.initConfig({
          header: true,
          tabs: [{
            name: 'asdf'
          }],
          artistmenu: {
            selector: '.artistmenu',
            path: '../views/artistmenu.html'
          }
        });
      }).toThrowError();
    });
    it('should throw exception if no name is specified', function() {
      expect(function() {
        Components.initConfig({
          header: true,
          tabs: [{
            viewId: 'asdf'
          }],
          artistmenu: {
            selector: '.artistmenu',
            path: '../views/artistmenu.html'
          }
        });
      }).toThrowError(TabInfoMissingException);
    });
    it('should throw exception if no name or viewId are specified', function() {
      expect(function() {
        Components.initConfig({
          header: true,
          tabs: [{}],
          artistmenu: {
            selector: '.artistmenu',
            path: '../views/artistmenu.html'
          }
        });
      }).toThrowError(TabInfoMissingException);
    });

    it('should set controller', function() {
      Components.initConfig({
        header: true,
        tabs: [{
          viewId: 'id',
          name: 'Fancy tab name',
          controller: controllers.NowPlaying
        }],
        artistmenu: {
          selector: '.artistmenu',
          path: '../views/artistmenu.html'
        }
      });

      expect(TabBar.tabs[0].controller.viewId).toBe(new controllers.NowPlaying('id', 'path').viewId);
    });

    it('should throw exception if no controller was configured', function() {
      expect(function() {
        Components.initConfig({
          header: true,
          tabs: [{
            viewId: 'id',
            name: 'fancy name'
          }],
          artistmenu: {
            selector: '.artistmenu',
            path: '../views/artistmenu.html'
          }
        });
      }).toThrowError(TabMissingControllerException);
    });
  });

});