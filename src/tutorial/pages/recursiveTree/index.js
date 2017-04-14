
var app = {};

app.nodes = [
    {
        name:'node_1',
        children: [
            {
                name:'node_1_1'
            },
            {
                name:'node_1_2'
            }
        ]
    },
    {
        name:'node_2',
        children: [
            {
                name:'node_2_1'
            },
            {
                name:'node_2_2',
                children: [
                    {name:'node_2_2_1'},
                    {
                        name:'node_2_2_2',
                        children: [
                            {name:'node_2_2_2_1'},
                            {
                                name:'node_2_2_2_2'
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

RF.registerComponent('node-item',{
    template: {
        type:'dom',
        value:'nodeItemTmpl'
    },
    getInitialState:function(){
        return {
            collapsed: true
        }
    },
    triggerCollapse: function(){
        this.collapsed = !this.collapsed;
    },
    node:null
});

RF.applyBindings('#app',{
    app:app
});