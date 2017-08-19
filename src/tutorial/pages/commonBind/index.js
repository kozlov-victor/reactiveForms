

RF.applyBindings('#app',{
    name: 'defaultUserName',
    age:42,
    testObject: {a:42},
    changeTestObject(){
        this.testObject = {changed:1};
    },
    nameSize: function(){
        return this.name.length;
    }
});