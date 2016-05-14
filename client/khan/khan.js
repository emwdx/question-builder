
//Universal QB Code goes here
Template.questionAdd.events({
'click #submitQuestion':function(e,t){

e.preventDefault();

var currentQuestionObject={
answer: t.$('#questionAnswer').val(),
text: t.$('#questionText').val(),
};

var variables = Session.get('mqQuestionVars');

var testingVars = variables;

testingVars = processVariables(testingVars);
if(!(testingVars=='code-error')){

var questionObject={
vars: variables,
text: currentQuestionObject.text,
answer: currentQuestionObject.answer,
public: $('#shareQuestion').is(":checked"),
title: $('#addQuestionTitle').val()
};
console.log(questionObject);

var currentQuestionID = Session.get('currentQuestion');
var questionMode = Session.get('questionMode');

var retrievedQ = Questions.findOne({_id:currentQuestionID});

if(questionMode=='Edit'){
questionObject['lastEdited']=new Date();
Questions.update({_id:currentQuestionID},{$set:questionObject},function(error,result){

if(result){
alert("Successfully edited question!");
Router.go('/list-my-questions/');
Session.set('questionPreview',null);
}

});

}
else if(questionMode=='Create New'){
  questionObject['created']=new Date();
  questionObject['user']=Meteor.user().username;
Questions.insert(questionObject,function(error,result){

if(result){
  alert("Successfully added question!");
Router.go('/list-my-questions/');
Session.set('questionPreview',null);

};

});

}

else if(questionMode =='Copy'){
  questionObject['created']=new Date();
  questionObject['user']=Meteor.user().username;
  Questions.insert(questionObject,function(error,result){

  if(result){
    alert("Successfully copied Question!");
  Router.go('/list-my-questions/');
  Session.set('questionPreview',null);

  };

  });


}
}
else{alert("Please check your calculated values or custom code for errors.")}

},


'keypress #questionAnswer, keypress #questionText':function(e,t){


  var questionObject={
  answer: t.$('#questionAnswer').val(),
  text: t.$('#questionText').val(),
  };

  if(questionObject.answer!=''&&questionObject.text!=''){
Session.set('questionPreview',questionObject);

  }
  else{

 Session.set('questionPreview',{answer:"",text:""});

  }

renderEquations(t);

},

'click #addVar':function(e){
e.preventDefault();
var vars = Session.get('mqQuestionVars');
var names = _.pluck(vars,'name');
if(_.contains(names,("var"+vars.length))){
  var newName = "var"+(vars.length+1);
}
else{

  var newName = "var"+vars.length;
}
var newIndex = vars.length+1;
vars.push({name:newName,value:null,type:'rand-int',index:newIndex,options:{min: -10, max: 10, exclude: ""}});
Session.set('mqQuestionVars',vars);

},

'click #processVariables':function(e,t){
e.preventDefault();

vars = Session.get('mqQuestionVars');

var testingVars = vars;

testingVars = processVariables(testingVars);
if(!(testingVars=='code-error')){


vars = processVariables(vars);

Session.set('mqQuestionVars',vars);

var mqQuestionText = t.$('#questionText').val();
var mqQuestionAns = t.$('#questionAnswer').val();

vars.forEach(function(el){
  var re = new RegExp("@"+el.name+'\\b',"g")
  var varVal = el.value;
  mqQuestionText = mqQuestionText.replace(re,varVal);
  mqQuestionAns = mqQuestionAns.replace(re,varVal);

})

Session.set('questionPreview',{answer:mqQuestionAns,text:mqQuestionText});
renderEquations(t);

}
else{alert('Check your code for errors')}
}



});

Template.questionAdd.onRendered(function(){


var mqQuestionText = Template.instance().$('#questionText').val();
var mqQuestionAns = Template.instance().$('#questionAnswer').val();

Session.set('questionPreview',{text:mqQuestionText,answer:mqQuestionAns});
if(!Session.set('mqQuestionVars')){
Session.set('mqQuestionVars',[{name:"var1",value:null,type:'rand-int',index:1,options:{min: -10, max: 10, exclude: ""}}]);
}

this.$( "#varList" ).sortable({

  update: function(e, ui) {
    var el = ui.item.get(0)
    var before = ui.item.prev().get(0)
    var after = ui.item.next().get(0)
    newVars = [];
    currVars = Session.get('mqQuestionVars').slice();

           // Here is the part that blew my mind!
           //  Blaze.getData takes as a parameter an html element
           //    and will return the data context that was bound when
           //    that html element was rendered!
           if(!before) {

             newVars.push(Blaze.getData(el));

             currVars.forEach(function(d){

               newVars.push(d)});

             newVars.splice(Blaze.getData(el).index,1);

           } else if(!after) {


             currVars.forEach(function(d){

               newVars.push(a);

             });

             newVars.push(Blaze.getData(el));
             //newVars[newVars.length-1].index=0;
             console.log(newVars);
             newVars.splice(el.index-1,1);


           }
           else{
             //else take the average of the two ranks of the previous
             // and next elements
             newRank = (Blaze.getData(after).rank +
                        Blaze.getData(before).rank)/2
                      }
          var i=0;
          newVars.forEach(function(d){d.index=i+1;i++})
          Session.set('mqQuestionVars',[].concat(newVars));


}
});


});

Template.questionAdd.onCreated(function(){

this.subscribe('questions',{_id:Session.get('selectedQuestion')});


})



Template.questionAdd.helpers({

vars: function(){

return Session.get('mqQuestionVars');

},

previewText: function(){

var previewText = Session.get('questionPreview');
if(previewText){return previewText.text}

else{return ""}


},
previewAnswer: function(){
  var previewAnswer = Session.get('questionPreview');
  if(previewAnswer){return previewAnswer.answer}

else{  return ""}

},

questionMode:function(){

return Session.get('questionMode');

},
currentTitle:function(){

var currQuestion =  Questions.findOne({_id:Session.get('currentQuestion')});
if(currQuestion){return currQuestion.title}
else{return null}


},

isPublic:function(){

var currQuestionIndex =  Session.get('currentQuestion');
var currQuestion =  Questions.findOne({_id:currQuestionIndex});

if(currQuestion){

if(currQuestion.public===true){return 'checked' }

else{return ''}

}
else{return 'checked'}
}
})

Template.questionView.onCreated(function(){
var template = Template.instance();

template.vars = new ReactiveVar(Template.instance().data.vars);
template.text = new ReactiveVar(Template.instance().data.text);
template.answer = new ReactiveVar(Template.instance().data.answer);
template.questionText = new ReactiveVar("");
template.questionAnswer = new ReactiveVar("");
//template.username = new ReactiveVar(Meteor.call('usernameFromID',Meteor.user()._id));
//console.log(template.vars.get());



  template.vars.set(processVariables(template.vars.get()));
  //console.log(template.vars.get());
  var mqQuestionText = template.text.get();
  var mqQuestionAns = template.answer.get();


  var vars = template.vars.get();

  vars.forEach(function(el){
    var re = new RegExp("@"+el.name+'\\b',"g")
    var varVal = el.value;
    mqQuestionText = mqQuestionText.replace(re,varVal);
    mqQuestionAns = mqQuestionAns.replace(re,varVal);
    //console.log(mqQuestionText);
  })

  template.questionText.set(mqQuestionText);
  template.questionAnswer.set(mqQuestionAns);

renderEquationsQV(template);
Template.instance().subscribe('users',{_id:Template.currentData().user});

});

Template.questionView.helpers({

questionText:function(t){

return Template.instance().questionText.get();


},
questionAnswer:function(){

return Template.instance().questionAnswer.get();

},
showHeader:function(){

return Session.get('questionViewShowHeader');

},
adminRights:function(){

var rights = (this.user==Meteor.user().username)|(Roles.userIsInRole(Meteor.user()._id,['admin-member','admin']));

if(rights){return rights}
return null;

}

})



Template.questionView.events({

  'click .reloadQuestion':function(e,t){
    e.preventDefault();
    template = t;
      template.vars.set(processVariables(template.vars.get()));
      //console.log(template.vars.get());
      var mqQuestionText = template.text.get();
      var mqQuestionAns = template.answer.get();


      var vars = template.vars.get();

      vars.forEach(function(el){
        var re = new RegExp("@"+el.name+'\\b',"g")
        var varVal = el.value;
        mqQuestionText = mqQuestionText.replace(re,varVal);
        mqQuestionAns = mqQuestionAns.replace(re,varVal);
        //console.log(mqQuestionText);
      })

      template.questionText.set(mqQuestionText);
      template.questionAnswer.set(mqQuestionAns);

    renderEquationsQV(template);



  }

})

Template.variable.onCreated(function(){
  var template = this;
if(!template.data.varType){

template.varType = new ReactiveVar('rand-int');

}



});

Template.variable.onRendered(function(){
var template = this;
template.autorun(function(){
  Session.get('mqQuestionVars');
  template.$('[data-toggle="tooltip"]').tooltip();

})




})

Template.variable.events({

'change .varTypeSelect':function(e,t){
  var vars = Session.get('mqQuestionVars');
  var selectedIndex = findVarIndex(vars,this.index);
  vars[selectedIndex].type=$(e.target).val();
  Session.set('mqQuestionVars',vars);

},

'click .varDelete':function(e){
e.preventDefault();
var vars = Session.get('mqQuestionVars');


if(vars.length>1){

var selectedIndex = Blaze.getData().index - 1;
vars.splice(selectedIndex,1)

Session.set('mqQuestionVars',vars);
}
},

'keyup .varID':function(e,t){

var vars = Session.get('mqQuestionVars');
var selectedIndex = findVarIndex(vars,this.index);
vars[selectedIndex].name = $(e.target).val()
Session.set('mqQuestionVars',vars);



},
'keyup .varRandInt':function(e,t){

var vars = Session.get('mqQuestionVars');
var selectedIndex = findVarIndex(vars,this.index);
vars[selectedIndex].options = {};
vars[selectedIndex].value = null;
var thisDiv = $(e.target).parent().parent();
vars[selectedIndex].options.min = parseInt(thisDiv.find('.varRandomIntMin').val())
vars[selectedIndex].options.max = parseInt(thisDiv.find('.varRandomIntMax').val())
vars[selectedIndex].options.exclude = thisDiv.find('.varRandomIntExclude').val()
Session.set('mqQuestionVars',vars);


},
'keyup .varRandDec':function(e){

var vars = Session.get('mqQuestionVars');
var selectedIndex = findVarIndex(vars,this.index);
vars[selectedIndex].options = {};
vars[selectedIndex].value = null;
var thisDiv = $(e.target).parent().parent();
vars[selectedIndex].options.min = parseInt(thisDiv.find('.varRandomDecMin').val());
vars[selectedIndex].options.max = parseInt(thisDiv.find('.varRandomDecMax').val())
vars[selectedIndex].options.DP = parseInt(thisDiv.find('.varRandomDecDP').val())
Session.set('mqQuestionVars',vars);

},
'keyup .varCalcValText':function(e){
var vars = Session.get('mqQuestionVars');
var selectedIndex = findVarIndex(vars,this.index);
vars[selectedIndex].options = {};
vars[selectedIndex].text = $(e.target).val();
Session.set('mqQuestionVars',vars);

},

'blur .varCustomJS':function(e){
  var vars = Session.get('mqQuestionVars');
  var selectedIndex = findVarIndex(vars,this.index);
  vars[selectedIndex].options = {};
  vars[selectedIndex].text = $(e.target).val()
  Session.set('mqQuestionVars',vars);


}

});

Template.variable.helpers({
isRandInt: function(){
return (this.type=='rand-int');
},
isRandDec: function(){
return (this.type=='rand-dec');
},
isCalcVal: function(){
return (this.type=='calc-val');
},
isCustomJS: function(){
return (this.type=='customJS');
}
})

Template.listQuestions.helpers({

question: function(){

return Questions.find();

}

})


Template.listQuestions.onCreated(function(){



  this.subscribe('questions',{public:true});


});

Template.listQuestions.onRendered(function(){

Session.set('mqQuestionVars',null);
Session.set('questionViewShowHeader',true);

})



Template.listQuestions.events({

'click .questionDelete':function(e){
e.preventDefault();
var check = confirm("Are you sure?");
if(check){

Questions.remove({_id:this._id});


}


},
'click .questionEdit':function(e){
e.preventDefault();


Session.set('questionMode','Edit')



Session.set('mqQuestionVars',this.vars);
Session.set('currentQuestion',this._id);
Router.go('/questions/edit/'+this._id+"/");


},
'click .questionCopy':function(e){
e.preventDefault();
var courseUnitStandardObject = {
course:this.course,
unit:this.unit,
standard:this.standard,

}

Session.set('questionMode','Copy')

Session.set('currentCourseUnitStandard',courseUnitStandardObject);

Session.set('mqQuestionVars',this.vars);
Session.set('currentQuestion',this._id);
Router.go('/questions/edit/'+this._id+"/");


}
})

Template.listMyQuestions.onCreated(function(){

  Session.set('questionViewShowHeader',false);

  self = this;
  self.autorun(function(){
     if(Meteor.user()){
     self.subscribe('questions',{user:Meteor.user().username});
   }
  })


})


Template.listMyQuestions.helpers({

question: function(){

return Questions.find({},{sort:{created:-1,edited:-1}});

}

})

Template.listMyQuestions.events({

'click .questionDelete':function(e){
e.preventDefault();
var check = confirm("Are you sure?");
if(check){

Questions.remove({_id:this._id});


}


},
'click .questionEdit':function(e){
e.preventDefault();
var courseUnitStandardObject = {
course:this.course,
unit:this.unit,
standard:this.standard,

}

Session.set('questionMode','Edit')

Session.set('currentCourseUnitStandard',courseUnitStandardObject);

Session.set('mqQuestionVars',this.vars);
Session.set('currentQuestion',this._id);
Router.go('/questions/edit/'+this._id+"/");


},
'click .questionCopy':function(e){
e.preventDefault();
var courseUnitStandardObject = {
course:this.course,
unit:this.unit,
standard:this.standard,

}

Session.set('questionMode','Copy')

Session.set('currentCourseUnitStandard',courseUnitStandardObject);

Session.set('mqQuestionVars',this.vars);
Session.set('currentQuestion',this._id);
Router.go('/questions/edit/'+this._id+"/");


}
})



function renderEquations(template){


var eqnsHTML = $('<div>'+Session.get('questionPreview').text + '</div>')
var eqnsText = $(eqnsHTML).find('eq');

      $(eqnsText).each(function(n,e){

      katex.render(e.innerText ,e);


    })


var ansHTML = $('<div>'+Session.get('questionPreview').answer + '</div>');
var ansText = $(ansHTML).find('eq');

          $(ansText).each(function(n,e){

          katex.render(e.innerText ,e);


        })

        Session.set('questionPreview',{text:$(eqnsHTML).html(),answer:$(ansHTML).html()});


}

function renderEquationsQV(template){


var eqnsHTML = $('<div>'+template.questionText.get() + '</div>')
var eqnsText = $(eqnsHTML).find('eq');

      $(eqnsText).each(function(n,e){

      katex.render(e.innerText ,e);


    })


var ansHTML = $('<div>'+template.questionAnswer.get() + '</div>');
var ansText = $(ansHTML).find('eq');

          $(ansText).each(function(n,e){

          katex.render(e.innerText ,e);


        })

        template.questionText.set($(eqnsHTML).html());
        template.questionAnswer.set($(ansHTML).html());


}




Template.registerHelper('incIndex',function(e){


return (e+1);

})


function findVarIndex(array,indexVal){
var returnValue=-1;
array.forEach(function(e,i){
  //console.log(e.index+","+indexVal+","+i)
if(e.index===indexVal){
 returnValue = i;

}

});

return returnValue;

}

function processVariables(vars){
  var codeHasErrors = false;

  vars.forEach(function(el,i){

  if(el.type=='rand-int'){

    var options = el.options;
    if(!options){
    el.options = {min: -10, max: 10, exclude: ""}

    }
    var exclude = el.options.exclude.trim();
    if(el.options.exclude.trim()!=''){
     exclude = exclude.split(',');
      exclude.forEach(function(e,i){

        exclude[i] = parseInt(e);

      })

    }
    else{
    exclude = []

    }

  el.value = Kh.randRangeExclude(el.options.min,el.options.max,exclude)

    }
    else if(el.type=='rand-dec'){

      el.value = (el.options.min + Math.random()*(el.options.max-el.options.min)).toFixed(el.options.DP);


    }
    else if(el.type=='calc-val'){

      var previousVars = vars.slice(0,i)
      var varText = el.text;
      previousVars.forEach(function(e){

      var re = new RegExp("@"+e.name+'\\b',"g")
      var varVal = e.value;

      varText = varText.replace(re,varVal);


    });

    try{
     el.value = eval(varText);
   }
   catch(e){

     console.log(e+", "+varText);
     console.log(el);
     codeHasErrors = true;

   }
    }
    else if(el.type=='customJS'){

      var previousVars = vars.slice(0,i)
      var varText = el.text;
      previousVars.forEach(function(e){

      var re = new RegExp("@"+e.name+'\\b',"g")
      var varVal = e.value;

      varText = varText.replace(re,varVal);


    });
    varText = "(function(){" + varText + "})()";
    try{
     el.value = eval(varText);
   }
   catch(e){

     console.log(e+", "+varText+", "+el);
     codeHasErrors = true;
   }

    }


  })

if(!codeHasErrors){return vars;}
else{return 'code-error'}

}
