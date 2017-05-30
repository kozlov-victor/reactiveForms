

RF.applyBindings('#app',{
    name: 'defaultUserName',
    nameSize: function(){
        return this.name.length;
    }
});