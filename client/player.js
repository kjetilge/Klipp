/******************* HTML5 PLAYER *******************/
Template.html5Player.helpers({
  'posterImageUrl': function () {
    var notFound = true;
    var videoId = FlowRouter.getQueryParam('videoId');
    var vid = Videos.findOne({_id: videoId});
    if(vid && vid._id){ //VIDEO WITHOUT Videofile
      console.log("vid id", vid._id)
      if(!vid.filename) {
        //No video file yet
        return 'no-video.jpg';
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
    var videoId = FlowRouter.getQueryParam('videoId');
    var vid = Videos.findOne({_id: videoId});
    if(vid && vid._id) { //Hvis videoen er opprettet
      if(vid.downloadUrl)
        return vid.downloadUrl
      else
        return "video/no-video.mp4";
    }
    else {
      FlowRouter.go('/video-ikke-funnet');
    }
  }
})
Template.html5Player.created = function () {
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
    Videos.insert({title: "NO TITLE"})
  }
})
Template.videoNavItem.events({
  'click .video-select': function () {
    FlowRouter.setQueryParams({videoId: this._id});
  },
  'click button.remove-video': function () {
    console.log("removing", this)
    Videos.remove(this._id);
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
  }
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
