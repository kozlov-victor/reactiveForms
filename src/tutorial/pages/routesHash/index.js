

var app = {
    pages:[1,2,3,4,5],
    goBack: function(){
        RF.Router.goBack();
    },
    navigateTo: function(pageIndex){
        RF.Router.navigateTo('pageDetail/'+pageIndex);
    }
};

var pageMain = RF.registerComponent('page1',{
    template: {
        type: 'dom',
        value: 'pageMain'
    },
    app: app
});

var pageDetail = RF.registerComponent('page2',{
    template: {
        type: 'dom',
        value: 'pageDetail'
    },
    pageIndex:-1,
    onShow: function(params){
        this.pageIndex = params.pageIndex;
    },
    app: app
});

RF.Router.setup({
    'pageMain': pageMain,
    'pageDetail/:pageIndex': pageDetail
},RF.Router.STRATEGY.HASH);

RF.Router.navigateTo('pageMain');
