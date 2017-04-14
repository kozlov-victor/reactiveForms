

var applicationModel = {
    user: {
        name: 'defaultUserName',
        power: 100,
        karmaLevel: 42
    }
};

RF.registerComponent('counter-component',{
    template: {
        type: 'dom',
        value: 'counterTmpl'
    },
    model: applicationModel,
    modelField: '', // это свойство индивидуально для каждого компонента и будет определено (переопределено) в data-properties
    inc: function(){
        this.model.user[this.modelField]++;
    },
    dec: function(){
        this.model.user[this.modelField]--;
    }
});
RF.applyBindings('#application',{
    model: applicationModel
});