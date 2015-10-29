var ffmpeg = Meteor.npmRequire('liquid-ffmpeg');
var awsPath = ""
var vPath = '/Users/kjetil/Documents/Development/DevKlipp/CollectionFS-Demo/public/video/v10.mp4'
var thumbPath = "/Users/kjetil/Documents/Development/DevKlipp/CollectionFS-Demo/public/thumbs/"
Meteor.methods({
  makeSplash: function (video_id, time) {
    console.log("splashing..")
    var proc = new ffmpeg({ source: '/Users/kjetil/Documents/Development/DevKlipp/CollectionFS-Demo/public/video/v11.mp4' })
      .withSize('1920x1080')
      .toFormat('png')
      .takeScreenshots({
          count: 1,
          timemarks: [ time.toString() ]
        }, thumbPath, function(err, filenames) {
          if(err) {
            console.log(err)
          } else {
            console.log(filenames);
            console.log('screenshots were saved for time: '+time);
          }
      });
  }
})
