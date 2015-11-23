
Template.nav.rendered = function () {
  console.log("Nav rendered")
  $(".button-collapse").sideNav();
  setTimeout(function(){
     $(".button-collapse").sideNav();
      console.log("Nav rendered")
  }, 500);
};

Template.nav.helpers({
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
