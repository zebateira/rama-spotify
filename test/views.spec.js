describe('Views Module', function() {
  jasmine.getFixtures().fixturesPath = 'test/fixtures';

  afterEach(function() {
    views.reset();
  });

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

  describe('Tabs bar view', function() {

    it('should launch exception on tabs config missing', function() {

      function noTabs() {
        views.initConfig({
          header: true
        });
      }

      expect(noTabs).toThrowError(TabsMissingException);
    });

    it('should set id, name and path', function() {
      var tab = {
        id: 'index',
        name: 'Main',
        path: 'path/to/file/'
      };

      views.initConfig({
        header: true,
        tabs: [tab]
      });

      expect(views.tabs[0].id).toBe(tab.id);
      expect(views.tabs[0].name).toBe(tab.name);
      expect(views.tabs[0].path).toBe(tab.path);
    });
    it('should set default path if it\'s not specified', function() {

      var tab = {
        id: 'index',
        name: 'Main'
      };
      var defaultPath = views.DEFAULT_PATH + tab.id + '.html';

      views.initConfig({
        header: true,
        tabs: [tab]
      });

      expect(views.tabs[0].path).toBe(defaultPath);
    });
    it('should throw exception if no id is specified', function() {
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
            id: 'asdf'
          }]
        });
      }).toThrowError();
    });
    it('should throw exception if no name or id are specified', function() {
      expect(function() {
        views.initConfig({
          header: true,
          tabs: [{}]
        });
      }).toThrowError();
    });
  });

  // describe('Tabs view', function() {

  // });
});