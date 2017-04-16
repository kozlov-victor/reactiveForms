
class HashRouterStrategy { // todo complete

    static navigateTo(route,params){
        location.hash = route;
    }

    static goBack(){
        if (window.history) history.back();
    }

    static _check(hash) {
        let isMatch = false;
        hash = hash.substr(1);
        Object.keys(Router._pages).some(key=>{

            let routeParams = {};
            let keys = key.match(/:([^\/]+)/g);
            let match = hash.match(new RegExp(key.replace(/:([^\/]+)/g, "([^\/]*)")));
            if (match) {
                match.shift();
                match.forEach(function (value, i) {
                    routeParams[keys[i].replace(":", "")] = value;
                });
                isMatch = true;
                __showPage(key,routeParams);
                return true;
            }
        });
        if (!isMatch) throw `page with path ${hash} not registered, set up router correctly`;

    }
    static setup(){
        location.hash && HashRouterStrategy._check(location.hash);
        DomUtils.addEventListener(window,'hashchange',function(){
            HashRouterStrategy._check(location.hash);
        });
    };
}

class ManualRouterStrategy {

    static navigateTo(route,params){
        if (!Router._pages[route]) throw `${route} not registered, set up router correctly`;
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
let lastPageItem;
let __showPage = (pageName,params)=>{
    if (lastPageItem) {
        lastPageItem.component.modelView.onHide();
        lastPageItem.component.modelView.onUnmount();
    }
    lastPageItem = Router._pages[pageName];
    if (!lastPageItem) throw `no page with name ${pageName} registered`;
    if (!lastPageItem.component) {
        let componentNode = lastPageItem.componentProto.node.cloneNode(true);
        lastPageItem.component = lastPageItem.componentProto.newInstance(componentNode,{});
        lastPageItem.component.modelView.onShow(params);
        lastPageItem.component.run();
        delete lastPageItem.componentProto;
    } else {
        lastPageItem.component.modelView.onMount();
        lastPageItem.component.modelView.onShow(params);
    }
    routeNode.parentNode.replaceChild(lastPageItem.component.node,routeNode);
    routeNode = lastPageItem.component.node;
    Component.digestAll();
};

class Router {

    static setup(keyValues,strategyName = Router.STRATEGY.MANUAL){
        Router._strategy = RouterStrategyProvider.getRouterStrategy(strategyName);
        let routePlaceholderNode = document.querySelector('[data-route]');
        if (!routePlaceholderNode) throw 'can not run Route: element with data-route attribute not found';
        routePlaceholderNode.innerHTML = '';
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
