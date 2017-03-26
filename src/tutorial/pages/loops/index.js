
var fruits = [{name:'apple'},{name:'peanut'},{name:'orange'}];

RF.applyBindings('#app',{
    fruits: fruits,
    currentFruit: fruits[0],
    add: function(){
        this.fruits.push({name:~~(Math.random()*100)});
    },
    remove: function(i){
        this.fruits.splice(i,1);
    },
    setCurrentFruit: function(index){
        this.currentFruit = this.fruits[index];
    }
});
RF.run();