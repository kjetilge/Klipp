Videos = new Mongo.Collection("videos")
/*
if(Meteor.isServer) {
  Meteor.publish("videos", function () {
    return Videos.find({})
  });

  Meteor.startup(function () {
    if( Videos.find().count() === 0) {
      var videoRange = Array.from(Array(11).keys())
      for (var v of videoRange) {
        console.log("Inserting", v)
        //Videos.insert( {fileName: "v" + v + ".mp4"} )
        Videos.insert( {fileName: "test"} )
      }
      // for (var v of videoRange) {console.log("v"+v+".mp4")}
    }
  })
}*/
