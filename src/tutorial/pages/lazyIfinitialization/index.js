


RF.applyBindings('#application',{
    user: {name:"initial"},
    setUserName: function(){
        this.user.name= 'test user';
    },
    getNameLength(){
        console.log('getNameLength invoked');
        return this.user.name.length;
    }

});