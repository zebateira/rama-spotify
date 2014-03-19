describe('Artist Graph Module', function() {


  it('should set maximum child nodes per node', function() {
    var ag = new ArtistGraph({
        branching: 20
      },
      document.createElement('div'), {
        name: 'Anamanaguchi'
      }
    );

    expect(ag.branching).toBe(20);
  });

});