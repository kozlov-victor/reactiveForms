
RF.applyBindings('#app',{
    dictionary: {
        cities:[
            {id:1,name:'Киев'},
            {id:2,name:'Львов'},
            {id:3,name:'Житомир'},
            {id:4,name:'Ровно'},
            {id:5,name:'Тернополь'},
            {id:6,name:'Белая Церковь'}
        ]
    },
    selectedCities:[],
    removeFromSelected: function(index){
        this.selectedCities.splice(index,1);
    }
});


RF.applyBindings('#app_2',{
    selectedNumbers:['one'],
    removeFromSelected: function(index){
        this.selectedNumbers.splice(index,1);
    }
});

RF.applyBindings('#app_3',{
    selectedNumbers:['2'],
    removeFromSelected: function(index){
        this.selectedNumbers.splice(index,1);
    }
});