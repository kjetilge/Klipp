Slingshot.fileRestrictions("videoUploads", {
  allowedFileTypes: ['video/mp4'],
  maxSize: null //10 * 1024 * 1024 // 10 MB (use null for unlimited)
});

if (Meteor.isServer) {
	Slingshot.createDirective("videoUploads", Slingshot.S3Storage, {
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
      Videos.update(vidObject.videoId, {$set: {fileName: file.name}})
      return vidObject.videoId+"/"+file.name;
	  }
	});
}





if (Meteor.isClient) {
  /*
  Template.uploader.events({
    'click button.upload': function (e, template) {
      var videoId = getParam('videoId');
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
              Session.set("uploadFile", null);
              var splashTime = Session.get("splashTime");
              var time = '1.10';
              if(splashTime) {
                time = splashTime;
                Session.set(null);
              }
              splashId = Meteor.call('makeSplash', downloadUrl, time, (err, res) => {
              Videos.update(VID, {$set: {downloadUrl: downloadUrl, splashId: res._id}})
            });
          }
        });
      }
      uploader.set(upload);
    },
    'click button.cancel': function () {
      uploader.xhr.abort();
    }
  });

  Template.progressBar.helpers({
      isUploading: function () {
        var uploading = Boolean(uploader.get())
        Session.set('videoLoaded', !uploading); //don't show "start upload" while uploading
        Session.set("isUploading", uploading)
        return uploading;
      },

      progress: function () {
          var upload = uploader.get();
          if (upload)
              return Math.round(upload.progress() * 100) || 0 ;
      }
  });
*/
}
