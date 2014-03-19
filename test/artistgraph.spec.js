describe('Artist Graph Module', function() {


  it('should set maximum child nodes per node', function() {
    var ag = new ArtistGraph({
        maxChildNodes: 20
      },
      document.createElement('div'), {
        name: 'Anamanaguchi'
      });
  });

});