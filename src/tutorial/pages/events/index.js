var evnts = [
    'change',
    'click',
    'blur',
    'focus',
    'submit',
    'keypress',
    'keyup',
    'keydown'
];


for (var i=0;i<evnts.length;i++) {
    var e = evnts[i];
    RF.applyBindings('#bind_'+e,{
        app: {
            model: 'appModel',
            result:'appResult'
        },
        modelToResult: function(){
            this.app.result = this.app.model;
        }
    });
}