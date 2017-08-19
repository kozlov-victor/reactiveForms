
RF.applyBindings('#app',{

    currSexValue: null,

    user: {
        name: 'defaultUserName',
        isSuperMan: false,
        sex: 'M'
    },

    onChanged(val){
        this.currSexValue = val;
    }
});