
RF.applyBindings('#app',{
    getInitialState: function(){
       return {
           user: {
               name: 'defaultUserName',
               isSuperMan: false,
               isDisabled: false
           }
       }
    }
});