
class Router {

    constructor(){
        this._pages = {};
    }

    setup(keyValues){
        var routePlaceholderNode = document.querySelector('[data-route]');
        if (!routePlaceholderNode) throw 'can not run Route: element with data-route attribute not found';
        this.routeNode = routePlaceholderNode.parentNode.appendChild(document.createElement('div'));
        Object.keys(keyValues).forEach(key=>{
            this._pages[key]={
                componentProto: keyValues[key],
                component: null
            };
        });
    }

    navigateTo(pageName){
        let pageItem = this._pages[pageName];
        if (!pageItem) throw `${pageName} not registered, set up router correctly`;
        if (!pageItem.component) {
            let componentNode = pageItem.componentProto.node.cloneNode(true);
            pageItem.component = pageItem.componentProto.runNewInstance(componentNode,{});
            delete pageItem.componentProto;
        }
        this.routeNode.parentNode.replaceChild(pageItem.component.node,this.routeNode);
        this.routeNode = pageItem.component.node;
    }

}
