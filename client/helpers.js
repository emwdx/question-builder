Meteor.subscribe('users',{});


//Meteor.subscribe('questions');
UI.registerHelper('isAdmin',function(){

 if(Meteor.user()){
  var inRole = Roles.userIsInRole(Meteor.user()._id,['admin']);

  return inRole;
}
return null;

});

UI.registerHelper('isAdminMember',function(){

if(Template.instance().subscriptionsReady()){

var inRole = Roles.userIsInRole(Meteor.user()._id,['admin','admin-member']);

return inRole;
}
});


UI.registerHelper("selectedIf",function(value1,value2){
  return (value1==value2)?"selected":"";
});

UI.registerHelper("isEqual",function(value1,value2){
  return (value1==value2);
});




getNames = function(coll,prop){

  var names = [];
  namesFound = coll.find();
  namesFound.forEach(function(e){
  if(!_.contains(names,e[prop])){
    names.push(e[prop]);

  }

});

return names.sort();

}

UI.registerHelper('shortenDate',function(date){

var dateArray = new Date(date).toDateString().split(" ");
return (dateArray[1]+ ' ' + dateArray[2])


})



UI.registerHelper('getDate',function(date){

return date.toISOString().split('T')[0];

})

UI.registerHelper('getUsername',function(userID){

return Meteor.users.findOne({_id:userID}).profile.realName;

})
