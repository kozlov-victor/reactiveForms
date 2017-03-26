
var app = {};
app.bundles = [
    {
        name:'Хранилище 1',
        data: [
            {'slot':12},
            {'slot':33}
        ]
    },
    {
        name:'Хранилище 2',
        data: [
            {'slot':4},
            {'slot':32}
        ]
    },
    {
        name:'Хранилище 3',
        data: [
            {'slot':2},
            {'slot':45}
        ]
    }
];

var rnd = function(){
    return Math.random().toFixed(3)
};

app.changeExternal = function(){
    for (var i=0;i<3;i++) {
        this.app.bundles[i].name = 'bundle_'+rnd();
    }
};

app.changeInternal = function(){
    for (var i=0;i<3;i++) {
        for (var j=0;j<2;j++) {
            this.app.bundles[i].data[j] = {slot:'slot_'+rnd()};
        }
    }
};

app.changeAll = function(){
    for (var i=0;i<3;i++) {
        this.app.bundles[i].name = 'bundle_'+rnd();
        for (var j=0;j<2;j++) {
            this.app.bundles[i].data[j] = {slot:'slot_'+rnd()};
        }
    }
};

app.changeGlobal = function(){

    this.app.bundles = [
        {
            name:'Хранилище 1'+rnd(),
            data: [
                {'slot':12+rnd()},
                {'slot':33+rnd()}
            ]
        },
        {
            name:'Хранилище 2'+rnd(),
            data: [
                {'slot':4+rnd()},
                {'slot':32+rnd()}
            ]
        },
        {
            name:'Хранилище 3'+rnd(),
            data: [
                {'slot':2+rnd()},
                {'slot':45+rnd()}
            ]
        }
    ];

};

RF.applyBindings('#app',{
    app:app
});
RF.run();