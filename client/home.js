Template.home.helpers({
  'currentIssue': function () {
    return Issues.findOne();
  }
})

Template.home.events({
  'click button.first-issue': function () {
    console.log("First issue")
    var date = new Date();
    var issueId = Issues.insert({title: "første utgave", subtitle: "mye moro", published: false, createdAt: date})
    var videoId = Videos.insert({title: "firste video", issueId: issueId, published: false, createdAt: date});
    var params = {issueId: issueId, videoId: videoId}
    var path = FlowRouter.path("blogPostRoute", params);
    FlowRouter.go("videoplayer", params)
  }
})

Template.home.onCreated(function(){
  Meteor.subscribe('singleIssue')
})
