
let app = {
    states:[],
    mounted: true,
    shown: true,
    noop:false
};

RF.registerComponent('simple-component',{
    template: {
        type: 'dom',
        value: 'simpleTmpl'
    },
    app: app,
    onMount: function() {
        this.app.states.push('mounted');
        console.log('mounted',this.$el);
        this.$el.style.color = 'green';
    },
    onShow: function() {
        this.app.states.push('showed');
        console.log('showed');
    },
    onHide: function() {
        this.app.states.push('hided');
        console.log('hided');
    },
    onUnmount:function() {
        this.app.states.push('unmounted');
        console.log('unmounted');
    }
});
RF.applyBindings('#app',{
    app:app
});