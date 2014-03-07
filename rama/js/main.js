spotify.require([
  '$api/models',
  'js/now',
  'js/top',
  'js/search'
], function(models, now, top, search) {

  models.application.load('arguments').done(tabs);

  models.application.addEventListener('arguments', tabs);

  function tabs() {
    var args = models.application.arguments;
    var current = document.getElementById(args[0]);
    var sections = document.getElementsByClassName('section');
    for (var i = 0, l = sections.length; i < l; i++) {
      sections[i].style.display = 'none';
    }
    current.style.display = 'block';
  }


  new now.NowPlaying().load();
  new top.TopList().load();
  new search.Search().load();
});