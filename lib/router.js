FlowRouter.route('/utgave/:issueId/kurs/:videoId', {
    action: function(params, queryParams) {
      console.log("Query Params:", queryParams);
      Session.set("uploadFile", null);
      var video = $("#video")[0];
      if(video) {
        var time = FlowRouter.getQueryParam('time')
        var time = Number(FlowRouter.getQueryParam('time'))
        if(time)
          video.currentTime = parseFloat(time);
      }
      BlazeLayout.render('player', {
        videoArea: "html5Player",
        toolbarArea: "toolbar",
        chaptersArea: "chapters",
        videoNavArea: "videoNav",
        issueNavArea: "issueNav",
        contentNavArea: "contentNav"
      });
    },
    name: "videoplayer" // optional
});
FlowRouter.route('/video-ikke-funnet', {
    action: function() {
      BlazeLayout.render('videoNotFound');
    }
  });

FlowRouter.route('/', {
    action: function() {
      console.log("Home :-)")
      BlazeLayout.render('masterLayout', {
        footer: "footer",
        main: "home",
        nav: "nav",
      });
    },
    name: "home"
  });

FlowRouter.notFound = {
  action: function() {
    BlazeLayout.render('masterLayout', {
      footer: "footer",
      main: "pageNotFound",
      nav: "nav",
    });
  }
};

//Account Routes
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');
/*
Action	route_code	Route Name	Route Path	Template	Redirect after Timeout
change password	changePwd	atChangePwd	/change-password	fullPageAtForm
enroll account	enrollAccount	atEnrollAccount	/enroll-account	fullPageAtForm	X
forgot password	forgotPwd	atForgotPwd	/forgot-password	fullPageAtForm	X
reset password	resetPwd	atResetPwd	/reset-password	fullPageAtForm	X
sign in	signIn	atSignIn	/sign-in	fullPageAtForm
sign up	signUp	atSignUp	/sign-up	fullPageAtForm
verify email	verifyEmail	atVerifyEmail	/verify-email	fullPageAtForm	X
resend verification email	resendVerificationEmail	atresendVerificationEmail	/send-again	fullPageAtForm

*/
