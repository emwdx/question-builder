

if (Meteor.isClient) {


$.extend(Kh,KhanUtil);
Meteor.subscribe("users");



  Template.mainContent.helpers({


  connectionStatus:function(){
  return Meteor.status().status;
  },
  connectionClass:function(){
  if(Meteor.status().status =='connected'){
      return "color:limegreen"}
  else if(Meteor.status().status=='connecting'){
       return "color:gray";}
  else{
        return "color:red";
  }
  }

  });

  Template.mainContent.events({

  'click #CreateNew':function(e){

  Session.set('questionMode','Create New');
  Session.set('questionPreview',{text:"Enter the question text here.",answer:"Enter the answer text here."});
  



  }

});



  Template.menuBar.helpers({

      connectionStatus:function(){
  return Meteor.status().status;
  },
  connectionClass:function(){
  if(Meteor.status().status =='connected'){
      return "color:limegreen"}
  else if(Meteor.status().status=='connecting'){
       return "color:gray";}
  else{
        return "color:red";
  }
  }


  });




Template.loggingIn.helpers({

isLoggingIn: Meteor.loggingIn

});

Template.menuBar.events({

'click #navbar-brand':function(){

Router.go('/');

}

})


} //end client check
