

RF.registerComponent('app-red-bordered',{
    template: {
        type: 'dom',
        value: 'redBorderedTmpl'
    }
});
RF.registerComponent('app-green-bordered',{
    template: {
        type: 'dom',
        value: 'greenBorderedTmpl'
    }
});
RF.registerComponent('app-root',{
    template: {
        type: 'dom',
        value: 'rootTmpl'
    },
    componentContent: 'component content here'
});
RF.applyBindings('#application',{
});