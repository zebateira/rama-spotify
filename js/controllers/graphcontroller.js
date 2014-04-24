require([
  'js/controllers/controller#controller',
  '$api/models',
  '$views/throbber#Throbber',
  'js/models/artistgraph#ArtistGraph',
  'js/models/element#element'
], function(Controller, models, Throbber, ArtistGraph, Element) {

  var GraphController = new Class({
    Extends: Controller,

    initialize: function(name, config) {
      this.parent(name, config);

      this.options = config.options;

      this.settings = {
        selector: config.formSelector || this.selector + ' .settings-form',
      };

      this.inputs = {
        branching: {
          value: 'value'
        },
        depth: {
          value: 'value'
        },
        treemode: {
          value: 'checked'
        }
      };

      for (var input in this.inputs) {
        this.inputs[input].selector =
          this.selector + ' input[name=' + input + ']';
      }


    }
  });

  GraphController.implement({
    afterLoad: function() {

      this.settings = new Element(this.settings.selector);

      models.player.load('track').done(this, this.setArtistGraph);
      var self = this;

      _.each([

          function onChangeValue(input, value) {
            var config = {};
            config[input] = parseInt(value) || value;

            self.showThrobber();
            self.artistGraph.updateGraph(config);
            self.artistGraph.buildGraph();
          }
        ],
        function(eventHandler) {
          self[eventHandler.name](eventHandler);
        });

      // models.player.addEventListener('change', function(this, player) {
      //   this.events.onPlayerChange(this, player);
      // });
    },
    onChangeValue: function(eventHandler) {
      _.each(this.inputs, function(input) {
        $(input.selector).on('change', function() {
          eventHandler(this.name, this[input.value]);
        });
      });
    },
    currentArtist: {
      load: function(self, callback) {
        models.player.load('track').done(function(player) {
          callback(self,
            models.Artist.fromURI(player.track.artists[0].uri),
            player.track.advertisement);
        });
      }
    },
    updateView: function() {
      if (this.artistGraph) {
        this.artistGraph.redraw();
        if (this.artistGraph.throbber)
          this.artistGraph.throbber.setPosition('center', 'center');
      }
      return this;
    },
    events: {
      onPlayerChange: function(self, player) {
        self.currentArtist.load(self,
          function(self, currentArtist, advertisement) {
            var oldArtistURI = self.artistGraph.artist.uri;

            if (advertisement)
              return;

            if (currentArtist.uri !== oldArtistURI) {
              self.setArtistGraph(self, currentArtist);
              PlayQueue.updateView();
            }
          });
      },
      onNodeDoubleClick: function(self, data) {
        var node = _.findWhere(self.artistGraph.data.nodes, {
          id: parseInt(data.nodes[0])
        });

        if (!node || node.id === 1)
          return;

        node.artist.load('compilations').done(function(artist) {
          models.player.playContext(artist.compilations);
        });
      }
    },

    /**
      Set artist from the current playing track.
      Creates the artistGraph.
    */
    setArtistGraph: function(player) {
      var config = {
        options: this.options
      };

      if (this.artistGraph) {
        config.branching = this.artistGraph.branching;
        config.depth = this.artistGraph.depth;
        config.treemode = this.artistGraph.treemode;
      }

      this.artistGraph = new ArtistGraph(
        this.element,
        player.track.artists[0],
        config
      );

      this.showThrobber();
      this.artistGraph.buildGraph();
      var self = this;
      this.artistGraph.on('doubleClick', function doubleClick(data) {
        self.events.onNodeDoubleClick(self, data);
      });
    },
    showThrobber: function() {
      if (this.artistGraph.throbber)
        this.artistGraph.throbber.hide();

      this.artistGraph.throbber =
        Throbber.forElement(document.getElementById(this.name));
      this.artistGraph.throbber.setPosition('center', 'center');
      this.artistGraph.throbber._addBackground();
    }
  });

  exports.graphcontroller = GraphController;
});