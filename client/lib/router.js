//WebSocket connection to 'ws://localhost:3000/sockjs/740/t4rbwr7c/websocket' failed: WebSocket is closed before the connection is established.

FlowRouter.route('/videoplayer', {
    action: function(params, queryParams) {
      //console.log("Query Params:", queryParams);
      BlazeLayout.render('player', {
        videoArea: "html5Player",
        toolbarArea: "toolbar",
        chaptersArea: "chapters",
        videoNavArea: "videoNav"
      });
    },
    triggersExit: [function () {
      /*
      var player = $('#video')[0];
      var sources = player.getElementsByTagName('source');
      console.log("trigger");
      sources[0].src = "";*/
    }]
    //name: "<name for the route>" // optional
});
