//WebSocket connection to 'ws://localhost:3000/sockjs/740/t4rbwr7c/websocket' failed: WebSocket is closed before the connection is established.

FlowRouter.route('/utgave/:issueId/kurs/:videoId', {
    action: function(params, queryParams) {
      console.log("Query Params:", queryParams);
      var video = $("#video")[0];
      if(video) {
        var time = FlowRouter.getQueryParam('time')
        var time = Number(FlowRouter.getQueryParam('time'))
        if(time)
          video.currentTime = parseFloat(time);
      }
      BlazeLayout.render('player', {
        videoArea: "html5Player",
        toolbarArea: "toolbar",
        chaptersArea: "chapters",
        videoNavArea: "videoNav",
        issueNavArea: "issueNav"
      });
    },
    name: "videoplayer" // optional
});
FlowRouter.route('/video-ikke-funnet', {
    action: function() {
      BlazeLayout.render('videoNotFound');
    }
  });

FlowRouter.route('/', {
    action: function() {
      BlazeLayout.render('masterLayout', {
        footer: "footer",
        main: "home",
        nav: "nav",
      });
    },
    name: "home"
  });

FlowRouter.notFound = {
  action: function() {
    BlazeLayout.render('masterLayout', {
      footer: "footer",
      main: "pageNotFound",
      nav: "nav",
    });
  }
};
