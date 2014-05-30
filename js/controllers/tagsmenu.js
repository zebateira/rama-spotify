require([
  '$api/models',
  'js/controllers/controller#controller'
], function(models, Controller) {

  var TagsMenu = function(name, config) {
    Controller.call(this, name, config);

    // this.commonTags
    // common tags between all the artists in the graph.
    // these tags are an union of the sets of tags of every
    // artist in the graph.
    this.commonTags = [];

    // this.commonViewTags
    // subset of this.commonTags. These tags are the ones
    // selected to be shown in the DOM
    this.commonViewTags = [];
  };

  // Maximum number of tags shown
  TagsMenu.MAX_TAGS = 12;

  TagsMenu.prototype = Object.create(Controller.prototype);

  TagsMenu.prototype.loadController = function(graphcontroller) {
    this.graphcontroller = graphcontroller;

    this.bindEvents();
  };

  // updates the current list of shown tags 
  TagsMenu.prototype.updateTags = function() {
    var nodes = this.graphcontroller.getNodes();

    this.resetView();

    // number of requests completed.
    var numRequests = 0;

    _.each(nodes, function(nodeArtist) {

      // if the node already has the tags stored
      // (from previous loads)
      if (nodeArtist.tags) {
        // add it to this.commonTags
        addUniqueTags.bind(this)(nodeArtist, null);
        ++numRequests;
      } else {
        // otherwise fetch the tags from echonest
        this.graphcontroller.fetchTags(nodeArtist.uri,
          'frequency')
        // when the server responds, add the tags 
        // to this.commonTags that are unique to it
        .done(addUniqueTags.bind(this, nodeArtist))
        // when the request completes (successfully or not)
        // increment the number of request done.
        .complete((function onComplete() {
          // the total number of requests done should be exactly 
          // equal to the number of nodes of the graph.
          if (++numRequests === nodes.length) {
            // when all the requests have finished,
            // arrange the computed common tags between
            // all the artists.
            this.arrangeCommonTags();
            // and append them to the DOM
            this.appendCommonTags();
          }
        }).bind(this));
      }
    }, this);

    // adds tags from artist that are unique to this.commonTags
    // i.e. add tags from artist to this.commonTags, if not present.
    function addUniqueTags(node, data) {
      if (data && data.response)
        node.tags = data.response.terms;

      _.each(node.tags, function(newTag) {
        var existingTag = _.findWhere(this.commonTags, {
          name: newTag.name
        });

        if (!existingTag) {
          // if the tag does not exist in this.commonTags
          // tag.count indicates the number of times 
          // this tag occurs in the set of artist
          newTag.count = 1;
          // the nodes this tag is present on
          newTag.nodes = [node];
          // push the new tag to this.commonTags
          this.commonTags.push(newTag);
        } else {
          // if the tag is already present in this.commonTags
          // then push this node to the tag's list of nodes
          existingTag.nodes.push(node);
          // and update the count of tags
          existingTag.count++;
        }
      }, this);
    }
  };

  // sorts the artists common tags by count
  // and creates a shorter version of the list of tags
  // to be displayed.
  TagsMenu.prototype.arrangeCommonTags = function() {
    this.commonTags = _.sortBy(this.commonTags, 'count')
      .reverse();

    this.commonViewTags = _.sortBy(
      this.commonTags.slice(0, TagsMenu.MAX_TAGS),
      'name');
  };

  // appends the computed common tags to the DOM
  TagsMenu.prototype.appendCommonTags = function() {
    var tagsContainer = this.jelement.html('');
    var graphcontroller = this.graphcontroller;
    var commontagClass = this.selectors.commontag;

    _.each(this.commonViewTags, function(tag) {

      // create a DOM element for each tag
      var tagElement = document.createElement('span');

      tagElement.className = commontagClass.replace('.', '');
      tagElement.id = tag.name;
      tagElement.innerHTML = tag.name;
      tagElement.nodes = tag.nodes;

      // on tag click, toggle highlighting all of its
      // corresponding artists
      tagElement.onclick = this.events.onTagClick.bind(this);

      // finally append it to the tag's container
      tagsContainer.append(tagElement);
    }, this);
  };

  // reset the properties to their initial states
  TagsMenu.prototype.resetView = function() {
    this.commonTags = [];
    this.commonViewTags = [];
    this.element.innerHTML = 'Loading tags...';
  };

  TagsMenu.prototype.bindEvents = function() {
    this.graphcontroller.addCustomGraphEvent('updateTagsMenu',
      this.updateTags.bind(this));
  };

  TagsMenu.prototype.events = {
    onTagClick: function(event) {
      $('.common-tag.selected').not(event.target)
        .removeClass('selected');
      $(event.target).toggleClass('selected');

      if ($(event.target).hasClass('selected'))
        this.graphcontroller.highlightNodes(event.target.nodes);
      else
        this.graphcontroller.unHighlightNodes(event.target.nodes);
    }
  };

  TagsMenu.prototype.constructor = TagsMenu;

  exports.tagsmenu = TagsMenu;
});