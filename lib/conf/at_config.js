// Options

AccountsTemplates.configure({
  defaultLayout: 'masterLayout',
  defaultLayoutRegions: {
    nav: 'nav',
    footer: 'footer',
  },
  defaultContentRegion: 'main',
  showForgotPasswordLink: true,
  overrideLoginErrors: true,
  enablePasswordChange: true,

  sendVerificationEmail: true,
  enforceEmailVerification: true,
  overrideLoginErrors: false, //Asks to show a general Login Forbidden on a login failure
  //confirmPassword: true,
  //continuousValidation: false,
  //displayFormLabels: true,
  //forbidClientAccountCreation: true,
  //formValidationFeedback: true,
  //homeRoutePath: '/',
  //showAddRemoveServices: false,
  //showPlaceholders: true,

  negativeValidation: true,
  positiveValidation: true,
  negativeFeedback: false,
  positiveFeedback: true,

  // Privacy Policy and Terms of Use
  //privacyUrl: 'privacy',
  //termsUrl: 'terms-of-use',

  texts: {
      info: {
          signUpVerifyEmail: "Registreringen var vellykket! Vennligst sjekk din epost og følg veiledning.",
          verificationEmailSent: "En ny epost har blitt sendt til deg. Hvis eposten ikke viser seg i innboksen din, sjekk søppelpost-mappen"
      }
  }
});
