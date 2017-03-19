
RF.applyBindings('#app',{
    fruits: [
        'apple','peanut','orange'
    ],
    currentFruit: 'orange',
    add: function(){
        this.fruits.push(~~(Math.random()*100));
    },
    remove: function(i){
        this.fruits.splice(i,1);
    },
    setCurrentFruit: function(index){
        this.currentFruit = this.fruits[index];
    }
});
RF.run();