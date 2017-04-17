
var MAX = 3000;

var list = [];

var change = function(item){
    item.name1 = ~~(Math.random()*100);
    item.name2 = ~~(Math.random()*100);
    item.name3 = ~~(Math.random()*100);
    item.name4 = ~~(Math.random()*100);
};

var add = function(){
    var item = {};
    change(item);
    list.push(item);
};

for (var i=0;i<MAX;i++) {
    add();
}

RF.applyBindings('#app',{
    list: list,
    add: function() {
        add();
    },
    change: function(item){
        change(item);
    },
    remove: function(i){
        this.list.splice(i,1);
    }
});