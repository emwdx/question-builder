 Router.configure({ layoutTemplate: 'mainContent',loadingTemplate:'loading'  });

  Router.map(function() {

      this.route('defaultPage', {path: '/'});

      this.route('adminTemplate',{path:'/admin/'});

      this.route('questionAdd', {
        template:'questionAdd',
          path: '/questions/edit/:id/',
          data: function() { return  Questions.findOne({_id:this.params.id}); },
          onBeforeAction: function() {
         Session.set('selectedQuestion', this.params.id);
         
         this.next();
         }

      });


    this.route('listQuestions',{path:'/list-all-questions/'});
    this.route('listMyQuestions',{path:'/list-my-questions/'});
    this.route('desmos',{path:'/desmos/'});
    this.route('registerAccount',{path:'/register/'});

  });
//Router.onBeforeAction(requireAdmin, {only:['adminTemplate']});
//Router.onBeforeAction(requireLoggedIn, {except:['defaultPage','registerAccount']});

function requireAdmin(){
var currentUser = Meteor.user();
if (!currentUser) {

    Session.set('currentURL',Router.current().path);
    if (Meteor.loggingIn()){            this.render(this.loadingTemplate);
}

}
else{

var allowed = Roles.userIsInRole(currentUser,['admin','admin-member']);

if(!allowed){
    alert("You are not permitted to access that page.")
    Router.go('/');
    }
this.next()


};

}

function requireLoggedIn(){
var currentUser = Meteor.user();
if (!currentUser) {

    Router.go('/sign-up/')
}

this.next()

}
