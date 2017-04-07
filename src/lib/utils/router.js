
class HashRouterStrategy { // todo complete

    static navigateTo(route,params){
        location.hash = route;
    }

    static goBack(){
        // todo
    }

    static _check(hash) {
        let isMatch = false;
        Object.keys(Router._pages).some(key=>{
            let match = hash.match(new RegExp(key.replace(/:([^\/]+)/g, "([^\/]*)")));
            if (match) {
                match.shift();
                let routeParams = {};
                match.forEach(function (value, i) {
                    routeParams[key.replace(":", "")] = value;
                });
                isMatch = true;
                return true;
            }
        });
        if (!isMatch) throw `page with path ${hash} not registered, set up router correctly`;

    }
    static setup(){
        window.addEventListener('hashchange',function(){
            HashRouterStrategy._check(location.hash);
        });
    };
}

class ManualRouterStrategy {

    static navigateTo(route,params){
        __showPage(route,params);
        ManualRouterStrategy.history.push({route,params});
    }

    static setup(){};

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
        Router._strategy.setup();
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
