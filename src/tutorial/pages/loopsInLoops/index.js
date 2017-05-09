
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
    for (var i=0;i<this.bundles.length;i++) {
        this.bundles[i].name = 'bundle_'+rnd();
    }
};

app.changeInternal = function(){
    for (var i=0;i<this.bundles.length;i++) {
        for (var j=0;j<this.bundles[i].data.length;j++) {
            this.bundles[i].data[j] = {slot:'slot_'+rnd()};
        }
    }
};

app.changeAll = function(){
    for (var i=0;i<this.bundles.length;i++) {
        this.bundles[i].name = 'bundle_'+rnd();
        for (var j=0;j<this.bundles[i].data.length;j++) {
            this.bundles[i].data[j] = {slot:'slot_'+rnd()};
        }
    }
};

app.add = function(){
    this.bundles.push({
        name:'Хранилище_'+rnd(),
        data: [
            {'slot':'sl_'+rnd()},
            {'slot':'sl_'+rnd()}
        ]
    });
};

app.removeExternal = function(i){
    this.bundles.splice(i,1);
};

app.removeInternal = function(i,j){
    this.bundles[i].data.splice(j,1);
};

app.addInternal = function(i){
    this.bundles[i].data.push({
        slot: 'new_'+rnd()
    });
};

app.addInternal = function(i){
    this.bundles[i].data.push({slot:'new_'+rnd()})
};

app.changeGlobal = function(){

    this.bundles = [
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