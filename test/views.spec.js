describe('Views Module', function() {
  jasmine.getFixtures().fixturesPath = 'test/fixtures';


  describe('Header View', function() {
    it('should set the path property', function() {
      var headerPath = 'path/to/header/html/file';

      views.initConfig({
        header: {
          path: headerPath
        }
      });

      expect(views.header.path).toBe(headerPath);
    });

    it('should throw and expection if no header or path are specified', function() {
      function noHeader() {
        views.initConfig({});
      }

      function noHeader2() {
        views.initConfig({
          header: {}
        });
      }
      expect(noHeader).toThrow();
      expect(noHeader2).toThrow();
    });

    it('should loaded link', function() {
      appendLoadFixtures('header.html');

      views.initConfig({
        header: {
          path: "path/to/file",
          link: 'link.to.site'
        }
      });

      expect($('.header-link')).toExist();
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