
class ComponentProto{

    constructor(name,node,modelView){
        this.name = name;
        this.node = node;
        this.modelView = modelView;
    }

    applyProperties(target,properties = {},opts = {}){
        let strict = opts.strict;
        Object.keys(properties).forEach(function(key){
            if (strict && !target.hasOwnProperty(key))
                throw "can not apply non declared property " + key + " to component " + target.name;
            target[key] = properties[key];
        });
    }

    runNewInstance(node,properties){
        let externalProperties = this.modelView.external;
        let modelView = MiscUtils.deepCopy(this.modelView);
        delete modelView.external;
        this.applyProperties(modelView,properties,{strict:true});
        externalProperties && this.applyProperties(modelView,externalProperties);
        let instance = new Component(this.name,node,modelView);
        instance.run();
    }

}
ComponentProto.instances = [];
