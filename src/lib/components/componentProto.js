
class ComponentProto{

    constructor(name,node,properties){
        this.name = name;
        this.node = node;
        this.properties = properties;
    }

    newInstance(node, externalProperties){
        let modelView = new ModelView(this.name,this.properties,externalProperties);
        let cmp =  new Component(this.name,node,modelView);
        modelView.component = cmp;
        return cmp;
    }

    static getByName(name){
        return ComponentProto.instances.filter(it=>{return it.name==name})[0] || null;
    }

}
ComponentProto.instances = [];
