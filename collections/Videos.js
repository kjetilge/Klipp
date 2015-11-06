Videos = new Mongo.Collection("videos")

Videos.helpers({
  chapters: function () {
    return Chapters.find({videoId: this._id})
  }
})

if(Meteor.isServer) {
  Meteor.publish("videos", function () {
    return Videos.find({})
  });
  Meteor.publish("singleVideo", function (videoId) {
    return Videos.find({_id: videoId})
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
