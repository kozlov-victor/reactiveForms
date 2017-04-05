

RF.registerComponent('counter-component',{
    template: {
        type: 'string',
        value:
            '<div class="counter">'+
            '    {{counter}}'+
            '    <button data-click="inc()">+</button>'+
            '    <button data-click="dec()">-</button>'+
            '</div>'
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
RF.run();