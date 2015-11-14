Session.setDefault('videoLoaded', false)
Session.setDefault('isUploading', false)

var uploader = new ReactiveVar();

Template.toolbar.events({
  'click a.snapshot': function (e, t) {
    console.log("snap");
    video = $('#video')[0];
    var videoId = Session.get("videoId")
    //console.log(video.currentTime);
    //console.log(videoId)
    captureStill(videoId, video.currentTime);

  },
  'click a.splash-shot': function (e, t) {
    var videoId = FlowRouter.getParam('videoId');
    var vid = Videos.findOne(videoId);
    //remove existing splash
    var splash = SplashImages.findOne(vid.splashId);
    if(splash && splash._id){
      SplashImages.remove(splash._id);
    }

    //Get the video dimentions
    var video = $("#video")[0];
    var x = video.videoWidth;
    var y = video.videoHeight;
    var aspect = x/y;
    var splashWidth = 1920;
    var splashHeight =  truncate((splashWidth / aspect), 0)

    var time = video.currentTime

    //capture a still and show it in navItem
    Session.set('splashTime', time)
    previewSplash(videoId);

    //If video is uploaded make a still from original serverside
    if(vid && vid.downloadUrl) {
      var vidUrl = vid.downloadUrl;
      console.log("vidUrl", vidUrl)
      Meteor.call('makeSplash', vidUrl, time, splashWidth, splashHeight, function (err,res) {
        if(res) {
          console.log("splashId", res)
          //todo: sjekk om video har splash fra før og slett den gamle.
          Videos.update(videoId, {$set: {splashId: res._id}});
        } else {
          console.log(err);
        }
      })
    }
  },
  'click a.issue-shot': function (e, t) {
    var videoId = FlowRouter.getParam('videoId');
    var issueId = FlowRouter.getParam('issueId');

    var vid = Videos.findOne(videoId);
    var issue = Issues.findOne(issueId);
    //remove existing splash
    var splash = SplashImages.findOne(issue.splashId);
    if(splash && splash._id){
      SplashImages.remove(splash._id);
    }

    //Get the video dimentions
    var video = $("#video")[0];
    var x = video.videoWidth;
    var y = video.videoHeight;
    var aspect = x/y;
    var splashWidth = 1920;
    var splashHeight =  truncate((splashWidth / aspect), 0)

    var time = video.currentTime

    //capture a still and show it in navItem
    Session.set('splashTime', time)
    previewIssueSplash(issueId);
    //Issues.insert({videoId: vid._id}) //Insert empty Issue to refer to after video is uploaded
    Videos.update(videoId,{$set: {issueSplashTime: time}})
    //If video is uploaded make a still from original serverside
    if(vid && vid.downloadUrl) {
      var vidUrl = vid.downloadUrl;
      console.log("vidUrl", vidUrl)
      Meteor.call('makeSplash', vidUrl, time, splashWidth, splashHeight, function (err,res) {
        if(res) {
          console.log("splashId", res)
          //todo: sjekk om video har splash fra før og slett den gamle.
          Issues.update(issueId, {$set: {splashId: res._id}});
        } else {
          console.log(err);
        }
      })
    }
  },
  'change #slingshot_upload': function () {
    console.log("slingshot_upload set")
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
        if (upload) {
          var progress = truncate(upload.progress() * 100, 1) || 0
          console.log("progressing", progress)
          //return upload.progress() * 100;//Math.round(upload.progress() * 100) || 0 ;
          return progress;
        } else {
          return 0;
        }

    }
});
var upload;
Template.uploader.events({
  'click a.upload': function (e, template) {
    e.preventDefault();
    /* DIMENSIONS */
    var video = $("#video")[0];
    var AutoSplashTime = video.duration / 2;
    var x = video.videoWidth;
    var y = video.videoHeight;
    var aspect = x/y;
    SplashWidth = 1920;
    SplashHeight =  truncate((SplashWidth / aspect), 0);
    /* END DIMENSIONS */

    var videoId = FlowRouter.getParam('videoId');
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
            //Session.set("uploadFile", null);
            var splashTime = Session.get("splashTime");
            var time = AutoSplashTime;
            if(splashTime) {
              time = splashTime;
              Session.set("splashTime", null);
            } //vidUrl, time, splashWidth, splashHeight
            //************************** Video SPLASH ****************************
            splashId = Meteor.call('makeSplash', downloadUrl, time, SplashWidth, SplashHeight, (err, res) => {
              Videos.update(VID, {$set: {downloadUrl: downloadUrl, splashId: res._id}})
              Session.set('videoLoaded', false);
              Session.set("uploadFile", null); //er dette lurt ?
            });


            //************************** ISSUE SPLASH ****************************
            //Capture issueSplash if preview exists
            let video = Videos.findOne(VID)
            let issue = Issues.findOne(video.issueId);
            if(video.issueSplashTime) {
              Meteor.call('makeSplash', downloadUrl, video.issueSplashTime, SplashWidth, SplashHeight, (err, res) => {
                Issues.update(issue._id, {$set: {splashId: res._id}})
                Session.set("uploadFile", null); //er dette lurt ?
              });
            }

        }
      });
    }
    uploader.set(upload);
  },
  'click a.cancel': function () {
    upload.xhr.abort();
    Session.set("uploadFile", null);
    Session.set("isUploading", false)
    Session.set('videoLoaded', false);
    videoId = FlowRouter.getParam('videoId');
    FlowRouter.go("/videoplayer?videoId="+videoId);
    //todo reload the previous video
  },
  'click .filebutton': function (e,t) {
    e.preventDefault();
    console.log("open dialog..")
    $('#slingshot_upload').click();
  },
  'change .upload': function (e, t) {
    var filename = e.target.value.split("\\").pop(-1)
    console.log("filename", filename)
    $("a.filenameviewer").text(filename);
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
  videoId = FlowRouter.getParam('videoId');
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
  console.log(img);
  img.src = canvas.toDataURL();
}

function previewIssueSplash(issueId) {
  var video = $("video").get(0);
  var time = video.currentTime;
  var canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d')
        .drawImage(video, 0, 0, canvas.width, canvas.height);

  //var img = document.createElement("img");
  var img = $(".issue-select#"+issueId+" img")[0];
  console.log(img);
  img.src = canvas.toDataURL();
}

var truncate = function (numberToBeTruncated, numberOfDecimalsToKeep) {
    var theNumber = numberToBeTruncated.toFixed(++numberOfDecimalsToKeep);
    return +(theNumber.slice(0, --theNumber.length));
};
