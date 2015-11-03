Slingshot.fileRestrictions("myFileUploads", {
  allowedFileTypes: ['video/mp4', 'video/mov'],
  maxSize: null //10 * 1024 * 1024 // 10 MB (use null for unlimited)
});
var uploader = new ReactiveVar();

if (Meteor.isClient) {
  Template.uploader.events(
  { 'click button': function (e, template) {
      var videoId = FlowRouter.getQueryParam('videoId');
      VID = videoId;
      var upload = new Slingshot.Upload("myFileUploads", {videoId: videoId}); //videoId ADD meta-context

      file = template.find("#slingshot_upload").files[0];
      if(file) {
        upload.send(file, function (error, downloadUrl) {
          uploader.set();
          if (error) {
            // Log service detailed response
            console.error('Error uploading'); //, uploader.xhr.response);
            alert (error);
          } else {
            splashId = Meteor.call('makeSplash', downloadUrl, '1.10', (err, res) => {
              console.log("splashId",res);
              //var urlParts = downloadUrl.split("/")
              //var videoId = urlParts[urlParts.length-2];
              Videos.update(VID, {$set: {downloadUrl: downloadUrl, splashId: res._id}})
            });
          }
        });
      }
      uploader.set(upload);
    }
  });

  Template.progressBar.helpers({
      isUploading: function () {
          return Boolean(uploader.get());
      },

      progress: function () {
          var upload = uploader.get();
          if (upload)
              return Math.round(upload.progress() * 100) || 0 ;
      }
  });

}
if (Meteor.isServer) {
	Slingshot.createDirective("myFileUploads", Slingshot.S3Storage, {
	  bucket: Meteor.settings.AWSBucket,
	  region: Meteor.settings.AWSRegion,
	  acl: "public-read",

	  authorize: function () {
	    return true;
	    //Deny uploads if user is not logged in.
	    if (!this.userId) {
	      var message = "Please login before posting files";
	      throw new Meteor.Error("Login Required", message);
	    }
	  },

	  key: function (file, vidObject) {
      //var video_id = Videos.insert({filename: file.name})
      return vidObject.videoId+"/"+file.name;
      //return file.name;
	  }
	});
}
