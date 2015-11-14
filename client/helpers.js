Template.registerHelper('isAdmin', function() {
  var user = Meteor.user() || {};
  return Roles.userIsInRole(user._id, ['admin']);
})
