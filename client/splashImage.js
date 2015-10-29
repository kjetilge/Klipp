Template.splashImage.helpers({
	splash: function () {
		var splash = SplashImages.findOne();
		console.log(splash)
		return splash;
	}
})
