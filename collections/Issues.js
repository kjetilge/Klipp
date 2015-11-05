Issues = new Mongo.Collection("issues")

if(Meteor.isServer) {
  Meteor.publish("issues", function () {
    return Issues.find({})
  });
  Meteor.publish("singleIssue", function (issueId) {
    return Issues.find({_id: issueId})
  })
}
