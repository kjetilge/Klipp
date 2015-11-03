//Set Cache Control headers so we don't overload our meteor server with http requests
FS.HTTP.setHeadersForGet([
    ['Cache-Control', 'public, max-age=31536000']
    ]);

var chapterImageMaster = new FS.Store.GridFS("chapterImageMaster");

var chapterImage = new FS.Store.GridFS("chapterImage", {
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
Chapters = new FS.Collection("chapters", {
    stores: [chapterImageMaster, chapterImage],
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

if(Meteor.isServer){
    Meteor.publish('chapters', function () {
        return Chapters.find();
    });
}else{
    Meteor.subscribe('chapters');
}
