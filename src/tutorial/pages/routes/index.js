
var user = {
    firstName:'',
    lastName:'',
    carmaLevel:42
};

var page1 = RF.registerComponent('page1',{
    template: {
        type: 'dom',
        value: 'page1Tmpl'
    },
    toPage2: function(){
        RF.Router.navigateTo('page2');
    },
    user: user
});

var page2 = RF.registerComponent('page2',{
    template: {
        type: 'dom',
        value: 'page2Tmpl'
    },
    toPage1: function(){
        RF.Router.navigateTo('page1');
    },
    toPage3: function(){
        RF.Router.navigateTo('page3');
    },
    user: user
});

var page3 = RF.registerComponent('page3',{
    template: {
        type: 'dom',
        value: 'page3Tmpl'
    },
    toPage2: function(){
        RF.Router.navigateTo('page2');
    },
    user: user
});

RF.Router.setup({
    'page1': page1,
    'page2': page2,
    'page3': page3,
});
RF.Router.navigateTo('page1');
