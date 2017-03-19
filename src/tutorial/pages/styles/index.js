
RF.applyBindings('#app',{
    bold: false,
    italic: false,
    underlined: false,
    resetAll: function(){
        this.bold = this.italic = this.underlined = false;
    }
});