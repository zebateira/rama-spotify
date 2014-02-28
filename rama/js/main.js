spotify.require([
    '$api/models',
    'js/now#NowPlaying',
    'js/top#TopList',
    'js/search#Search'
    ], function(models, Now, TopList) {

    models.application.load('arguments').done(tabs);

    models.application.addEventListener('arguments', tabs);

    function tabs() {
        var args = models.application.arguments;
        var current = document.getElementById(args[0]);
        var sections = document.getElementsByClassName('section');
        for (var i = 0, l = sections.length; i < l; i++){
            sections[i].style.display = 'none';
        }
        current.style.display = 'block';
    }

    // console.log(new models.Playlist());
    // new Now().load();
    new TopList().load();
});
