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

  TagsMenu.MAX_TAGS = 5;

  TagsMenu.implement({
    afterLoad: function(graphcontroller) {
      this.graphcontroller = graphcontroller;

      this.bindEvents();
    },
    updateView: function() {
      var nodes = this.graphcontroller.artistGraph.data.nodes;

      this.commonTags = [];

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
            newTag.nodes = [];
            newTag.nodes.push(node);

            this.commonTags.push(newTag);
          }

        }, this);

        getTagsFromArtist.bind(this)(index + 1);
      }

      function getTagsFromArtist(index) {
        if (index === nodes.length) {

          this.commonTags = _.sortBy(this.commonTags, 'count').reverse();

          var tagsContainer = this.jelement.html('');
          var graphcontroller = this.graphcontroller;

          _.each(this.commonTags.slice(0, TagsMenu.MAX_TAGS), function(tag) {
            var tagElement = document.createElement('span');

            tagElement.className = 'common-tag';
            tagElement.id = tag.name;
            tagElement.innerHTML = tag.name;
            tagElement.nodes = tag.nodes;

            tagElement.onclick = function onTagClick(event) {
              $('.common-tag').removeClass('selected');

              this.className += ' selected'; // y u no work o0
              console.log(this.className);

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
              "terms?api_key=29N71ZBQUW4XN0QXF&format=json&sort=weight&name=" +
              encodeURIComponent(node.label);
            $.ajax({
              url: url,
              context: this
            }).done(
              function(data) {
                node.tags = data.response.terms;
                addTags.bind(this)(node, index);
              }
            );
          } else {
            addTags.bind(this)(node, index);
          }
        }
      }

      getTagsFromArtist.bind(this)(0);
    },
    bindEvents: function() {
      this.graphcontroller
        .addCustomGraphEvent('update', this.updateView.bind(this));
    }
  });

  exports.tagsmenu = TagsMenu;
});