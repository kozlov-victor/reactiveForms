

class Core{


    static registerComponent(name,modelView){
        let tmpl = document.getElementById(modelView.template.value);
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
        ComponentProto.instances.forEach(function(componentProto){
            let domEls =  DomUtils.nodeListToArray(document.getElementsByTagName(componentProto.name));
            let componentNodes = [];
            domEls.forEach(function(it){
                let componentNode = componentProto.node.cloneNode(true);
                componentNodes.push(componentNode);
                it.parentNode.insertBefore(componentNode,it);
                let dataProperties = it.getAttribute('data-properties')||'{}';
                dataProperties = ExpressionEngine.getObjectFromString(dataProperties);
                componentProto.runNewInstance(componentNode,dataProperties);
                it.parentNode.removeChild(it);
            });
            componentNodes.forEach((node)=>{
                DomUtils.removeParentBunNotChildren(node);
            });
        });
    }

}

Core.version = '0.1.0';

window.RF = Core;
window.RF.Router = new Router();
