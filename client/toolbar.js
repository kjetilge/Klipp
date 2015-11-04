Session.setDefault('videoLoaded', false)
var uploader = new ReactiveVar();

Template.toolbar.events({
  'click button.snapshot': function (e, t) {
    console.log("snap");
    video = $('#video')[0];
    var videoId = Session.get("videoId")
    //console.log(video.currentTime);
    //console.log(videoId)
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
  },
  'change #slingshot_upload': function () {
    Session.set('videoLoaded', true);
  }
})
Template.toolbar.onRendered(function () {
  //Session.set("isUploading", false)
  //Session.set('videoLoaded', false);
})

Template.uploader.helpers({
  showUploadButton: function () {
    var loaded = Session.get('videoLoaded');
    var uploading = Session.get("isUploading")
    return loaded && !uploading;
  },
  showCancelButton: function () {
    var uploading = Session.get("isUploading")
    return uploading
  },
  showFileInput: function () {
    var uploading = Session.get("isUploading")
    return uploading
  }
})

Template.progressBar.helpers({
    isUploading: function () {
      var uploading = Boolean(uploader.get())
      Session.set("isUploading", uploading)
      return uploading;
    },

    progress: function () {
        var upload = uploader.get();
        if (upload)
            //return upload.progress() * 100;//Math.round(upload.progress() * 100) || 0 ;
          return truncate(upload.progress() * 100, 1) || 0
    }
});
var upload;
Template.uploader.events({
  'click button.upload': function (e, template) {
    var videoId = FlowRouter.getQueryParam('videoId');
    VID = videoId;
    upload = new Slingshot.Upload("videoUploads", {videoId: videoId}); //videoId ADD meta-context
    file = template.find("#slingshot_upload").files[0];
    if(file) {
      upload.send(file, function (error, downloadUrl) {
        uploader.set();
        if (error) {
          // Log service detailed response
          console.error('Error uploading'); //, uploader.xhr.response);
          alert (error);
        } else {
            Session.set("uploadFile", null);
            var splashTime = Session.get("splashTime");
            var time = '1.10';
            if(splashTime) {
              time = splashTime;
              Session.set(null);
            }
            splashId = Meteor.call('makeSplash', downloadUrl, time, (err, res) => {
            Videos.update(VID, {$set: {downloadUrl: downloadUrl, splashId: res._id}})
          });
        }
      });
    }
    uploader.set(upload);
  },
  'click button.cancel': function () {
    upload.xhr.abort();
    Session.set("uploadFile", null);
    Session.set("isUploading", false)
    Session.set('videoLoaded', false);
    videoId = FlowRouter.getQueryParam('videoId');
    FlowRouter.go("/videoplayer?videoId="+videoId);
    //todo reload the previous video
  }
});
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
      Chapters.update(res._id, {$set: {videoId: videoId, time: time, title: "ingen tittel"}} );
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

var truncate = function (numberToBeTruncated, numberOfDecimalsToKeep) {
    var theNumber = numberToBeTruncated.toFixed(++numberOfDecimalsToKeep);
    return +(theNumber.slice(0, --theNumber.length));
};
