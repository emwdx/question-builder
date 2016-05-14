


 function isAdmin(){

if(Roles.userIsInRoles(this.UserId,'admin')){return true}
else{return false}

 };

  Meteor.startup(function () {

    if(!Meteor.roles.findOne({name: "admin"}))
                          Roles.createRole("admin");



  if(!Meteor.roles.findOne({name: "admin-member"}))
                        Roles.createRole("admin-member");


        if(!Meteor.roles.findOne({name: "member"}))
                        Roles.createRole("member");


    var emw = Meteor.users.findOne({"emails.0.address":'evan@evanweinberg.com'});
    if(emw){

      Roles.addUsersToRoles(emw._id,'admin');

    }

    // code to run on server at startup

    if(Questions.find().count()===0){


 loadStarterQuestions();

    }
  });


Meteor.publish('questions', function(docs) {
  
  if(this.userId){

 if(docs){ return Questions.find(docs);}

else{return Questions.find()}


   }

  else{

    return null};
});



Meteor.publish("users", function () {
  var user = Meteor.users.findOne({_id:this.userId});

  if (Roles.userIsInRole(user, ["admin","admin-member"])) {

    return Meteor.users.find({}, {fields: {emails: 1, profile: 1, roles: 1,username:1}});
  }

  this.stop();
  return;
});

Meteor.publish('systemVariables',function(){

   if(this.userId){

    return systemVariables.find({});

   }
   else{return null};

});







Meteor.users.allow({

update:function(userId,doc){


if(Roles.userIsInRole(userId,'admin')){return true}
else{return false};

},
remove:function(userId,doc){

  if(Roles.userIsInRole(userId,'admin')){return true}
  else{return false};

}



});




Questions.allow({

insert: function(userId){


return Roles.userIsInRole(userId,['admin-member','admin','member']);

},
update: function(userId,doc){

var hasAdminRights = Roles.userIsInRole(userId,['admin-member','admin']);

var docUser = doc.user;
var currUser = Meteor.users.findOne({_id:Meteor.userId()});

return hasAdminRights|(docUser==currUser.username);

},
remove: function(userId,doc){

  var hasAdminRights = Roles.userIsInRole(userId,['admin-member','admin']);

  var docUser = doc.user;
  var currUser = Meteor.users.findOne({_id:Meteor.userId()});

  return hasAdminRights|(docUser==currUser.username);


}

});





Accounts.onCreateUser(function(options, user){
  var role = ['member'];
  console.log(user);
  user.roles = role
  return user;
});

AccountsTemplates.configure({
    reCaptcha: {
        secretKey: "6Lc6IhQTAAAAAC0yrm53h56lNXPFo57roPFifEpo"
    },
});

Meteor.methods({
'usernameFromID':function(id){

var user = Meteor.users.findOne({_id:id});

return user.username;

}


})

function loadStarterQuestions(){
//
  var starterQuestions = [
    {"_id":"5YLEPd2DL3f5ed5m7","vars":[{"name":"a","value":-4,"type":"rand-int","index":1,"options":{"min":-5,"max":5,"exclude":""}},{"name":"b","value":-1,"type":"rand-int","index":2,"options":{"min":-5,"max":5,"exclude":""}},{"name":"c","value":3,"type":"rand-int","index":3,"options":{"min":-5,"max":5,"exclude":""}},{"name":"d","value":-2,"type":"rand-int","index":4,"options":{"min":-5,"max":5,"exclude":""}},{"name":"e","value":2,"type":"rand-int","index":5,"options":{"min":-5,"max":5,"exclude":""}},{"name":"f","value":-4,"type":"rand-int","index":6,"options":{"min":-5,"max":5,"exclude":""}},{"name":"g","value":5,"type":"rand-int","index":7,"options":{"min":-5,"max":5,"exclude":""}},{"name":"h","value":4,"type":"rand-int","index":8,"options":{"min":-5,"max":5,"exclude":""}},{"name":"poly1","value":" -4 x - 1","type":"calc-val","index":9,"options":{},"text":"Kh.cleanMath(\" @a x + @b\")"},{"name":"poly2","value":"3 x^2 - 2","type":"calc-val","index":10,"options":{},"text":"Kh.cleanMath(\"@c x^2 + @d\")"},{"name":"ans1","value":"-12x^3 - 3x^2 + 8x +2","type":"calc-val","index":10,"options":{},"text":"Kh.cleanMath( ( @a * @c)+\"x^3 +\" + (@b * @c)+\"x^2 + \" + (@d * @a)+\"x +\" + (@b * @d) )"},{"name":"poly3","value":" x + 2","type":"calc-val","index":10,"options":{},"text":"Kh.cleanMath( \" x + @e\" )"},{"name":"poly4","value":" x^2 - 4 x + 5","type":"calc-val","index":10,"options":{},"text":"Kh.cleanMath( \" x^2 + @f x + @g\" )"},{"name":"ans2","value":"x^3 - 2x^2 - 3x +10","type":"calc-val","index":10,"options":{},"text":" Kh.cleanMath(\"x^3 +\" + ( @e + @f) + \"x^2 + \" + ( @e * @f + @g ) + \"x +\" + ( @e * @g ))"}],"text":" Simplify each expression completely and express in standard form:\n<ul>\n<li> <eq> ( @poly1) ( @poly2 ) </eq></li>\n<li> <eq> (@poly3 ) (@poly4) </eq> </li>\n\n</ul> \n ","answer":" <ul>\n<li> <eq> @ans1 </eq></li> \n<li> <eq> @ans2 </eq></li>\n</ul> ",user:"emwdx",created:new Date(),public:true},
    {"_id":"EfcusHQqgYKhcsnsb","vars":[{"name":"a","value":-3,"type":"rand-int","index":1,"options":{"min":-10,"max":10,"exclude":"-1,0,1"}},{"name":"b","value":-2,"type":"rand-int","index":2,"options":{"min":-10,"max":10,"exclude":"-1,0,1"}},{"name":"c","value":-8,"type":"rand-int","index":3,"options":{"min":-10,"max":10,"exclude":""}},{"name":"d","value":8,"type":"rand-int","index":4,"options":{"min":-10,"max":10,"exclude":"-1,0,1"}},{"name":"e","value":-4,"type":"rand-int","index":5,"options":{"min":-10,"max":10,"exclude":"-1,0,1"}},{"name":"f","value":-10,"type":"rand-int","index":6,"options":{"min":-10,"max":10,"exclude":""}},{"name":"poly1","value":" -3 x^2 - 2 x - 8 ","type":"calc-val","index":7,"options":{},"text":"Kh.cleanMath(\" @a x^2 + @b x + @c \")"},{"name":"poly2","value":" -3 x^2 - 2 x - 8 ","type":"calc-val","index":8,"options":{},"text":"Kh.cleanMath(\" @a x^2 + @b x + @c \")"},{"name":"ans1","value":"11x^2 - 2x - 2","type":"calc-val","index":9,"options":{},"text":"Kh.cleanMath( ( @d - @a) + \"x^2 + \" + ( @e - @b) + \"x + \" + (@f - @c) )"}],"text":" Subtract <eq> @poly1</eq> from <eq> @poly2</eq> and simplify completely. ","answer":" <eq> @ans1 </eq> ",user:"emwdx",created:new Date(),public:true},
    {"_id":"Engy5JR8e5279vrFt","vars":[{"name":"a","value":5,"type":"rand-int","index":1,"options":{"min":-10,"max":10,"exclude":""}},{"name":"b","value":-8,"type":"rand-int","index":2,"options":{"min":-10,"max":10,"exclude":""}},{"name":"c","value":2,"type":"calc-val","index":3,"options":{},"text":"Kh.randFromArray([2,3,5,7])"},{"name":"d","value":7,"type":"rand-int","index":4,"options":{"min":-10,"max":10,"exclude":""}},{"name":"e","value":-1,"type":"rand-int","index":5,"options":{"min":-10,"max":10,"exclude":""}},{"name":"poly1","value":"x^2 - 3 x - 40","type":"calc-val","index":6,"options":{},"text":"Kh.cleanMath(\"x^2 + \" + (@a + @b) + \" x + \" + ( @a * @b))"},{"name":"poly2","value":"2 x^2 + 5 x - 7","type":"calc-val","index":7,"options":{},"text":"Kh.cleanMath(\"@c x^2 + \" + (@c*@e + @d) + \" x + \" + ( @d * @e))"},{"name":"ans1","value":" (x + 5)(x- 8)","type":"calc-val","index":8,"options":{},"text":"Kh.cleanMath(\" (x + @a)(x+ @b)\")"},{"name":"ans2","value":" ( 2 x + 7)( x- 1)","type":"calc-val","index":9,"options":{},"text":"Kh.cleanMath(\" ( @c x + @d)( x+ @e)\")"}],"text":" Write the following in completely factored form:\n<ul>\n<li> <eq> @poly1 </eq></li>\n<li> <eq> @poly2 </eq></li>\n</ul> \n ","answer":" <ul>\n<li> <eq> @ans1 </eq> </li>\n<li> <eq> @ans2 </eq> </li>\n</ul> ",user:"emwdx",created:new Date(),public:true},
    {"_id":"b6GmsbxmMyvn9Moqz","vars":[{"name":"var1","value":35,"type":"rand-int","index":1,"options":{"min":-100,"max":100,"exclude":""}},{"name":"var2","value":63,"type":"rand-int","index":2,"options":{"min":-100,"max":100,"exclude":""}},{"name":"sum","value":98,"type":"calc-val","index":3,"options":{},"text":"@var1 + @var2"},{"name":"product","value":2205,"type":"calc-val","index":4,"options":{},"text":"@var1 * @var2"}],"text":" The sum of two numbers <eq>x</eq> and <eq>y</eq> is @sum and the product is @product. Write two equations that would be used to solve for the values of <eq> x</eq> and <eq>y</eq>, and then solve the system algebraically to find the numbers. ","answer":" \n<eq> x + y = @sum </eq><br>\n<eq> x \\cdot y = @product </eq>\n <p></p>\nThe numbers are @var1 and @var2 .",user:"emwdx",created:new Date(),public:true},
    {"_id":"eKpfvwT2MPfbByLPs","vars":[{"name":"a","value":8,"type":"rand-int","index":1,"options":{"min":2,"max":8,"exclude":""}},{"name":"b","value":4,"type":"rand-int","index":2,"options":{"min":1,"max":4,"exclude":""}},{"name":"base","value":5,"type":"calc-val","index":3,"options":{},"text":"Kh.randFromArray([2,3,5])"},{"name":"c","value":625,"type":"calc-val","index":4,"options":{},"text":"Math.pow( @base, @b )"},{"name":"d","value":4,"type":"rand-int","index":5,"options":{"min":1,"max":4,"exclude":""}},{"name":"ans","value":-8,"type":"calc-val","index":6,"options":{},"text":"@b - (@a + @d)"}],"text":" Write <eq>\\frac{@c }{ @base ^{ @a} \\cdot @base ^ { @d } } </eq> as a single power of @base . ","answer":" <eq> @base ^ { @ans }</eq>\n",user:"emwdx",created:new Date(),public:true},
    {"_id":"jzFCjCyMfiSmuTtTs","vars":[{"name":"exp1","value":3,"type":"rand-int","index":1,"options":{"min":2,"max":4,"exclude":""}},{"name":"exp2","value":6,"type":"rand-int","index":2,"options":{"min":4,"max":10,"exclude":""}},{"name":"coef1","value":9,"type":"rand-int","index":3,"options":{"min":3,"max":9,"exclude":""}},{"name":"term2","value":5,"type":"rand-int","index":4,"options":{"min":-10,"max":10,"exclude":"0"},"text":"Kh.cleanMath( \"+\" + @term2)"},{"name":"selectedTerm","value":6,"type":"calc-val","index":5,"options":{},"text":"Kh.randRange(1, @exp2)"},{"name":"selectedPower","value":3,"type":"calc-val","index":6,"options":{},"text":" (@exp2 - (@selectedTerm-1)) * @exp1"},{"name":"power1","value":1,"type":"calc-val","index":7,"options":{},"text":"(@exp2 - (@selectedTerm-1))"},{"name":"power2","value":5,"type":"calc-val","index":8,"options":{},"text":"@selectedTerm - 1 "},{"name":"binCoeff","value":6,"type":"calc-val","index":9,"options":{},"text":" Kh.choose( @exp2 , (@selectedTerm - 1))"},{"name":"finalCoef","value":168750,"type":"calc-val","index":10,"options":{},"text":"( @binCoeff ) * Math.pow( @coef1 , (@exp2 - (@selectedTerm-1)) )* Math.pow ( @term2,@selectedTerm - 1 ) "},{"name":"cleanTerm2","value":"+5","type":"calc-val","index":10,"options":{},"text":"Kh.cleanMath( \"+\" + @term2)"}],"text":" Find the coefficient of the term containing <eq> x^ { @selectedPower} </eq> in <eq>( @coef1 x^{ @exp1} @cleanTerm2 )^{ @exp2 } </eq>.\n ","answer":" This is term # @selectedTerm of the expansion: <eq> @binCoeff \\cdot ( @coef1 x ^{ @exp1 })^{ @power1 } ( @term2 )^{ @power2 } </eq>, coefficient is @finalCoef . ",user:"emwdx",created:new Date(),public:true},
    {"_id":"miNi7HZ5EHs8DmuaJ","vars":[{"name":"sign","value":"positive","type":"calc-val","index":1,"options":{},"text":"Kh.randFromArray([\"positive\",\"negative\"])"},{"name":"magQ","value":4,"type":"rand-int","index":2,"options":{"min":1,"max":10,"exclude":""}},{"name":"strB","value":8,"type":"rand-int","index":3,"options":{"min":1,"max":10,"exclude":""}},{"name":"directionB","value":"into","type":"calc-val","index":4,"options":{},"text":"Kh.randFromArray([\"into\",\"out of\"])"},{"name":"speed","value":"4.04","type":"rand-dec","index":5,"options":{"min":1,"max":10,"DP":2}},{"name":"directionV","value":"right","type":"calc-val","index":6,"options":{},"text":"Kh.randFromArray([\"top\",\"right\",\"bottom\",\"left\"])"},{"name":"particleMass","value":"3.41","type":"rand-dec","index":7,"options":{"min":1,"max":10,"DP":2}},{"name":"ansDir","value":"top","type":"customJS","index":8,"options":{},"text":" \n\n \n (function(){\n\n\nvar dirIndex =[\"top\",\"right\",\"bottom\",\"left\"].indexOf(\"@directionV\");\nvar fDirections = [\"left\",\"top\",\"right\",\"bottom\"]\nvar n;\nif(\"@sign\"==\"positive\"){\nn = dirIndex;\n\n}\nelse{\nn = (2+dirIndex)%4;\n}\nreturn fDirections[n]\n\n\n })()\n "},{"name":"ansMag","value":"5.17\\times 10^{-29}","type":"calc-val","index":9,"options":{},"text":"Kh.scientific(3, (1.6E-19)*( @speed *1E4 ) * ( @strB) *(1E-15))"},{"name":"rotDir","value":"counter-clockwise","type":"customJS","index":10,"options":{},"text":" \n\n \n (function(){\n\n\n if(\"@sign\"===\"positive\"){\nvar signQ = 1;\n}\nelse{\nvar signQ = -1\n}\n\nif(\"@directionB\"===\"into\"){\nvar signB = 1;\n}\nelse{\nvar signB = -1;\n}\nvar ansSign = signQ*signB;\nif(ansSign===1){\nreturn \"counter-clockwise\"\n}\nelse{\nreturn \"clockwise\"\n}\n \n\n\n })()\n "}],"text":" A @sign charge of magnitude <eq> @magQ e </eq> travels into a magnetic field of strength @strB T directed @directionB the screen. The particle has a velocity of <eq> @speed \\times 10^4 </eq>​ m/s toward the @directionV of the screen, and has a mass of <eq> @particleMass \\times 10^{-20} </eq> kilograms.\n<ul>\n<li>Determine the magnitude and direction of the force on the charge.</li>\n<li>Will the particle travel counter-clockwise or clockwise in a circular path?</li>\n</ul>\n ","answer":" <li> Direction is to the @ansDir of the screen, magnitude is <eq> @ansMag N </eq></li>\n<li>Particle will travel @rotDir around a circular path.</li> ",user:"emwdx",created:new Date(),public:true},
    {"_id":"pnzfSYKQ3ix8An2pq","vars":[{"name":"a","value":10,"type":"rand-int","index":1,"options":{"min":-10,"max":10,"exclude":"0"}},{"name":"b","value":7,"type":"rand-int","index":2,"options":{"min":-10,"max":10,"exclude":"0"}},{"name":"c","value":4,"type":"rand-int","index":3,"options":{"min":-10,"max":10,"exclude":"0"}},{"name":"d","value":10,"type":"rand-int","index":4,"options":{"min":-10,"max":10,"exclude":"0"}},{"name":"point1Name","value":"G","type":"calc-val","index":5,"options":{},"text":"Kh.randFromArray(['A','C','E','G','I'])"},{"name":"point2Name","value":"F","type":"calc-val","index":6,"options":{},"text":"Kh.randFromArray(['B','D','F','H'])"},{"name":"lengthCalc","value":45,"type":"calc-val","index":7,"options":{},"text":"Math.pow((@c - @a),2) + Math.pow((@d - @b),2) "},{"name":"midpoint","value":"(7,8.5)","type":"calc-val","index":8,"options":{},"text":"\"(\"+0.5*(@a+@c)+\",\"+0.5*(@b+@d) + \")\""},{"name":"slope","value":"\\frac{3}{-6} = -\\dfrac{1}{2}","type":"calc-val","index":9,"options":{},"text":" Kh.fractionSimplification((@d - @b),(@c - @a)) "}],"text":" Line segment <eq> @point1Name @point2Name </eq> has endpoints at <eq>@point1Name = (@a,@b)</eq> and <eq>@point2Name = (@c,@d)</eq>.\n<p>\n<ul>\n<li>Find the coordinates of the midpoint of the line segment.</li>\n<li>Find the slope of the line segment as a simplified fraction.</li>\n<li>Find the exact length of the line segment, and express the result to three decimal places.</li>\n</ul> ","answer":" midpoint of @midpoint, slope of <eq> @slope </eq>, length of <eq>\\sqrt{@lengthCalc} ",user:"emwdx",created:new Date(),public:true},
    {"_id":"sBFvj5MB62rK9qewt","vars":[{"name":"var1","value":46,"type":"rand-int","index":1,"options":{"min":-100,"max":100,"exclude":""}},{"name":"var2","value":-84,"type":"rand-int","index":2,"options":{"min":-100,"max":100,"exclude":""}},{"name":"sum","value":-38,"type":"calc-val","index":3,"options":{},"text":"@var1 + @var2"},{"name":"difference","value":130,"type":"calc-val","index":4,"options":{},"text":"@var1 - @var2"}],"text":" The sum of two numbers is @sum and the difference is @difference. Find the two numbers. ","answer":" The numbers are @var1 and @var2. ",user:"emwdx",created:new Date(),public:true},
    {"_id":"uNJ22NcM5uTsL5vwH","vars":[{"name":"a","value":-1,"type":"rand-int","index":1,"options":{"min":-2,"max":6,"exclude":""}},{"name":"b","value":2,"type":"rand-int","index":2,"options":{"min":-2,"max":6,"exclude":""}},{"name":"c","value":2,"type":"rand-int","index":3,"options":{"min":-2,"max":6,"exclude":""}},{"name":"d","value":5,"type":"rand-int","index":4,"options":{"min":-2,"max":6,"exclude":""}},{"name":"isEqual","value":true,"type":"calc-val","index":5,"options":{},"text":"Kh.randFromArray([true,false])"},{"name":"e","value":5,"type":"customJS","index":6,"options":{},"text":" \n \n\n \n (function(){\n\n\nvar res = ( @a * @b + @c + -1* @d * @a);\n\nif( @isEqual ){\n\nreturn res;\n\n}\nelse{\n\nreturn Kh.randRangeExclude(-10,10,[ res ]);\n\n}\n\n\n\n\n })()\n \n \n \n\n \n "},{"name":"exp1","value":"2 x + 2","type":"calc-val","index":7,"options":{},"text":"Kh.cleanMath( \"@b x + @c\" )"},{"name":"exp2","value":"5 x + 5","type":"calc-val","index":8,"options":{},"text":"Kh.cleanMath( \"@d x + @e\" )"}],"text":" \n \n The function <eq> f(x) </eq> is defined by <eq> f(x) = @exp1 </eq> for <eq> x \\leq @a </eq> and <eq> f(x) = @exp2 </eq> for <eq> x > @a </eq>.\n<ul>\n\n<li>Evaluate <eq> \\lim_{x \\to @a ^{+}} {f(x)} </eq> and <eq> \\lim_{x \\to @a ^{-}}{f(x)}</eq></li>\n<li>Does <eq> \\lim_{x \\to @a } {f(x)} </eq> exist? Explain your answer. </li>\n</ul> ","answer":" @isEqual",user:"emwdx",created:new Date(),public:true},
    {"_id":"uh8PQAaXvLt4QHQdC","vars":[{"name":"a","value":3,"type":"rand-int","index":1,"options":{"min":-10,"max":10,"exclude":""}},{"name":"b","value":5,"type":"rand-int","index":2,"options":{"min":-10,"max":10,"exclude":""}},{"name":"c","value":7,"type":"rand-int","index":3,"options":{"min":2,"max":10,"exclude":""}},{"name":"d","value":10,"type":"rand-int","index":4,"options":{"min":2,"max":10,"exclude":""}},{"name":"cleanLimit","value":" - 5","type":"calc-val","index":5,"options":{},"text":"Kh.cleanMath(\" - @b\") "},{"name":"poly1","value":"x^2 +2x - 15","type":"calc-val","index":6,"options":{},"text":"Kh.cleanMath( \"x^2 +\" + ( @b - @a ) + \"x + \" + (-1 * @a * @b) )"},{"name":"poly2","value":"x - 3","type":"calc-val","index":7,"options":{},"text":"Kh.cleanMath( \"x - @a\" )"},{"name":"ans1","value":8,"type":"calc-val","index":8,"options":{},"text":" @b + @a "},{"name":"ans2","value":"\\frac{7}{10}","type":"calc-val","index":9,"options":{},"text":"Kh.fractionSimplification( @c, @d )"}],"text":" Evaluate each limit below using any method. \n<ul>\n<li> <eq> \\lim _{x \\to @a } \\frac{ @poly1 }{ @poly2 }</eq> </li>\n<li><eq> \\lim_{x \\to 0} \\frac{ sin ( @c x)}{ @d x }</eq></li>\n</ul> ","answer":" <ul>\n<li> @ans1 </li>\n<li> <eq> @ans2 </eq> </li>\n</ul> ",user:"emwdx",created:new Date(),public:true}












  ]
  starterQuestions.forEach(function(q){

  Questions.insert(q);

  })



}

ownsDocument = function(userId, doc) { return doc && doc.userId === userId;
}
