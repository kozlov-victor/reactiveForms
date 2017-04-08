
RF.registerComponent('counter-component',{
    template: {
        type: 'dom',
        value: 'counterTmpl'
    },
    counter: 0,
    inc: function(){
        this.counter++;
    },
    dec: function(){
        this.counter--;
    }
});
RF.applyBindings('#app');