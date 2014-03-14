describe('Views Module', function() {
  jasmine.getFixtures().fixturesPath = 'test/fixtures';


  describe('Header View', function() {

    it('should throw an exception if no header is specified', function() {
      function noHeader() {
        views.initConfig({});
      }

      expect(noHeader).toThrow(new HeaderMissingException().toString());
    });
    it('should set header path to default value if no path file is specified', function() {

      views.initConfig({
        header: {}
      });

      expect(views.header.path).toBe('../views/header.html');
    });
    it('should set the path property', function() {
      var headerPath = 'path/to/header/html/file';

      views.initConfig({
        header: {
          path: headerPath
        }
      });

      expect(views.header.path).toBe(headerPath);
    });

    it('should load link if property is specified', function() {
      appendLoadFixtures('header.html');

      views.initConfig({
        header: {
          path: "path/to/file",
          link: 'link.to.site'
        }
      });

      expect($('.header-link')).toExist();
    });

    it('shouldn\'t load link if property is not specified', function() {
      appendLoadFixtures('header.html');

      views.initConfig({
        header: {
          path: "path/to/file",
          link: 'link.to.site'
        }
      });

      expect($('.header-link')).not.toExist();
    });
  });

  it('should set ids and names', function() {
    var tab = {
      id: 'index',
      name: 'Main'
    };

    views.initConfig({
      header: {
        path: "path/to/file"
      },
      tabs: [tab]
    });

    expect(views.tabs[0].id).toBe(tab.id);
    expect(views.tabs[0].name).toBe(tab.name);
  });
});