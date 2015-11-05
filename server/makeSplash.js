var ffmpeg = Meteor.npmRequire('liquid-ffmpeg');
var awsPath = ""
var vPath = '/Users/kjetil/Documents/Development/DevKlipp/CollectionFS-Demo/public/video/v10.mp4'
//var thumbPath = "/Users/kjetil/Documents/Development/DevKlipp/CollectionFS-Demo/public/thumbs/"
//var thumbPath = "/Users/kjetil/Documents/Development/DevKlipp/SPLASH_FILES/"
var thumbPath = "/splash/"
Meteor.methods({
  makeSplash: function (vidUrl, time, splashWidth, splashHeight) {
    var splashPath = Async.runSync(function(done) {
            makeSplash(vidUrl, time, splashWidth, splashHeight, done)
          });
    if(splashPath.error) {
      throw new Meteor.Error(error, "kunne ikke lage splash")
    } else {
      console.log('splashImagePath', splashPath.result)
      var splashId = SplashImages.insert(splashPath.result);
      return splashId;
    }
  }
})
//Todo: controll acpect. Let y be variable
function makeSplash(vidUrl, time, splashWidth, splashHeight, done) {
  console.log("vidUrl", vidUrl)
  console.log("time", time)
  var size = splashWidth+"x"+splashHeight
  console.log("size", size)
  var splashImagePath = new ffmpeg({ source: vidUrl})
    .withSize(size)
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
