require([
  '$api/models',
  'js/controllers/controller#controller'
], function(models, Controller) {

  var TagsMenu = new Class({
    Extends: Controller,

    initialize: function(name, config) {
      this.parent(name, config);

      this.commonTags = [];
      this.viewTags = [];
    }
  });

  // Maximum number of tags shown
  TagsMenu.MAX_TAGS = 12;

  TagsMenu.implement({

    // not much to set here...
    loadController: function(graphcontroller) {
      this.graphcontroller = graphcontroller;

      this.bindEvents();
    },

    // updates the current list of tags shown
    updateView: function() {
      var nodes = this.graphcontroller.getData().nodes;

      this.resetView();

      _.each(nodes, function(node) {

      }, this);


      getTagsFromArtist.bind(this)(0);

      function addTags(node, index) {

        _.each(node.tags, function(newTag) {
          var isPresent = false;
          var lastEqual = {};

          _.each(this.commonTags, function(tag) {
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

            this.commonTags.push(newTag);
          }

        }, this);

        getTagsFromArtist.bind(this)(index + 1);
      }

      function getTagsFromArtist(index) {
        if (index === nodes.length) {

          this.commonTags = _.sortBy(this.commonTags, 'count')
            .reverse();

          var tagsContainer = this.jelement.html('');
          var graphcontroller = this.graphcontroller;
          var commontagClass = this.selectors.commontag;

          this.viewTags = _.sortBy(
            this.commonTags.slice(0, TagsMenu.MAX_TAGS),
            'name');

          _.each(this.viewTags, function(tag) {
            var tagElement = document.createElement('span');

            tagElement.className = commontagClass.replace('.', '');
            tagElement.id = tag.name;
            tagElement.innerHTML = tag.name;
            tagElement.nodes = tag.nodes;

            tagElement.onclick = function onTagClick(event) {
              if (this.className.contains('selected'))
                return;

              $(commontagClass).removeClass('selected');

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

              graphcontroller.updateNodes();

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
              "terms?api_key=29N71ZBQUW4XN0QXF&" +
              "format=json&sort=frequency&" +
              "id=" + node.artist.uri.replace('spotify', 'spotify-WW');

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

    // reset the properties to their initial states
    resetView: function() {
      this.commonTags = [];
      this.viewTags = [];
      this.element.innerHTML = 'Loading tags...';
    },

    bindEvents: function() {
      this.graphcontroller
        .addCustomGraphEvent('updateTagsMenu', this.updateView.bind(this));
    }
  });

  exports.tagsmenu = TagsMenu;
});