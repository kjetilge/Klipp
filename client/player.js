/******************* HTML5 PLAYER *******************/
Session.setDefault("uploadFile", false)
Session.setDefault("showOnlyCurrentIssue", true);
Template.html5Player.created = function () {
  var self = this;
  self.autorun(function() {
    self.subscribe('videos');
  });
}
Template.html5Player.helpers({
  'posterImageUrl': function () {
    var notFound = true;
    var videoId = FlowRouter.getParam('videoId');
    var vid = Videos.findOne({_id: videoId});
    if(vid && vid._id){ //VIDEO WITHOUT Videofile
      //console.log("vid id", vid._id)
      if(!vid.downloadUrl) {
        //No video file yet
        //console.log("no filename", vid.downloadUrl)
        return '/images/no-video.jpg';
      } else {
        console.log("vid FILENAME")
        var splashImage = SplashImages.findOne(vid.splashId);
        return splashImage.url({store: 'splashImage'})
      }
    }
    else {
      if(Issues.find().count() > 0)
        FlowRouter.go('/video-ikke-funnet');
      else {
        FlowRouter.go('/');
      }
    }
  },
  videoUrl: function () { //Slingshot
    var fileUrl =  Session.get("uploadFile")
    if(fileUrl)
      return fileUrl

    var videoId = FlowRouter.getParam('videoId');
    var vid = Videos.findOne({_id: videoId});
    if(vid && vid._id) { //Hvis videoen er opprettet
      if(vid.downloadUrl) {
        return vid.downloadUrl
      }

      else {
        return "/video/no-video.mp4";
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
    var videoId = FlowRouter.getParam('videoId');
    self.subscribe('singleVideo', videoId);

    FlowRouter.subsReady("singleVideo", videoId, function() { //single video is available when signle video is available
      var vid = Videos.findOne({_id: videoId});
      self.subscribe('singleSplash', vid.splashId);
    })
  })
}

Template.html5Player.onRendered(function () {
  var time = FlowRouter.getQueryParam('time');
  if(time) {
    goToTime(time);
  }

  input = document.getElementById('slingshot_upload');
  /************* LOAD VIDEO INTO FORM *************/
  input.addEventListener('change', function (evt) {
      var reader = new window.FileReader(),
          file = evt.target.files[0],
          url;

          reader = window.URL || window.webKitURL;

      if (reader && reader.createObjectURL) {
          url = reader.createObjectURL(file);
          Session.set("uploadFile", url); /********** LOAD VIDEO *********/
          $("#video")[0].poster="";
          //reader.revokeObjectURL(url);  //free up memory ???
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




/******************* ISSUES *********************/

Template.issueNav.helpers({
	issueItems: function () {
    if(Session.get("showOnlyCurrentIssue"))
      return Issues.find({}, {sort: {createdAt: -1}, limit: 1});
    else
      return Issues.find({}, {sort: {createdAt: -1}});
	},
  showOnlyCurrentIssue: function () {
    return Session.get("showOnlyCurrentIssue");
  },
})

Template.issueNav.events({
  'click button.add-issue': function () {
    //Session.setDefault("showOnlyCurrentIssue", true);
    var issueNum = Issues.find().count();
    issueNum  = issueNum +61;
    var videoNum = Videos.find().count() + 1;
    var date = new Date();
    var issueId = Issues.insert({title: "Klipp "+issueNum, subtitle: "mye moro", published: false, createdAt: date});
    var videoId = Videos.insert({title: "video nr: "+videoNum, issueId: issueId, published: false, createdAt: date});

    var params = {issueId: issueId, videoId: videoId}
    FlowRouter.go("videoplayer", params)
  },

  'click button.toggle-issue-browser': function () {
    var showOnlyCurrentIssue = Session.get("showOnlyCurrentIssue");
    Session.set("showOnlyCurrentIssue", !showOnlyCurrentIssue);
  },

})

Template.issueItem.events({
  'click .issueItem': function () {
    Session.set("uploadFile", null);
    //FlowRouter.setParams({videoId: this._id});
  },
  'click button.remove-issue':function () {
    console.log("removing issue", this._id)
    var deletedIssueId = this._id;
    var currentIssueId = FlowRouter.getParam("issueId");
    console.log("deletedIssueId === currentIssue._id", deletedIssueId, currentIssueId)

    //show another issue before delete
    if(deletedIssueId === currentIssueId) {
      issueNum = Issues.find().count();

      //If the last remaining issue is beeing deleted, remove itwithout rerouting;
      if(issueNum === 1) {
        Issues.remove(deletedIssueId);
        return;
      }

      //Search for an issue that is not about to be deleted and display it if found

      var issueToShow = Issues.findOne({ _id: { $ne: deletedIssueId } })
      //If noe issues found show not found
      if(!Boolean(issueToShow)) {
        FlowRouter.go("/video-ikke-funnet"); // NO issues
        return;
      }

      console.log("issueToShow", issueToShow._id)
      videoToShow = issueToShow.videos().fetch()[0];
      var params = {issueId: issueToShow._id, videoId: videoToShow._id}
      var path = FlowRouter.path("videoplayer", params);
      console.log(path);
      FlowRouter.go(path);

    }

    Issues.remove(deletedIssueId);


  },
  'change input': function(event) {
    var x = event.target.checked;
    Issues.update(this._id, {$set: {published: x}})
    console.log("x",x);
  }
})

Template.issueItem.helpers({
  published: function () {
    console.log("this.published",this.published);
    return this.published;
  },
})

Template.issueNav.onCreated(function () {
  console.log("Issues")
  Meteor.subscribe("issues");
})





/******************* VIDEO NAVIGATION *******************/

Template.videoNav.helpers({
  videos: function () {
    var issueId = FlowRouter.getParam('issueId');
    console.log("issueId", issueId)
    return Videos.find({issueId: issueId});
  }
})
Template.videoNav.created = function () {
  Meteor.subscribe("videos");
  Meteor.subscribe('splashImages');
}
Template.videoNav.events({ /********** CREATE VIDEO ***********/
  'click button.add-video': function () { //.add-video
    console.log("add video")
    Session.set('videoLoaded', false)
    var issueId = FlowRouter.getParam('issueId');
    Videos.insert({title: "ingen tittel", issueId: issueId}, function (err, res) { //title: "Ingen tittel"
      if(res) //videoId
        FlowRouter.setParams({videoId: res});
      else {
        Session.set("errorMessage", "Kunne ikke opptrette ny video: "+err);
      }
    })
  }
})
Template.videoNavItem.events({
  'click .video-select': function () {
    Session.set("uploadFile", null);
    //FlowRouter.setParams({videoId: this._id});
  },
  'click button.remove-video': function () {
    Session.set("uploadFile", null);
    var issueId = FlowRouter.getParam("issueId");
    var count = Videos.find({issueId: issueId}).count();
    console.log("count", count)
    if(count > 1) {
      var deletedVideoId = this._id;
      var currentVideo = FlowRouter.getParam("videoId");
      var videoToShow = Videos.findOne({issueId: issueId}, {$not: {videoId: deletedVideoId}})
      var params = {issueId: issueId, videoId: videoToShow._id}

      if(deletedVideoId === currentVideo) { //Vis en annen video rett før sletting
        console.log("params", params)
        var path = FlowRouter.path("videoplayer", params);
        console.log(path); // prints "/blog/meteor/abc?show=yes&color=black"
        FlowRouter.go("videoplayer", params);
      }
      else {
        console.log("deletedVideoId !== currentVideo",deletedVideoId, currentVideo)
        //throw new Meteor.Error("kunne ikke vise annen video etter sletting");
      }
      Videos.remove(deletedVideoId)
    } else {
      alert("En utgave må ha minst én video");
    }
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





/******************* CHAPTERS *******************/

Template.chapters.helpers({
	chapters: function () {
    var videoId = FlowRouter.getParam('videoId');
		return Chapters.find({videoId: videoId}, {sort: {time: 1}});
	}
})
Template.chapter.events({
  'click button.delete': function () {
    //console.log(this);
    Chapters.remove(this._id);
  },
  'click img': function () { //Go to time
    var video = $("#video")[0]
    FlowRouter.setQueryParams({time: this.time});
  },
  'click button.adjust-time': function () {
    var video = $("#video")[0]
    var time = video.currentTime;
    Chapters.update(this._id, {$set: {time: time}});
  },
  'click button.adjust-image': function () { //todo: store image in a shadow collection and generate new upon video uploaded.
    var title = this.title;
    var id = Chapters.remove(this._id);
    console.log("removed", id)
    updateChapterImage(title, time); //Keep the time and title in the new image
  }

})
Template.chapter.onRendered(function () {
})

/***************** VIDEO NOT FOUND *****************/

Template.videoNotFound.helpers({
  issue: function () {
    var issue = Issues.findOne();
    console.log(issue);
    if(Boolean(issue) && issue._id) {
      var firstVideo = issue.firstVideo();
      return {
        _id: issue._id,
        firstVideoId: issue.firstVideo()._id
      }
    }
    else {
      return false;
    }
  }
})

Template.videoNotFound.events({
  'click button': function () {
    Videos.insert({title: "min første video"}, function (err, res) {
      console.log(res)
      FlowRouter.go("/videoplayer/"+res)
    })
  }
})

Template.videoNotFound.onCreated(function () {
  Meteor.subscribe("issues")
  Meteor.subscribe("videos")
})

/************************ methods (todo: make a library) ***************************/

//todo: store image in a shadow collection and generate new upon video uploaded.
function updateChapterImage(title, time) {
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
      Chapters.update(res._id, {$set: {videoId: videoId, time: time, title: title}} );
    }
  })
}

function goToTime(time) {
  var video = $("#video")[0];
  if(video){
       //console.log("Video!", video.readyState === 4)
       video.addEventListener('loadedmetadata', function() {
       video.currentTime = FlowRouter.getQueryParam('time');
       console.log("Video ready, skipping to", time)
     }, false);
  } else {
     setTimeout(function(){
       goToTime(time)
     }, 50)
  }
}
