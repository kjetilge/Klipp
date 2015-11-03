//Set Cache Control headers so we don't overload our meteor server with http requests
FS.HTTP.setHeadersForGet([
    ['Cache-Control', 'public, max-age=31536000']
    ]);

var splashImageMaster = new FS.Store.GridFS("splashImageMaster");

var splashImage = new FS.Store.GridFS("splashImage", {
  beforeWrite: function(fileObj) {
    return {
      extension: 'jpg',
      type: 'image/jpg'
    };
  },
  transformWrite: function(fileObj, readStream, writeStream) {
    gm(readStream).resize(1920).quality(77).stream('JPG').pipe(writeStream);
  }
})

var splashSmall = new FS.Store.GridFS("splashSmall", {
  beforeWrite: function(fileObj) {
    return {
      extension: 'jpg',
      type: 'image/jpg'
    };
  },
  transformWrite: function(fileObj, readStream, writeStream) {
    gm(readStream).resize(250).quality(77).stream('JPG').pipe(writeStream);
  }
})
//******** STARTING EDITING WHEN ALL WORKS **************
SplashImages = new FS.Collection("splashImages", {
    stores: [splashImageMaster, splashImage, splashSmall],
    filter: {
        maxSize: 10485760, //in bytes
        allow: {
            contentTypes: ['image/*'],
            extensions: ['png', 'jpg', 'jpeg', 'gif']
        },
        onInvalid: function (message) {
            if(Meteor.isClient){
                alert(message);
            }else{
                console.warn(message);
            }
        }
    }
});
/*
Chapters.allow({
    insert: function(userId, file) {
        return true;
    },
    update: function(userId, file, fields, modifier) {
        return true;
    },
    remove: function(userId, file) {
        return true;
    },
    download: function() {
        return true;
    }
});
*/

if(Meteor.isServer){
    Meteor.publish('splashImage', function (splashId) {
        return SplashImages.findOne(splashId);
    });
    Meteor.publish('splashImages', function () {
        return SplashImages.find();
    });
} else {
    Meteor.subscribe('splashImage');
    Meteor.subscribe('splashImages');
}
