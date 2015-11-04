Template.toolbar.events({
  'click button.snapshot': function (e, t) {
    console.log("snap");
    video = $('#video')[0];
    var videoId = Session.get("videoId")
    console.log(video.currentTime);
    console.log(videoId)
    captureStill(videoId, video.currentTime);

  },
  'click button.splash-shot': function (e, t) {
    //Get the video time
    var video = $("#video")[0];
    var time = video.currentTime

    var videoId = FlowRouter.getQueryParam('videoId');
    var vid = Videos.findOne(videoId);

    //If video is not upoaded yet, store the splash time
    if(!vid.downloadUrl) {
      console.log("capure off-line splash")
      //capture a still and show it in navItem
      Session.set('splashTime', time)
      //todo: Show the splash in the Nav Item
      previewSplash(videoId);
      return;
    }
    var vidUrl = vid.downloadUrl;

    console.log("vidUrl", vidUrl)
    Meteor.call('makeSplash', vidUrl, time, function (err,res) {
      if(res) {
        console.log("splashId", res)
        //todo: sjekk om video har splash fra før og slett den gamle.
        Videos.update(videoId, {$set: {splashId: res._id}});
      } else {
        console.log(err);
      }
    })
  }
})


function captureStill() {
  var video = $("video").get(0);
  var time = video.currentTime;
  var canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d')
        .drawImage(video, 0, 0, canvas.width, canvas.height);

  var img = document.createElement("img");
  img.src = canvas.toDataURL();
  console.log(this);
  videoId = FlowRouter.getQueryParam('videoId');
  var id = Chapters.insert(canvas.toDataURL(), function(err, res) {
    if(err) {
      alert(err);
    } else {
      Chapters.update(res._id, {$set: {videoId: videoId, time: time}} );
    }
  })
}

function previewSplash(videoId) {
  var video = $("video").get(0);
  var time = video.currentTime;
  var canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d')
        .drawImage(video, 0, 0, canvas.width, canvas.height);

  //var img = document.createElement("img");
  var img = $(".video-select#"+videoId+" img")[0];
  img.src = canvas.toDataURL();
  console.log(this);
}
