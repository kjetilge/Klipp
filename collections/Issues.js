Issues = new Mongo.Collection("issues")

if(Meteor.isServer) {
  Meteor.publish("issues", function () {
    return Issues.find({})
  });
  Meteor.publish("singleIssue", function (issueId) {
    return Issues.find({}, {limit: 1, $natural:-1}) //todo: ensure return of the latest edition
  })
  Meteor.publish("currentIssue", function () {
    return Issues.find({}, {sort: {createdAt: -1, limit: 1}} )
  })

  Meteor.methods({
    removeVideos: (issueId) => {
      var res = Videos.remove({issueId: issueId}); // {multi: true}
      console.log("videos remove res:", res)
    }
  })
}

Issues.after.remove(function (userId, doc) {
  Meteor.call("removeVideos", doc._id)
});

Issues.helpers({
  videos: function () {
    return Videos.find({issueId: this._id})
  },
  firstVideo: function () {
    return Videos.findOne({}, {limit: 1, $natural:-1})
  }
})
