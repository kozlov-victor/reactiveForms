
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
                name:'node_2_2'
            }
        ]
    }
];

RF.registerComponent('node-item',{
    template: {
        type:'dom',
        value:'nodeItemTmpl'
    },
    external: {
        node:null
    },
    prp:-1
});

RF.applyBindings('#app',{
    app:app
});
RF.run();