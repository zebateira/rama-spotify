describe('Views Module', function() {
  jasmine.getFixtures().fixturesPath = 'test/fixtures';

  beforeEach(function() {
    loadFixtures('header.html');
  });

  it('header: path should be set', function() {
    var headerPath = '../../views/header.html';

    views.initConfig({
      header: {
        path: headerPath
      }
    });

    expect(views.header.path).toBe(headerPath);
  });

  it('header: link loaded', function() {

    expect($('.header > a')).toContainText('RAMA');
  });

  it('tabs bar: ids and names should be set', function() {
    var tab = {
      id: 'index',
      name: 'Main'
    };

    views.initConfig({
      header: {},
      tabs: [tab]
    });

    expect(views.tabs[0].id).toBe(tab.id);
    expect(views.tabs[0].name).toBe(tab.name);
  });
});