class Component {

    constructor(name, node, modelView) {
        this.parent = null;
        this.children = null;
        this.name = name;
        this.node = node;
        this.modelView = modelView;
        this.watchers = [];
        this.id = MiscUtils.getUID();
        this.node.setAttribute('data-component-id',this.id);
        DomUtils.nodeListToArray(this.node.querySelectorAll('*')).forEach(el=>{
            el.setAttribute('data-component-id',this.id);
        });
        Component.instances.push(this);
    }

    addChild(childComponent) {
        if (!this.children) this.children = [];
        this.children.push(childComponent);
    }

    updateModelView(modelView) {
        //MiscUtils.superficialCopy(this.modelView,modelView);
        this.modelView = modelView;
        if (this.children) {
            this.children.forEach(c => {
                //c.modelView = modelView;
                //MiscUtils.superficialCopy(c.modelView,modelView);
            });
        }
    }

    onShow(){} // todo move to modelview class


    addWatcher(expression, listenerFn) {
        let watcherFn = ExpressionEngine.getExpressionFn(expression);
        this.watchers.push({
            expression,
            watcherFn,
            listenerFn
        });
        listenerFn(ExpressionEngine.runExpressionFn(watcherFn, this));
    }

    digest() {
        this.watchers.forEach(watcher => {
            let newValue = ExpressionEngine.runExpressionFn(watcher.watcherFn, this);
            if (typeof newValue == 'object') {
                newValue = MiscUtils.deepCopy(newValue);
            }
            let oldValue = watcher.last;
            if (!MiscUtils.deepEqual(newValue, oldValue)) {
                watcher.listenerFn(newValue, oldValue);
            }
            watcher.last = newValue;
        });
        // if (this.children) { // todo need??
        //     this.children.forEach(c=>{
        //         c.digest();
        //     });
        // }
    };

    run() {
        new DirectiveEngine(this).run();
    }

    destroy() {
        // todo not implemented yet!
        // remove watchers
        // remove nodes
        this.node.remove();
        if (this.children) {
            this.children.forEach(c => {
                c.destroy();
            });
        }
    }

    static digestAll() {
        Component.instances.forEach(cmp => {
            cmp.digest();
        });
    }

    static getComponentById(id){
        let res = null;
        Component.instances.some(cmp => {
            if (cmp.id==id) {
                res = cmp;
                return true;
            }
        });
        return res;
    }
}
Component.instances = [];
