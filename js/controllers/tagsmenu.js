require([
  '$api/models',
  'js/controllers/controller#controller'
], function(models, Controller) {
  var TagsMenu = new Class({
    Extends: Controller,

    initialize: function(name, config) {
      this.parent(name, config);

      this.commonTags = [];
    }
  });

  TagsMenu.implement({
    afterLoad: function(graphcontroller) {
      this.graphcontroller = graphcontroller;

      this.bindEvents();
    },
    updateTags: function() {
      var nodes = this.graphcontroller.artistGraph.data.nodes;

      this.commonTags = [];

      function getTagsFromArtist(index) {
        if (index === nodes.length) {

          this.commonTags = _.sortBy(_.map(_.countBy(this.commonTags, function(tag) {
            return tag.name;
          }), function(num, key) {
            return {
              name: key,
              count: num
            };
          }), 'count').reverse();

          var tagsContainer = this.jelement.html('');

          _.each(this.commonTags.slice(0, 5), function(tag) {
            var tagElement = document.createElement('span');

            tagElement.className = 'common-tag';
            tagElement.innerHTML = tag.name;

            tagsContainer.append(tagElement);
          });
        } else {
          var node = nodes[index];

          if (!node.tags) {
            $.ajax({
              url: "http://developer.echonest.com/api/v4/artist/" +
                "terms?api_key=29N71ZBQUW4XN0QXF&format=json&sort=weight&name=" +
                encodeURIComponent(node.label),
              context: this
            }).done(
              function(data) {
                node.tags = data.response.terms;
                this.commonTags = _.union(this.commonTags, node.tags);
                getTagsFromArtist.bind(this)(index + 1);
              }
            );
          } else {
            this.commonTags = _.union(this.commonTags, node.tags);
            getTagsFromArtist.bind(this)(index + 1);
          }
        }
      }

      getTagsFromArtist.bind(this)(0);

    },
    updateView: function() {
      this.updateTags();

    },
    bindEvents: function() {
      this.graphcontroller
        .addCustomGraphEvent('update', this.updateView.bind(this));
    }
  });

  exports.tagsmenu = TagsMenu;
});