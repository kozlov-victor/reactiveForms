

RF.applyBindings('#app',{
    user: {
        name: 'defaultUserName',
        nameSize: function(){
            return this.name.length;
        }
    }
});