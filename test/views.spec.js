describe('Views Module', function() {
  jasmine.getFixtures().fixturesPath = 'test/fixtures';

  afterEach(function() {
    views.reset();
  });

  var controllers = {
    nowplaying: nowplaying,
    toplist: toplist,
    search: search
  };

  describe('Header View', function() {

    it('should throw an exception if no header is specified', function() {
      function noHeader() {
        views.initConfig({});
      }

      expect(noHeader).toThrowError(HeaderMissingException);
    });
    it('should set header path to default value if no path file is specified',
      function() {

        views.initConfig({
          header: {},
          tabs: []
        });

        expect(views.header.path).toBe(views.header.DEFAULT_PATH);
      }
    );
    it('should set the path property', function() {
      var headerPath = 'path/to/header/html/file';

      views.initConfig({
        header: {
          path: headerPath
        },
        tabs: []
      });

      expect(views.header.path).toBe(headerPath);
    });

    it('should load link if property is specified', function() {
      appendLoadFixtures('header.html');

      var linkAttr = 'link.to.site';

      views.initConfig({
        header: {
          path: "path/to/file",
          link: linkAttr
        },
        tabs: []
      });

      views.header.afterLoad();

      expect($('.header-link')).toBeVisible();
      expect($('.header-link > a')).toHaveAttr('href', linkAttr);
    });

    it('shouldn\'t load link if property is not specified', function() {
      appendLoadFixtures('header.html');

      views.initConfig({
        header: {
          path: "path/to/file"
        },
        tabs: []
      });

      views.header.afterLoad();

      expect($('.header-link')).toBeHidden();
    });
  });

  describe('Tabs View', function() {

    it('should launch exception on tabs config missing', function() {

      function noTabs() {
        views.initConfig({
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

      views.initConfig({
        header: true,
        tabs: [tab]
      });

      expect(views.tabs[0].viewId).toBe(tab.viewId);
      expect(views.tabs[0].name).toBe(tab.name);
      expect(views.tabs[0].path).toBe(tab.path);
    });
    it('should set default path if it\'s not specified', function() {

      var tab = {
        viewId: 'index',
        name: 'Main',
        controller: controllers.nowplaying
      };
      var defaultPath = views.DEFAULT_PATH + tab.viewId + '.html';

      views.initConfig({
        header: true,
        tabs: [tab]
      });

      expect(views.tabs[0].path).toBe(defaultPath);
    });
    it('should throw exception if no viewId is specified', function() {
      expect(function() {
        views.initConfig({
          header: true,
          tabs: [{
            name: 'asdf'
          }]
        });
      }).toThrowError();
    });
    it('should throw exception if no name is specified', function() {
      expect(function() {
        views.initConfig({
          header: true,
          tabs: [{
            viewId: 'asdf'
          }]
        });
      }).toThrowError(TabInfoMissingException);
    });
    it('should throw exception if no name or viewId are specified', function() {
      expect(function() {
        views.initConfig({
          header: true,
          tabs: [{}]
        });
      }).toThrowError(TabInfoMissingException);
    });

    it('should set controller', function() {
      views.initConfig({
        header: true,
        tabs: [{
          viewId: 'id',
          name: 'Fancy tab name',
          controller: controllers.nowplaying
        }]
      });

      expect(views.tabs[0].controller.name).toBe(controllers.nowplaying.name);
    });

    it('should throw exception if no controller was configured', function() {
      expect(function() {
        views.initConfig({
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