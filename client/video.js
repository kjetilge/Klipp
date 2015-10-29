Template.video.onCreated(function () {
  Meteor.subscribe("videos");
})
Template.video.onRendered(function () {

  var v = document.getElementsByTagName('video')[0]
  var t = document.getElementById('time');
  v.addEventListener('timeupdate',function(event){
    t.innerHTML = parseInt(v.currentTime) + ' - ' + v.currentTime;
  },false);

})

Template.video.helpers({
  'posterImageUrl': function () {
    var splashImage = SplashImages.findOne()
    if(splashImage) {
      return splashImage.url({store: 'splashImage'})
    }
  },
  'posterImageSmallUrl': function () {
    var splashImage = SplashImages.findOne()
    if(splashImage) {
      return splashImage.url({store: 'splashSmall'})
    }
  },
  videoUrl: function () {
    var vid = Videos.findOne()
    if(Boolean(vid)) {
      var downloadUrl = vid.downloadUrl
      return downloadUrl
    }
    return null
  }
})

Template.video.events({
  'click button.snapshot': function (e, t) {
    console.log("snap")
    video = t.find('video')
    captureStill()
    console.log(video.currentTime)
  },
  'click button.splash-shot': function (e, t) {
    var video_id="123"
    video = t.find('video')
    time = video.currentTime
    console.log(video.currentTime)
    Meteor.call('makeSplash', video_id, time)
  }
})

function captureStill() {
  var video = $("video").get(0);
  var canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d')
        .drawImage(video, 0, 0, canvas.width, canvas.height);

  var img = document.createElement("img");
  img.src = canvas.toDataURL();
  Chapters.insert(canvas.toDataURL())
}
