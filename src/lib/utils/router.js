
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

class ManualRouterStrategy {

    static navigateTo(route,params){
        __showPage(route,params);
        ManualRouterStrategy.history.push({route,params});
    }

    static setup(pages){};

    static goBack(){
        ManualRouterStrategy.history.pop();
        let state = ManualRouterStrategy.history[ManualRouterStrategy.history.length-1];
        if (state) __showPage(state.route,state.params);
    }

}

ManualRouterStrategy.history = [];

class RouterStrategyProvider {

    static getRouterStrategy(strategyName) {
        switch (strategyName) {
            case Router.STRATEGY.MANUAL:
                return ManualRouterStrategy;
            case Router.STRATEGY.HASH:
                return HashRouterStrategy;
            default:
                throw `cat not find strategy with strategyName ${strategyName}`;
        }
    }

}

let routeNode = null;
let __showPage = (pageName)=>{
    let pageItem = Router._pages[pageName];
    if (!pageItem) throw `${pageName} not registered, set up router correctly`;
    if (!pageItem.component) {
        let componentNode = pageItem.componentProto.node.cloneNode(true);
        pageItem.component = pageItem.componentProto.runNewInstance(componentNode,{});
        delete pageItem.componentProto;
    }
    routeNode.parentNode.replaceChild(pageItem.component.node,routeNode);
    routeNode = pageItem.component.node;
};

class Router {

    static setup(keyValues,strategyName = Router.STRATEGY.MANUAL){
        Router._strategy = RouterStrategyProvider.getRouterStrategy(strategyName);
        let routePlaceholderNode = document.querySelector('[data-route]');
        if (!routePlaceholderNode) throw 'can not run Route: element with data-route attribute not found';
        routeNode = routePlaceholderNode.parentNode.appendChild(document.createElement('div'));
        Object.keys(keyValues).forEach(key=>{
            Router._pages[key]={
                componentProto: keyValues[key],
                component: null
            };
        });
    }

    static navigateTo(pageName,params){
        Router._strategy.navigateTo(pageName,params);
    }

    static goBack(){
        Router._strategy.goBack();
    }

}

Router._pages = {};
Router._strategy = null;

Router.STRATEGY = {
    MANUAL:0,
    HASH:1
};
