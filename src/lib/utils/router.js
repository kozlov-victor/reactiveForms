
class Router {

    constructor(){
        this._pages = {};
    }

    setup(keyValues){
        this.routeNode = document.querySelector('[data-route]');
        if (!this.routeNode) throw 'can not run Route: element with data-route attribute not found';
        Object.keys(keyValues).forEach(key=>{
            this._pages[key]={
                componentProto: keyValues[key]
            };
        });
    }

    navigateTo(pageName){
        let pageItem = this._pages[pageName];
        if (!pageItem) throw `${pageName} not registered, set up router correctly`;
        this.routeNode.innerHTML = '';
        if (!pageItem.component) {
            let componentNode = pageItem.componentProto.node.cloneNode(true);
            pageItem.component = pageItem.componentProto.runNewInstance(componentNode,{});
            delete pageItem.componentProto;
        }
        this.routeNode.appendChild(pageItem.component.node);
    }

}
