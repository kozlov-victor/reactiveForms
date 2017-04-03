

class Component {

    constructor(name,node,modelView){
        this.parent = null;
        this.children = null;
        this.name = name;
        this.node = node;
        this.modelView = modelView;
        this.watchers = [];
        // this.id = MiscUtils.getUID();
        // this.node.setAttribute('data-component-id',this.id);
        Component.instances.push(this);
    }

    addChild(childComponent) {
        if (!this.children) this.children = [];
        this.children.push(childComponent);
    }

    // updateModelView(modelView){ // todo need??
    //     this.modelView = modelView;
    //     if (this.children) {
    //         this.children.forEach(c=>{
    //             c.modelView = modelView;
    //         });
    //     }
    // }

    addWatcher(expression, listenerFn) {
        let watcherFn = ExpressionEngine.getExpressionFn(expression);
        this.watchers.push({
            expression,
            watcherFn,
            listenerFn
        });
        listenerFn(ExpressionEngine.runExpressionFn(watcherFn,this));
    }
    digest(){
        this.watchers.forEach(watcher=> {
            let newValue = ExpressionEngine.runExpressionFn(watcher.watcherFn,this);
            if (typeof newValue =='object') {
                newValue = MiscUtils.deepCopy(newValue);
            }
            let oldValue = watcher.last;
            if (!MiscUtils.deepEqual(newValue,oldValue)) {
                watcher.listenerFn(newValue, oldValue);
            }
            watcher.last = newValue;
        });
        // if (this.children) {
        //     this.children.forEach(c=>{
        //         c.digest();
        //     });
        // }
    };

    run() {
        new DirectiveEngine(this).run();
    }

    destroy(){
        // todo not implemented yet!
    }

    static digestAll() {
        Component.instances.forEach(cmp=> {
            cmp.digest();
        });
    }
}
Component.instances = [];
