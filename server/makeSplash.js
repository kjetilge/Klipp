var ffmpeg = Meteor.npmRequire('liquid-ffmpeg');
var awsPath = ""
var vPath = '/Users/kjetil/Documents/Development/DevKlipp/CollectionFS-Demo/public/video/v10.mp4'
//var thumbPath = "/Users/kjetil/Documents/Development/DevKlipp/CollectionFS-Demo/public/thumbs/"
//var thumbPath = "/Users/kjetil/Documents/Development/DevKlipp/SPLASH_FILES/"
var thumbPath = "/splash/"
Meteor.methods({
  makeSplash: function (video_id, time) {
    var splashPath = Async.runSync(function(done) {
            makeSplash(video_id, time, done)
          });
    if(splashPath.error) {
      throw new Meteor.Error(error, "kunne ikke lage splash")
    } else {
      console.log('splashImagePath', splashPath.result)
      SplashImages.remove({})
      SplashImages.insert(splashPath.result)
    }
  }
})

function makeSplash(video_id, time, done) {
  var splashImagePath = new ffmpeg({ source: 'https://paretofilm-uploads.s3-eu-west-1.amazonaws.com/iKBXo27pL9JcANaKc/v3.mp4' })
    .withSize('1920x1080')
    .toFormat('png')
    .takeScreenshots({
        count: 1,
        timemarks: [ time.toString() ]
      }, thumbPath, function(err, filenames) {
        if(err) {
          console.log(err)
          done(null, err);
        } else {
          var splashImagePath = thumbPath+filenames[0]
          //console.log(splashImagePath);
          done(null, splashImagePath);
        }
    });
}
