
const noop = ()=>{
    return 'noChanged';
};

class ModelView{

    constructor(componentName,properties = {},externalProperties = {}){
        this.name = componentName || '';
        this.initialProperties = properties;
        this.externalProperties = externalProperties;
        this.component = null;
        this.resetState({warnRedefined:true});

        this.onShow = this.onShow || noop;
        this.onHide = this.onHide || noop;
        this.onMount = this.onMount || noop;
        this.onUnmount = this.onUnmount || noop;
        this.onDestroy = this.onDestroy || noop;
    }

    resetState(warnRedefined = false){
        let properties = this.initialProperties;
        this._applyState(properties);
        let initialState = properties.getInitialState && properties.getInitialState();
        initialState && (initialState = MiscUtils.deepCopy(initialState));
        initialState && this._applyState(initialState,{warnRedefined});
        this._applyState(this.externalProperties,{strict:true});
        this.component && this.component._updateExternalState();
    }

    _applyState(properties = {},opts = {}){
        let strict = opts.strict;

        Object.keys(properties).forEach(key=>{
            if (strict && !this.hasOwnProperty(key))
                throw `
                    can not apply non declared property "${key}" to component "${this.name}",
                    declare property in getInitialState() method
                `;
            if (opts.warnRedefined && properties[key] && this.hasOwnProperty(key)) {
                console.warn(`property ${key} is redefined at component ${this.name}`);
            }
            this[key] = properties[key];
        });
    }

}