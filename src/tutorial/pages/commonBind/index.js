

RF.applyBindings('#app',{
    name: 'defaultUserName',
    age:42,
    nameSize: function(){
        return this.name.length;
    }
});