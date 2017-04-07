

var app = {
    user: {
        firstName:'',
        lastName:'',
        carmaLevel:42
    },
    navigateTo: function(index){
        RF.Router.navigateTo('page'+index);
    },
    goBack: function(){
        RF.Router.goBack();
    }
};

var page1 = RF.registerComponent('page1',{
    template: {
        type: 'dom',
        value: 'page1Tmpl'
    },
    external: {
        app: app
    }
});

var page2 = RF.registerComponent('page2',{
    template: {
        type: 'dom',
        value: 'page2Tmpl'
    },
    external: {
        app: app
    }
});

var page3 = RF.registerComponent('page3',{
    template: {
        type: 'dom',
        value: 'page3Tmpl'
    },
    external: {
        app: app
    }
});

RF.Router.setup({
    'page1': page1,
    'page2': page2,
    'page3': page3
});

RF.Router.navigateTo('page1');
