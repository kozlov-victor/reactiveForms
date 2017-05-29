

RF.registerComponent('app-component',{
    template: {
        type: 'string',
        value:'\
            <div style="border: 1px solid black">\
                {{model && model[field]}}\
            </div>\
        '
    },
    getInitialState: function(){
        return {
            model:{field:'override it!'},
            field:'field'
        }
    }
});
RF.applyBindings('#app',{
    user: null,
    changeUserName: function(){
        if (!this.user) this.user = {};
        this.user.name = Math.random()
    },
    changeUserObject: function(){
        this.user = {name:Math.random()}
    }
});