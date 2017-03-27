
RF.applyBindings('#app',{
    user: {
        hasSecretKey: true,
        numOfClicks:0
    },
    clickMe: function(){
        this.user.numOfClicks++;
    }
});
RF.run();