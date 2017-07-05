

RF.applyBindings('#app',{
    draggableModel: {
        name: 'user_name'
    },
    isDraggable: true,
    onDrop: (object,e)=>{
        console.log(object,e);
    }
});