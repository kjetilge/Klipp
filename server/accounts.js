
Accounts.emailTemplates.siteName = "Klippmagasin";

Accounts.emailTemplates.from = "Klippmagasin <support@klippmagasin.no>";

Accounts.emailTemplates.resetPassword.subject = function (user) {
    return "Nullstill ditt passord";
};

Accounts.emailTemplates.enrollAccount.text = function (user, url) {
   return "You have been selected to participate in building a better future!"
     + " To activate your account, simply click the link below:\n\n"
     + url;
};

Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "Velkomen til Klippmagasin" + user.profile.name;
};
Accounts.emailTemplates.enrollAccount.text = function (user, url) {
   return "Du er nå medlem av Klipp og kan straks se video!"
     + " Klikk på lenken under for å aktivere din konto:\n\n"
     + url;
};

Accounts.emailTemplates.verifyEmail.subject = function (user) {
    return "Velkomen til Klipp";
};
Accounts.emailTemplates.verifyEmail.text = function (user, url) {
   return "Du er nå medlem av Klipp og kan straks se video!"
     + " Klikk lenken under for å aktivere din konto:\n\n"
     + url;
};
