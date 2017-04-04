

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

    static applyBindings(domElement,modelView){
        if (typeof domElement == 'string') domElement = document.querySelector(domElement);
        if (!domElement) throw "can not apply bindings: root element not defined";
        let fragment = new ScopedDomFragment(domElement,modelView);
        fragment.run();
    };

    static digest(){
        Component.digestAll();
    }

    static run(){
        console.warn('core.run() is deprecated for now');
    }

}

Core.version = '0.2.2';

window.RF = Core;
window.RF.Router = new Router();
