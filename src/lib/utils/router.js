
class HashRouterStrategy { // todo complete

    static onMatch(route,params){

    }

    static check(hash) {
        let keys, match, routeParams;
        let isMatch = false;
        for (let i = 0, max = this.routes.length; i < max; i++) {
            routeParams = {};
            keys = this.routes[i].path.match(/:([^\/]+)/g);
            match = hash.match(new RegExp(this.routes[i].path.replace(/:([^\/]+)/g, "([^\/]*)")));
            if (match) {
                match.shift();
                match.forEach(function (value, i) {
                    routeParams[keys[i].replace(":", "")] = value;
                });
                HashRouterStrategy.onMatch();
                isMatch = true;
                break;
            }
        }
        if (!isMatch) {
        }

    }
    static setup(pages){
        HashRouterStrategy.pages = pages;
        window.addEventListener('hashchange',function(){
            Router.check(location.hash);
        });

    };
}

class Router {

    constructor(){
        this._pages = {};
    }

    setup(keyValues,routerStrategy){
        let routePlaceholderNode = document.querySelector('[data-route]');
        if (!routePlaceholderNode) throw 'can not run Route: element with data-route attribute not found';
        this.routeNode = routePlaceholderNode.parentNode.appendChild(document.createElement('div'));
        Object.keys(keyValues).forEach(key=>{
            this._pages[key]={
                componentProto: keyValues[key],
                component: null
            };
        });
    }

    navigateTo(pageName,params){
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
Router.STRATEGY = {
    ABSTRACT:0,
    HASH:1
};
