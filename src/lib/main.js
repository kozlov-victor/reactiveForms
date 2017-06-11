

class Core{

    static registerComponent(name,properties = {}){
        let nameOriginal = name;
        name = MiscUtils.camelToSnake(name);
        if (ComponentProto.getByName(name))
            throw `component with name ${nameOriginal} already registered`;
        let tmpl = TemplateLoader.getNode(properties,name);
        let domTemplate = tmpl.innerHTML;
        tmpl.remove();
        let node = document.createElement('div');
        node.innerHTML = domTemplate;

        let componentProto = new ComponentProto(name,node,properties);
        ComponentProto.instances.push(componentProto);
        return componentProto;
    }

    static applyBindings(domElementSelector,properties = {}){
        if (!domElementSelector) throw `can not applyBindings: element selector not provided`;
        if (typeof domElementSelector!='string') throw (
            `element selector parameter mast me a string,
            but ${typeof domElementSelector} found}`);
        let domElement = document.querySelector(domElementSelector);
        if (!domElement) throw `can not apply bindings: root element with selector ${domElementSelector} not defined`;
        let modelView = new ModelView(null,properties);
        let fragment = new ScopedDomFragment(domElement,modelView);
        fragment.run();
        fragment.setMounted(true);
        fragment.setShown(true);
        modelView.component = fragment;
        return fragment;
    };

    static digest(){
        Component.digestAll();
    }

    static getComponentById(id){
        let cmp = Component.getComponentByDomId(id);
        if (!cmp) return null;
        return cmp.modelView;
    }

    static getComponents(){
        return Component.instances.map(c=>{return c.modelView});
    }

    static _getComponentByInternalId(id){
        return Component.getComponentByInternalId(id);
    }

}

Core.version = '{{version}}';

window.RF = Core;
window.RF.Router = Router;
