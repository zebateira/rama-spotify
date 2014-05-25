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

    // updates the current list of shown tags 
    updateView: function() {
      var nodes = this.graphcontroller.getData().nodes;

      this.resetView();

      var numRequests = 0;

      _.each(nodes, function(nodeArtist) {
        if (!nodeArtist.tags) {

          this.graphcontroller.fetchTags(nodeArtist.artist.uri,
            'frequency',
            addTags.bind(this, nodeArtist),
            fail
          );
        } else {
          addTags.bind(this)(nodeArtist, null);
        }
      }, this);

      function fail() {
        ++numRequests;
      }

      function addTags(node, data) {
        if (data && data.response)
          node.tags = data.response.terms;

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

        if (++numRequests === nodes.length) {
          allDone.bind(this)();
        }
      }

      function allDone() {
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