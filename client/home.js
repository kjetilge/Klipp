Template.home.helpers({
  currentIssue: function () {
    var issue = Issues.findOne({}, {sort: {createdAt: -1, limit: 1}} );
    return issue;
  },
  issueImage: function () {
    var issue = Issues.findOne({}, {sort: {createdAt: -1, limit: 1}} );
    var issueImage = SplashImages.findOne(issue.splashId);
    if(issueImage && issueImage.url)
      return issueImage.url({store: 'splashImage'})
  },
  currentIssuePath: function () {
    var issue = Issues.findOne({}, {sort: {createdAt: -1, limit: 1}} )
    if(issue && issue._id) {
      console.log(issue)
      console.log("READY!")
      var video = issue.firstVideo();
      var params = {issueId: issue._id, videoId: video._id}
      var path = FlowRouter.path("videoplayer", params)
      console.log(path)
      return path;
    } else {
      return false;
    }

  }
})

Template.home.events({
  'click button.first-issue': function () {
    console.log("First issue")
    var date = new Date();
    var issueId = Issues.insert({title: "første utgave", subtitle: "mye moro", published: false, createdAt: date})
    var videoId = Videos.insert({title: "første video", issueId: issueId, published: false, createdAt: date});
    var params = {issueId: issueId, videoId: videoId}
    var path = FlowRouter.path("blogPostRoute", params);
    FlowRouter.go("videoplayer", params)
  }
})

Template.home.onCreated(function(){
  this.subscribe('currentIssue');
  this.subscribe("singleVideo");
})
