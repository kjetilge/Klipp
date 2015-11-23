Template.registerHelper('isAdmin', function() {
  var user = Meteor.user() || {};
  return Roles.userIsInRole(user._id, ['admin']);
})
/*
Template.registerHelper("issueImage", function () {
  var issue = Issues.findOne({}, {sort: {createdAt: -1, limit: 1}} );
  var issueImage = SplashImages.findOne(issue.splashId);
  if(issueImage && issueImage.url)
    return issueImage.url({store: 'splashImage'})
  else {
    return "images/no-video-found.jpg"
  }
})

Template.registerHelper("currentIssuePath",function () {
  var issue = Issues.findOne({}, {sort: {createdAt: -1, limit: 1}} )
  if(issue && issue._id) {
    console.log(issue)
    console.log("READY!")
    var video = issue.firstVideo();
    var params = {issueId: issue._id, videoId: video._id}
    var path = FlowRouter.path("videoplayer", params)
    console.log(path)
    return path;
  }
  return false;
})
*/
