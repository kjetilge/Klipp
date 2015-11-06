Template.home.helpers({
  'currentIssue': function () {
    return Issues.findOne();
  }
})

Template.home.events({
  'click button.first-issue': function () {
    console.log("First issue")
    var issueId = Issues.insert({title: "første utgave", subtitle: "mye moro"})
    var videoId = Videos.insert({title: "firste video", issueId: issueId});
    var params = {issueId: issueId, videoId: videoId}
    var path = FlowRouter.path("blogPostRoute", params);
    FlowRouter.go("videoplayer", params)
  }
})

Template.home.onCreated(function(){
  Meteor.subscribe('singleIssue')
})
