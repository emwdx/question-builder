


AccountsTemplates.configure({
    // Behaviour
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: false,
    lowercaseUsername: true,

    // Appearance
    showAddRemoveServices: false,
    //showForgotPasswordLink: true,
    //showLabels: true,
    showPlaceholders: true,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    //privacyUrl: 'privacy',

    // Redirects
    //homeRoutePath: '/list-all-questions/',
    redirectTimeout: 8000,



    // Texts
    texts: {
      button: {
          signUp: "Register Now!"
      },
      socialSignUp: "Create an account",
      socialIcons: {
          "meteor-developer": "fa fa-rocket"
      },
      title: {
          forgotPwd: "Recover Your Password",
          //signUp: "Please create an account to register for Question-Builder:",
          //signIn:"Please sign in to continue:"
      },
    },
    reCaptcha: {
        siteKey: "6Lc6IhQTAAAAACeWR5V_MIp2-e480vWt0RRXXMZJ",
        theme: "light",
        data_type: "image"
    },
    showReCaptcha: true,
    defaultLayout: 'mainContent'

});


var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
      _id: "username",
      type: "text",
      displayName: "username",
      required: true,
      minLength: 5,
  },

  {
      _id: 'email',
      type: 'email',
      required: true,
      displayName: "email",
      re: /.+@(.+){2,}\.(.+){2,}/,
      errStr: 'Invalid email',
  },
  pwd
]);

AccountsTemplates.configureRoute('signUp', {
    name: 'signUp',
    template:'registerAccount',
    path:'/sign-up/',
    redirect: '/list-all-questions/'
});

Router.plugin('ensureSignedIn', {
    except: ['defaultPage', 'atSignIn', 'atSignUp', 'atForgotPassword','registerAccount']
});
