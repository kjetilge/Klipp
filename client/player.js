//Session.setDefault('previousHeight', 0);

Template.html5Player.helpers({
  video: function () {
    var videoId = FlowRouter.getQueryParam('videoId');
    var vid = Videos.findOne({_id: videoId});
    if(vid && vid._id) {
      return vid;
    }
    else {
      vid = Videos.findOne(); //
      //Session.set("videoId", videoId);
      return vid;
    }
  },
  'posterImageUrl': function () {
    var videoId = FlowRouter.getQueryParam('videoId');

    FlowRouter.subsReady("singleVideo", function() {
      var vid = Videos.findOne({_id: videoId});
      console.log("subs ready",splashImage);
      var splashImage = SplashImages.findOne(vid.splashId);
      console.log("splashImage",splashImage)
      return splashImage.url({store: 'splashImage'})
    });

    /*
    console.log("splash",splashImage)
    if(splashImage) {
      return splashImage.url({store: 'splashImage'})
    } else {
      return "";
    }*/
  },
  videoUrl: function () { //Slingshot
    var videoId = FlowRouter.getQueryParam('videoId');
    var vid = Videos.findOne({_id: videoId});
    if(Boolean(vid)) {
      var downloadUrl = vid.downloadUrl
      return downloadUrl
    }
    else {
      vid = Videos.findOne();
      return vid;
    }
  }
})
/*
Template.html5Player.created = function() {
  var self = this;
  self.autorun(function() {
    var videoId = FlowRouter.getQueryParam('videoId');
    //console.log("subd videoId", videoId)
    var vid = Videos.findOne({_id: videoId});
    if(vid)
      self.subscribe('singleVideo', videoId);
    else
      self.subscribe('singleVideo', "F6cmExoGDPo2CCxPa");
    self.subscribe('videos');
  });
}*/
Template.html5Player.created = function () {
  var self = this;
  self.autorun(function() {
    var videoId = FlowRouter.getQueryParam('videoId');
    FlowRouter.subsReady("singleVideo", videoId, function() { //single video is available when signle video is available
      var vid = Videos.findOne({_id: videoId});
      self.subscribe('singleSplash', vid.splashId);
    })
  })
}


/******************* SPLASH IMAGES *******************/
/*
Template.splashImage.helpers({
	splash: function () {
		var splash = SplashImages.findOne();
		console.log(splash)
		return splash;
	}
})*/

/******************* CHAPTERS *******************/
Template.chapters.helpers({
	chapters: function () {
    var videoId = FlowRouter.getQueryParam('videoId');
		return Chapters.find({videoId: videoId});
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

Template.videoNavItem.events({
  'click': function () {
    //console.log("nav", this)
    FlowRouter.setQueryParams({videoId: this._id});
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
