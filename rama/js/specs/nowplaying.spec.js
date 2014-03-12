describe('Now Playing', function() {
  it('Element is a graph', function() {
    NowPlaying.init({
      element: {
        className: 'graph'
      }
    });

    expect(NowPlaying.element.className).toBe('graph');
  });
});