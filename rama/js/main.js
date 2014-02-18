require([
    '$api/models',
    ], function(models) {

    // When application has loaded, run tabs function
    models.application.load('arguments').done(tabs);

    // When arguments change, run tabs function
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


});
