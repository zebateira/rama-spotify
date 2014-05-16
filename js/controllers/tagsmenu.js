require([
  '$api/models',
  'js/controllers/controller#controller'
], function(models, Controller) {
  var TagsMenu = new Class({
    Extends: Controller,

    initialize: function(name, config) {
      this.parent(name, config);

      this.commmonTags = [];
    }
  });

  TagsMenu.MAX_TAGS = 10;

  TagsMenu.implement({
    afterLoad: function(graphcontroller) {
      this.graphcontroller = graphcontroller;

      this.bindEvents();
    },
    resetView: function() {
      this.commmonTags = [];
      this.element.innerHTML = 'Loading tags...';
    },
    updateView: function() {
      var nodes = this.graphcontroller.artistGraph.data.nodes;

      this.resetView();

      getTagsFromArtist.bind(this)(0);

      function addTags(node, index) {

        _.each(node.tags, function(newTag) {
          var isPresent = false;
          var lastEqual = {};
          _.each(this.commmonTags, function(tag) {
            var areTheSame = newTag.name === tag.name;

            if (areTheSame)
              lastEqual = tag;

            isPresent = isPresent || areTheSame;
          });

          if (isPresent) {
            lastEqual.count++;
            lastEqual.nodes.push(node);
          } else {
            newTag.count = 1;
            newTag.nodes = [node];

            this.commmonTags.push(newTag);
          }

        }, this);

        getTagsFromArtist.bind(this)(index + 1);
      }

      function getTagsFromArtist(index) {
        if (index === nodes.length) {

          this.commmonTags = _.sortBy(this.commmonTags, 'count').reverse();

          var tagsContainer = this.jelement.html('');
          var graphcontroller = this.graphcontroller;

          this.viewTags = _.sortBy(this.commmonTags.slice(0, TagsMenu.MAX_TAGS), 'name');

          _.each(this.viewTags, function(tag) {
            var tagElement = document.createElement('span');

            tagElement.className = 'common-tag';
            tagElement.id = tag.name;
            tagElement.innerHTML = tag.name;
            tagElement.nodes = tag.nodes;

            tagElement.onclick = function onTagClick(event) {
              if (this.className.contains('selected'))
                return;

              $('.common-tag').removeClass('selected');

              this.className += ' selected';

              _.each(this.nodes, function(node) {
                if (node.id !== 1)
                  node.color = {
                    background: '#313336',
                    border: '#7fb701'
                  };
                else
                  node.color = {
                    border: '#7fb701'
                  };
              });

              graphcontroller.updateData();

              _.each(this.nodes, function(node) {
                if (node.id !== 1)
                  node.color = {
                    background: '#313336',
                    highlight: {
                      border: '#7fb701'
                    }
                  };
                else
                  node.color = {
                    highlight: {
                      border: '#7fb701'
                    }
                  };
              });
            };

            tagsContainer.append(tagElement);
          });

        } else {
          var node = nodes[index];

          if (!node.tags) {
            var url = "http://developer.echonest.com/api/v4/artist/" +
              "terms?api_key=29N71ZBQUW4XN0QXF&format=json&sort=weight&id=" +
              node.artist.uri.replace('spotify', 'spotify-WW');

            $.ajax({
              url: url,
              context: this
            }).done(
              function(data) {
                node.tags = data.response.terms;

                addTags.bind(this)(node, index);
              }
            ).fail(function() {
              getTagsFromArtist.bind(this)(index + 1);
            });
          } else {
            addTags.bind(this)(node, index);
          }
        }
      }

    },
    bindEvents: function() {
      this.graphcontroller
        .addCustomGraphEvent('update', this.updateView.bind(this));
    }
  });

  exports.tagsmenu = TagsMenu;
});