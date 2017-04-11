

class Core{

    static registerComponent(name,modelView){
        name = MiscUtils.camelToSnake(name);
        let tmpl = TemplateLoader.getNode(modelView.template);
        let domTemplate = tmpl.innerHTML;
        tmpl.remove();
        let node = document.createElement('div');
        node.innerHTML = domTemplate;
        let componentProto = new ComponentProto(name,node,modelView);
        ComponentProto.instances.push(componentProto);
        return componentProto;
    }

    static applyBindings(domElementSelector,modelView){
        if (!domElementSelector) throw `ca not applyBindings: element selector not provided`;
        if (typeof domElementSelector!='string') throw (
            `element selector parameter mast me a string,
            but ${typeof domElementSelector} found}`);
        let domElement = document.querySelector(domElementSelector);
        if (!domElement) throw `can not apply bindings: root element with selector ${domElementSelector} not defined`;
        let fragment = new ScopedDomFragment(domElement,modelView);
        fragment.run();
    };

    static digest(){
        Component.digestAll();
    }

    static getComponentById(id){
        let cmp = Component.getComponentByDomId(id);
        if (!cmp) return null;
        return cmp.modelView;
    }

    static run(){
        throw "method not used";
    }

}

Core.version = '{{version}}';

window.RF = Core;
window.RF.Router = Router;
