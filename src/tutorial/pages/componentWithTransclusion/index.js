
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

var rnd = function(){
    return Math.random().toFixed(2);
};

var app = RF.registerComponent('app',{

    template:{
        type:'string',
        value:document.getElementById('app').innerHTML
    },

    dialog1Title: 'title Of Dialog One',
    dialog1Content: 'content Of Dialog One',
    dialog2Title: 'title Of Dialog Two',
    dialog2Content: 'content Of Dialog Two',

    openedArr:[],
    primitiveValue:'defaultPrimitiveValue',
    getPrimitiveValueLength(){
       console.trace('invoked getPrimitiveValueLength');
       return this.primitiveValue.length;
    },

    openDialog: function(dialogId){
        this.openedArr.push(rnd());
        RF.getComponentById(dialogId).open();
    },
    changeDialogData: function(){
        this.dialog1Title = 'title Of Dialog One ' + rnd();
        this.dialog1Content = 'content Of Dialog One ' + rnd();
        this.dialog2Title = 'title Of Dialog Two ' + rnd();
        this.dialog2Content = 'content Of Dialog Two ' + rnd();
    }
});


RF.Router.setup({
    app:app
});

RF.Router.navigateTo('app');