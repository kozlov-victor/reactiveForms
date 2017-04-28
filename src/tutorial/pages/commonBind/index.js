
var user = {
    name: 'defaultUserName',
    level: function(){
        return this.name.length;
    }
};

RF.applyBindings('#app',{
    user: user,
    level: function(){
        return this.user.level();
    }
});