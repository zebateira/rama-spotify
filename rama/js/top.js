require(['$api/toplists', '$views/list'], function(toplists, vlist) {
  exports.TopList = function() {

    this.load = function() {
      var list = toplists.Toplist.forCurrentUser();
      list.tracks.snapshot().done(function(tracks) {
        console.log(tracks);
        var list = vlist.List.forCollection(tracks);
        document.body.appendChild(list.node);

        // Call the init method after it has been added to the DOM
        list.init();
      });
    };
  };
});