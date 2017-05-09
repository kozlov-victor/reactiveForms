
var fruits = {
    '0': 'fruit zero',
    '1': 'fruit one',
    '2': 'fruit two'
};
var rnd = function(){
    return ~~(Math.random()*100);
};

var cnt=3;

RF.applyBindings('#app',{
    fruits: fruits,
    currentFruit: this.fruits[0],
    currentFruitKey: '0',
    add: function(){
        this.fruits[(''+ cnt++ + rnd())] = rnd();
    },
    remove: function(key){
        delete this.fruits[key];
    },
    setCurrentFruit: function(key){
        this.currentFruit = this.fruits[key];
        this.currentFruitKey = key;
    }
});