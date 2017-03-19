

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
    external: { // model объявлена как external, это значит, что она ссылается на внешний объект
        // если модель не будет обозначена как external, в компоненте будет создана локальная копия модели
        model: applicationModel
    },
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
RF.run();