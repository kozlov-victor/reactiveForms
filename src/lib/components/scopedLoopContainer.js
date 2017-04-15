
class ScopedLoopContainer extends Component {

    constructor(node,modelView){
        super(null,node,modelView);

        if (node.getAttribute('data-for'))
            throw `can not use "data-for" attribute at component directly. Use this directive at parent node`;

        this.scopedDomFragments = [];
        this.lastFrafmentsLength = 0;
        this.node = node;
        this.parent = null;
    }

    _destroyFragment(index){
        let removedFragment = this.scopedDomFragments.splice(index,1)[0];
        removedFragment.destroy();
        this.lastFrafmentsLength--;
    }

    run(eachItemName,indexName,iterableObjectName){

        this.eachItemName = eachItemName;
        this.indexName = indexName;

        this.anchor = document.createComment(`component-id: ${this.id}; loop: ${eachItemName} in ${iterableObjectName}`);
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

        console.log('newArr',newArr);

        let currNodeInIteration = this.anchor;
        newArr.forEach((iterableItem,i)=>{

            if (!this.scopedDomFragments[i]) {

                let props = {};
                props[this.eachItemName] = iterableItem;
                if (this.indexName) props[this.indexName] = i;
                let localModelView = new ModelView(this.indexName,props);

                let node = this.node.cloneNode(true);
                let scopedDomFragment = new ScopedDomFragment(node,localModelView);
                // todo Cannot read property 'insertBefore' of null
                console.log('created new fragment in loop',scopedDomFragment);
                currNodeInIteration.parentNode.insertBefore(node,currNodeInIteration.nextSibling);
                console.log('currNodeInIteration',currNodeInIteration);
                console.log('appended node',node);
                scopedDomFragment.parent = this.parent;
                scopedDomFragment.parent.addChild(scopedDomFragment);

                scopedDomFragment.run();
                currNodeInIteration = node;
                this.scopedDomFragments.push(scopedDomFragment);
                this.lastFrafmentsLength++;

            } else {

                let localModelView = this.scopedDomFragments[i].modelView;
                localModelView[this.eachItemName] = iterableItem;
                if (this.indexName) localModelView[this.indexName] = i;

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
