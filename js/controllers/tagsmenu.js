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
    updateView: function() {
      var nodes = this.graphcontroller.artistGraph.data.nodes;

      function ajaxDone(index, data) {
        node.tags = data.response.terms;

        this.commonTags = _.union(this.commonTags, node.tags);
      }

      for (var i = 0; i < nodes.length; ++i) {
        var node = nodes[i];
        var url =
          "http://developer.echonest.com/api/v4/artist/" +
          "terms?api_key=29N71ZBQUW4XN0QXF&format=json&sort=weight&name=" +
          encodeURIComponent(node.label);

        $.ajax({
          url: url,
          context: this,
          async: false
        }).done(ajaxDone.bind(this, i));
      }

      // TODO parse commonTags

      this.commonTags = _.sortBy(_.map(_.countBy(this.commonTags, function(tag) {
        return tag.name;
      }), function(num, key) {
        var value = {
          name: key,
          count: num
        };
        return value;
      }), 'count').reverse();

      console.log(this.commonTags);
    },
    bindEvents: function() {
      this.graphcontroller
        .addCustomGraphEvent('update', this.updateView.bind(this));
    }
  });

  exports.tagsmenu = TagsMenu;
});