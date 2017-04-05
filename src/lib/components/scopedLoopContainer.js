
class ScopedLoopContainer extends Component {

    constructor(node,modelView){
        super(null,node,modelView,undefined);
        this.scopedDomFragments = [];
        this.lastFrafmentsLength = 0;
        this.node = node;
        this.parent = null;
    }

    _destroyFragment(index){
        let currFragment = this.scopedDomFragments[index];
        let removedFragment = this.scopedDomFragments.splice(index,1)[0];
        removedFragment.destroy();
        this.lastFrafmentsLength--;
    }

    run(eachItemName,indexName,iterableObjectName){

        this.eachItemName = eachItemName;
        this.indexName = indexName;

        this.anchor = document.createComment(`loop: ${eachItemName} in ${iterableObjectName}`);
        this.node.parentNode.insertBefore(this.anchor,this.node.nextSibling);
        this.node.remove();
        this.node = this.node.cloneNode(true);

        this.addWatcher(
            iterableObjectName,
            (newArr,oldArr)=>{
                this._processIterations(newArr,oldArr);
            });
    }

    _processIterations(newArr = [],oldArr){
        let currNodeInIteration = this.anchor;
        newArr.forEach((iterableItem,i)=>{

            if (!this.scopedDomFragments[i]) {

                let localModelView = {};
                localModelView[this.eachItemName] = iterableItem;
                if (this.indexName) localModelView[this.indexName] = i;

                let node = this.node.cloneNode(true);
                let scopedDomFragment = new ScopedDomFragment(node,localModelView);
                currNodeInIteration.parentNode.insertBefore(node,currNodeInIteration.nextSibling);
                scopedDomFragment.parent = this.parent;
                scopedDomFragment.parent.addChild(scopedDomFragment);

                new DirectiveEngine(scopedDomFragment).run();
                currNodeInIteration = node;
                this.scopedDomFragments.push(scopedDomFragment);
                this.lastFrafmentsLength++;

            } else {
                let localModelView = this.scopedDomFragments[i].modelView;
                localModelView[this.eachItemName] = iterableItem;
                if (this.indexName) localModelView[this.indexName] = i;
                this.scopedDomFragments[i].updateModelView(localModelView);

                currNodeInIteration = this.scopedDomFragments[i].node;
                this.scopedDomFragments[i].digest();
            }

        });

        if (this.lastFrafmentsLength>newArr.length) {
            let l = this.scopedDomFragments.length;
            for (let i=0,max=this.lastFrafmentsLength-newArr.length;i<max;i++) {
                this._destroyFragment(l-i-1);
            }
        }

    }

}
