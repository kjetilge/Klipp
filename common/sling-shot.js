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
      console.log("FILE:", file)
      var engString = removeNorwegian(file.name);
      console.log("engString", engString);
      file.name = engString.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      Videos.update(vidObject.videoId, {$set: {fileName: file.name}})
      return vidObject.videoId+"/"+file.name;
	  }
	});
}

var removeNorwegian = function (str) {
     var ret = str;
     ret = ret.replace( /ø/g, 'oe' );
     ret = ret.replace( /Ø/g, 'OE' );
     ret = ret.replace( /å/g, 'aa' );
     ret = ret.replace( /Å/g, 'AA' );
     ret = ret.replace( /æ/g, 'ae' );
     ret = ret.replace( /Æ/g, 'AE' );
     ret = ret.replace( /\_/g, '-' );

     ret = ret.replace(/[^a-zA-Z0-9\/-]/ig,'-').replace(/_+/ig,'-').replace(/[-]{2,}/g, '-').toLowerCase();
     return ret;
}
