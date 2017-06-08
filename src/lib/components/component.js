class Component {

    constructor(name, node, modelView) {
        this.parent = null;
        this.children = null;
        this.disableParentScopeEvaluation = false;
        this.name = name;
        this.node = node;
        this.modelView = modelView;
        this.watchers = [];
        this.id = MiscUtils.getUID();
        this.domId = null;
        this.node.setAttribute('data-component-id',this.id);
        this.isWatchEnable = true;
        this.isMounted = false;
        this.isShown = false;
        this.stateExpression = null;
        DomUtils.nodeListToArray(this.node.querySelectorAll('*')).forEach(el=>{
            el.setAttribute('data-component-id',this.id);
        });
        modelView.$el = node;
        Component.instances.push(this);
    }

    addChild(childComponent) {
        if (!this.children) this.children = [];
        this.children.push(childComponent);
    }


    setShown(val,params){
        let res = 'noChanged';
        if (this.isShown==val) return res;
        this.isShown = val;
        if (this.isShown) {
            res = this.modelView.onShow(params);
        } else {
            this.modelView.onHide();
        }
        this.isWatchEnable = val;
        if (this.children) {
            this.children.forEach(c=>{
                c.setShown(this.isShown);
            });
        }
        return res;
    }

    setMounted(val,params){
        let res = 'noChanged';
        if (this.isMounted==val) return res;
        this.isMounted = val;
        if (this.isMounted) {
            res = this.modelView.onMount(params);
        } else {
            this.modelView.onUnmount();
        }
        this.isWatchEnable = val;
        if (this.children) {
            this.children.forEach(c=>{
                c.setMounted(this.isMounted);
            });
        }
        return res;
    }

    addWatcher(expression, listenerFn) {
        let watcherFn = ExpressionEngine.getExpressionFn(expression);
        this.watchers.push({
            expression,
            watcherFn,
            listenerFn
        });
        listenerFn(ExpressionEngine.runExpressionFn(watcherFn, this));
    }

    _updateExternalState(){
        if (!this.stateExpression) return;
        let newExternalState = ExpressionEngine.executeExpression(this.stateExpression,this.parent);
        Object.keys(newExternalState).forEach(key=>{
            if (this.modelView[key]!==newExternalState[key])
                this.modelView[key]=newExternalState[key];
        });
    }

    digest() {
        if (!this.isWatchEnable) return;

        this._updateExternalState();
        this.watchers.forEach(watcher => {
            let newValue = ExpressionEngine.runExpressionFn(watcher.watcherFn, this);
            let oldValue = watcher.last;
            let newValDeepCopy = MiscUtils.deepCopy(newValue);
            if (!MiscUtils.deepEqual(newValDeepCopy,oldValue)) {
                watcher.listenerFn(newValue, oldValue);
            }
            watcher.last = newValDeepCopy;
        });
    };

    run() {
        new DirectiveEngine(this).run();
    }

    destroy() {
        // todo not implemented yet! todo remove watchers
        this.node.remove();
        //Component.instances.splice(Component.instances.indexOf(this),1);
        if (this.children) {
            this.children.forEach(c => {
                c.destroy();
            });
        }
    }

    getComponentsByName(name){
        return this.children && this.children.filter(child=>{
            return child.name==name;
        });
    }

    getComponentById(id){
        return this.children && this.children.filter(child=>{
            return child.domId==id;
        })[0];
    }

    static digestAll() {
        Component.instances.forEach(cmp => {
            cmp.digest();
        });
    }

    static getComponentByInternalId(id){
        let res = null;
        Component.instances.some(cmp => {
            if (cmp.id==id) {
                res = cmp;
                return true;
            }
        });
        return res;
    }

    static getComponentByDomId(domId){
        let res = null;
        Component.instances.some(cmp => {
            if (cmp.domId==domId) {
                res = cmp;
                return true;
            }
        });
        return res;
    }
}
Component.instances = [];
