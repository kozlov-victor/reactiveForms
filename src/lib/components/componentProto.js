
class ComponentProto{

    constructor(name,node,modelView){
        this.name = name;
        this.node = node;
        this.modelView = modelView;
    }

    applyProperties(componentName,target,properties = {},opts = {}){
        let strict = opts.strict;
        Object.keys(properties).forEach(function(key){
            if (strict && !target.hasOwnProperty(key))
                throw "can not apply non declared property " + key + " to component " + componentName;
            target[key] = properties[key];
        });
    }

    runNewInstance(node,properties){
        let externalProperties = this.modelView.external;
        let modelView = MiscUtils.deepCopy(this.modelView);
        delete modelView.external;
        externalProperties && this.applyProperties(this.name,modelView,externalProperties);
        this.applyProperties(this.name,modelView,properties,{strict:true});
        let instance = new Component(this.name,node,modelView);
        instance.run();
        return instance;
    }

}
ComponentProto.instances = [];
