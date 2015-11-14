App = {
  Utils: {
    isAdmin: function () {
      var user = Meteor.user() || {};
      return Roles.userIsInRole(user._id, ['admin']);
    }
  }
};
