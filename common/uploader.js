Slingshot.fileRestrictions("myFileUploads", {
  allowedFileTypes: ['video/mp4', 'video/mov'],
  maxSize: null //10 * 1024 * 1024 // 10 MB (use null for unlimited)
});
var uploader = new ReactiveVar();

if (Meteor.isClient) {
  Template.uploader.events(
  { 'click button': function (e, template) {

      var upload = new Slingshot.Upload("myFileUploads");
      file = template.find("#slingshot_upload").files[0];
      if(file) {
        upload.send(file, function (error, downloadUrl) {
          uploader.set();
          if (error) {
            // Log service detailed response
            console.error('Error uploading'); //, uploader.xhr.response);
            alert (error);
          } else {
            var urlParts = downloadUrl.split("/")
            var videoId = urlParts[urlParts.length-2];
            Videos.update(videoId, {$set: {downloadUrl: downloadUrl}})
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

	  key: function (file) {
      var video_id = Videos.insert({filename: file.name})
      return video_id+"/"+file.name;
	  }
	});
}
