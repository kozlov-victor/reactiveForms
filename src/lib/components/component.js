

class Component {

    constructor(name,node,modelView,localModelView){
        this.name = name;
        this.node = node;
        this.modelView = modelView;
        this.localModelView = localModelView;
        this.watchers = [];
        Component.instances.push(this);
    }

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
    };

    run() {
        new DirectiveEngine(this).run();
    }

    static digestAll() {
        Component.instances.forEach(cmp=> {
            cmp.digest();
        });
    }
}
Component.instances = [];
