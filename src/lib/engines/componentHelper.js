
const dataTransclusion = 'data-transclusion';

class ComponentHelper {


    static _runTransclNode(componentProto,domEl,transclNode,transclComponents){
        let transclusionId = domEl.getAttribute('data-transclusion-id')||'';
        let name = transclNode.getAttribute(dataTransclusion);
        let nameSpecifiedById = transclusionId?name+=`\\:\\#${transclusionId}`:'';
        if (!name) {
            console.error(componentProto.node);
            console.error(transclNode);
            throw `${dataTransclusion} attribute can not be empty`;
        }

        let recipients =
            DomUtils.
            nodeListToArray(
                domEl.querySelectorAll(
                    `[${dataTransclusion}="${name}"],[${dataTransclusion}="${nameSpecifiedById}"]`
                )
            ).
            filter(el=>{
                let closestWithSameName =
                    el.parentNode &&
                    (
                        el.parentNode.closest(`[${dataTransclusion}="${name}"]`) ||
                        el.parentNode.closest(`[${dataTransclusion}="${nameSpecifiedById}"]`)
                    );
                if (!!closestWithSameName) {
                    console.error(domEl);
                    console.error(closestWithSameName);
                    throw (
                        `
                            transclusion name conflict:
                            dont use same transclusion name at different components with parent-child relations.
                            Conflicted name: "${name}"`
                    );
                }
                return true;
            });

        recipients.forEach(rcp=>{
            transclNode.innerHTML = '';
            transclComponents.push({transclNode,rcp});
        });
    }


    static _runComponentDomEl(rootComponent,componentProto,domEl,transclComponents,componentNodes){
        if (domEl.getAttribute('data-_processed')) return;
        domEl.setAttribute('data-_processed','1');

        let hasNotTranscluded = false;
        DomUtils.nodeListToArray(domEl.childNodes).forEach(chdrn=>{
            if (chdrn.hasAttribute && !(chdrn.hasAttribute(dataTransclusion)))
                hasNotTranscluded = true;
        });
        if (hasNotTranscluded) {
            console.warn(domEl);
            console.warn(`children elements of component ${componentProto.name} will be removed`);
        }


        let domId = domEl.getAttribute('id');
        let componentNode = componentProto.node.cloneNode(true);
        DomUtils.nodeListToArray(componentNode.querySelectorAll(`[${dataTransclusion}]`)).forEach(transclNode=>{
            ComponentHelper._runTransclNode(componentProto,domEl,transclNode,transclComponents);
        });
        domEl.parentNode.insertBefore(componentNode,domEl);

        let dataStateExpression = domEl.getAttribute('data-state');
        let dataState = dataStateExpression?
            ExpressionEngine.executeExpression(dataStateExpression,rootComponent):{};
        let component = componentProto.newInstance(componentNode,dataState);
        domId && (component.domId = domId);

        component.parent = rootComponent;
        component.parent.addChild(component);
        if (dataStateExpression) component.stateExpression = dataStateExpression;
        component.disableParentScopeEvaluation = true; // avoid recursion in Component

        component.run();

        domEl.parentNode.removeChild(domEl);
        componentNodes.push({component,componentNode});
    }

    static _runComponent(rootComponent,componentProto){
        let transclComponents = [];
        let domEls =  DomUtils.nodeListToArray(rootComponent.node.getElementsByTagName(componentProto.name));
        if (rootComponent.node.tagName.toLowerCase()==componentProto.name.toLowerCase()) {
            console.error(`
                   Can not use "data-for" attribute at component directly. Use "data-for" directive at parent node`);
            console.error('component node:',rootComponent.node);
            throw "Can not use data-for attribute at component"
        }
        let componentNodes = [];
        domEls.forEach(domEl=>{
            ComponentHelper._runComponentDomEl(rootComponent,componentProto,domEl,transclComponents,componentNodes);
        });
        let hasStateChanged = false;
        componentNodes.forEach((item)=>{
            let children = DomUtils.removeParentButNotChildren(item.componentNode);
            if (children.length == 1) {
                item.component.modelView.$el = children[0];
            } else {
                item.component.modelView.$el = children;
            }
            hasStateChanged = item.component.setMounted(true)!='noChanged' || hasStateChanged;
            hasStateChanged = item.component.setShown(true)!='noChanged' || hasStateChanged;
        });
        hasStateChanged && (Component.digestAll());
        return transclComponents;
    }

    static _runTransclusionComponent(rootComponent,trnscl){
        DomUtils.nodeListToArray(trnscl.rcp.childNodes).forEach(n=>{
            trnscl.transclNode.appendChild(n);
        });
        let transclComponent = new ScopedDomFragment(trnscl.transclNode,rootComponent.modelView);
        rootComponent.addChild(transclComponent);
        transclComponent.parent = rootComponent;
        trnscl.transclNode.setAttribute('data-_processed','1');
        transclComponent.run();
    }

    static runComponents(rootComponent){
        let transclComponents = [];
        ComponentProto.instances.forEach(componentProto=>{
            transclComponents = transclComponents.concat(ComponentHelper._runComponent(rootComponent,componentProto));
        });
        transclComponents.forEach(trnscl=>{
            ComponentHelper._runTransclusionComponent(rootComponent,trnscl);
        });

    }
    
}