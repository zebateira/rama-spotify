describe('Views Module', function() {
  it('Views initial config: header path', function() {
    var headerPath = '../views/header.html';
    views.initConfig({
      header: {
        path: headerPath
      }
    });

    expect(views.header.path).toBe(headerPath);
  });
});