
RF.registerComponent('popup-dialog',{
    template: {
        type: 'dom',
        value: 'popupTmpl'
    },
    getInitialState:function(){
        return {
            opened: false
        }
    },
    open: function(){
        this.opened = true;
    },
    close: function(){
        this.opened = false;
    }
});

RF.applyBindings('#app',{
    openDialog: function(dialogId){
        RF.getComponentById(dialogId).open();
    }
});