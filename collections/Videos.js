Videos = new Mongo.Collection("videos")

Videos.helpers({
  chapters: function () {
    return Chapters.find({videoId: this._id})
  }
})


Videos.after.remove(function (userId, doc) {
  Meteor.call("removeMedia", doc)
});


if(Meteor.isServer) {
  if(Meteor.settings.AWS) {
    AWS.config.update({
      accessKeyId: Meteor.settings.AWS.accessKeyId,
      secretAccessKey: Meteor.settings.AWS.secretAccessKey    //
    })
  } else {
    console.warn("AWS settings missing")
  }
  s3 = new AWS.S3()

  list = s3.listObjectsSync({
    Bucket: 'paretofilm-uploads'
    //Prefix: 'subdirectory/'
  })
  console.log(list)



  Meteor.publish("videos", function () {
    return Videos.find({})
  });
  Meteor.publish("singleVideo", function (videoId) {
    return Videos.find({_id: videoId})
  })
  Meteor.methods({
    removeMedia: (video) => {
      var res = Chapters.remove({videoId: video._id});
      console.log("Chapters.remove res", res)
      SplashImages.remove(video.splashId);
      removeVideo(video);
    }
  })
  Meteor.startup(function () {
    /*
    if( Videos.find().count() === 0) {
      var videoRange = Array.from(Array(11).keys())
      for (var v of videoRange) {
        console.log("Inserting", v)
        Videos.insert( {fileName: "v" + (v+1) + ".mp4"} )
        //Videos.insert( {fileName: "test"} )
      }
      // for (var v of videoRange) {console.log("v"+v+".mp4")}
    }*/
  })
}

function removeVideo(video) {
  var key = video._id+"/"+video.fileName;
  console.log("Deleting", key)
  var params = {
    Bucket: 'paretofilm-uploads', /* required */
    Key: key, /* required */
  };
  s3.deleteObject(params, function(err, data) {
    if(err)
      console.log(err, err.stack); // an error occurred
    else
      console.log("s3 deleted: ",data);           // successful response
  });
}
