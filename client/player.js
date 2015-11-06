/******************* HTML5 PLAYER *******************/
Session.setDefault("uploadFile", false)

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
      FlowRouter.go('/video-ikke-funnet');
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
		return Issues.find({});
	}
})

Template.issueNav.events({
  'click button.add-issue': function () {
    var no = Issues.find().count()
    var issueId = Issues.insert({title: "Klipp "+no+61, subtitle: "mye moro"});
    var videoId = Videos.insert({title: "video til no:"+no+61, issueId: issueId});
    var params = {issueId: issueId, videoId: videoId}
    var path = FlowRouter.path("blogPostRoute", params);
    FlowRouter.go("videoplayer", params)
  }
})
Template.issueItem.events({
  'click button.remove-issue':function () {
    console.log("remove issue", this._id)
    Issues.remove(this._id);
    var issue = Issues.findOne();
    if(issue) {
      var videoId = issue.videos().fetch()[0];
      var params = {videoId: videoId, issueId: issue._id}
      Router.go("videoplayer", params);
    } else {

    }
  }
})

Template.issueNav.onCreated(function () {
  console.log("Issues")
  Meteor.subscribe("issues");
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
    FlowRouter.setParams({videoId: this._id});
  },
  'click button.remove-video': function () {
    Session.set("uploadFile", null);
    var issueId = FlowRouter.getParam("issueId");
    var count = Videos.find({issueId: issueId}).count();
    console.log("count", count)
    if(count > 1) {
      Videos.remove(this._id, (err, res) => {
        if(res) {
          //Go to one of the remaining videos in the issue
          var vid = Videos.findOne({issueId: issueId});
          var params = {issueId: issueId, videoId: vid._id}
          console.log("params", params)
          if(vid && vid._id) {
            FlowRouter.go("videoplayer", params);
          }
          else {
            throw new Meteor.Error("kunne ikke slette video", err);
          }
        }
      })
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
    Videos.insert({title: "min første video"}, function (err, res) {
      console.log(res)
      FlowRouter.go("/videoplayer/"+res)
    })
  }
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
