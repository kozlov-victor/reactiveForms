
RF.applyBindings('#app',{
    user: {
        name: 'defaultUserName'
    },
    getScopedData: function(){
        console.log(this);
    }
});