
Template.desmosView.rendered = function(){

elt = this.$('.desmos-container')[0];
options = {
keypad:false,
expressions:false,
lockViewport:true,
settingsMenu:false,
zoomButtons:false
};

var calculator = Desmos.Calculator(elt,options);

this.autorun(function(){

  var expression = Session.get('desmos-exp');
  calculator.setExpression({id:'graph1', latex:expression});

})




}

Template.desmosView.events({
'keydown #desmos-input':function(e){
console.log($(e.target).val());
Session.set('desmos-exp',$(e.target).val());
}
});
