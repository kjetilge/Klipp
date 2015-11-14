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
