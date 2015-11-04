/******************* HTML5 PLAYER *******************/
Template.html5Player.helpers({
  'posterImageUrl': function () {
    var notFound = true;
    var videoId = FlowRouter.getQueryParam('videoId');
    var vid = Videos.findOne({_id: videoId});
    if(vid && vid._id){ //VIDEO WITHOUT Videofile
      //console.log("vid id", vid._id)
      if(!vid.downloadUrl) {
        //No video file yet
        //console.log("no filename", vid.downloadUrl)
        return 'images/no-video.jpg';
      } else {
        console.log("vid FILENAME")
        var splashImage = SplashImages.findOne(vid.splashId);
        return splashImage.url({store: 'splashImage'})
      }
    }
    else {
      //FlowRouter.go('/video-ikke-funnet');
    }
  },
  videoUrl: function () { //Slingshot
    var fileUrl =  Session.get("uploadFile")
    if(fileUrl)
      return fileUrl

    var videoId = FlowRouter.getQueryParam('videoId');
    var vid = Videos.findOne({_id: videoId});
    if(vid && vid._id) { //Hvis videoen er opprettet
      if(vid.downloadUrl)
        return vid.downloadUrl
      else {
        return "video/no-video.mp4";
      }

    }
    else {
      FlowRouter.go('/video-ikke-funnet');
    }
  }
})
Template.html5Player.created = function () {
  Session.set("uploadFile", null)
  var self = this;
  self.autorun(function() {
    var videoId = FlowRouter.getQueryParam('videoId');
    self.subscribe('singleVideo', videoId);

    FlowRouter.subsReady("singleVideo", videoId, function() { //single video is available when signle video is available
      var vid = Videos.findOne({_id: videoId});
      self.subscribe('singleSplash', vid.splashId);
    })
  })
}

Session.setDefault("uploadFile", false)
Template.html5Player.onRendered(function () {
  /************* LOAD VIDEO INTO FORM *************/
  var video = $("#video")[0],
      input = document.getElementById('slingshot_upload');

  input.addEventListener('change', function (evt) {
      var reader = new window.FileReader(),
          file = evt.target.files[0],
          url;

          reader = window.URL || window.webKitURL;

      if (reader && reader.createObjectURL) {
          url = reader.createObjectURL(file);
          Session.set("uploadFile", url); /********** LOAD VIDEO *********/
          $("#video")[0].poster="";
          //reader.revokeObjectURL(url);  //free up memory
          return;
      }

      if (!window.FileReader) {
          console.log('Sorry, not so much');
          return;
      }

      reader = new window.FileReader();
      reader.onload = function(evt) {
         $("#video")[0].src = evt.target.result;
      };
      reader.readAsDataURL(file);
  }, false);
})


/******************* CHAPTERS *******************/
Template.chapters.helpers({
	chapters: function () {
    var videoId = FlowRouter.getQueryParam('videoId');
		return Chapters.find({videoId: videoId});
	}
})
Template.chapter.events({
  'click': function () {
    console.log(this);
  }
})
Template.chapter.onRendered(function () {
  imgix.fluid({
    updateOnResizeDown: true,
    pixelStep: 5,
    autoInsertCSSBestPractices: true
  });
})

/******************* VIDEO NAVIGATION *******************/
Template.videoNav.helpers({
  videos: function () {
    return Videos.find();
  }
})
Template.videoNav.created = function () {
  Meteor.subscribe("videos");
  Meteor.subscribe('splashImages');
}
Template.videoNav.events({ /********** CREATE VIDEO ***********/
  'click button': function () { //.add-video
    console.log("add video")
    Videos.insert({title: "NO TITLE"}, function (err, res) {
      if(res) //videoId
        FlowRouter.setQueryParams({videoId: res});
      else {
        Session.set("errorMessage", "Kunne ikke opptrette ny video: "+err);
      }
    })
  }
})
Template.videoNavItem.events({
  'click .video-select': function () {
    Session.set("uploadFile", null);
    FlowRouter.setQueryParams({videoId: this._id});
  },
  'click button.remove-video': function () {
    Session.set("uploadFile", null);
    Videos.remove(this._id, function (err, res) {
      if(res) {
        var vid = Videos.findOne();
        if(vid && vid._id) {
          FlowRouter.go("/videoplayer?videoId="+vid._id);
        }
        else {
          FlowRouter.go("/video-ikke-funnet")
        }
      }
    })

  }
})
Template.videoNavItem.helpers({
  splashSmall: function () {
    var videoId = this._id;
    vid = Videos.findOne(videoId);
    //console.log("VIDEO",vid)
    var splash = SplashImages.findOne(vid.splashId);
    //console.log("splash",splash)
    return splash.url({store: "splashSmall"});
  },
})

Template.videoNotFound.helpers({
  'videoId': function () {
    var vid = Videos.findOne();
    if(vid && vid._id)
      return vid._id;
    else {
      return false;
    }
  }
})

Template.videoNotFound.events({
  'click button': function () {
    Videos.insert({title: "NO TITLE"}, function (err, res) {
      console.log(res)
      FlowRouter.go("/videoplayer?videoId="+res)
    })
  }
})

Template.html5Player.created = function () {
  var self = this;
  self.autorun(function() {
    self.subscribe('videos');
  });
}
