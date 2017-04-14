
class ComponentProto{

    constructor(name,node,properties){
        this.name = name;
        this.node = node;
        this.properties = properties;
    }

    newInstance(node, externalProperties){
        let modelView = new ModelView(this.name,this.properties);
        modelView._applyState(externalProperties,{strict:true});
        return new Component(this.name,node,modelView);
    }

    static getByName(name){
        return ComponentProto.instances.filter(it=>{return it.name==name})[0] || null;
    }

}
ComponentProto.instances = [];
