
class PromiseLight{
    constructor(resolveFn){
        this.resolveFn = resolveFn;
        this.catchFn = null;
        this.chain = [];
        this.currentChainPointer = -1;
        this.lastResult = undefined;
        this.rejected = false;
        this.resolved = false;
        setTimeout(()=>{
            if (!this.isSecondary) PromiseLight._executeChain(this);
        },0)
    }
    static _executeChain(self){
        if (self.rejected || self.resolved) return;
        self.currentChainPointer++;
        let next = self.chain[self.currentChainPointer];
        if (!next) {
            RF.digest();
            return;
        }
        try {
            self.lastResult = next.fn(self.lastResult);
        } catch (e){
            self.rejectFn && self.rejectFn(e);
            return;
        }
        if (self.lastResult instanceof PromiseLight) {
            self.lastResult.isSecondary = true;
            let resolve = (data)=>{
                self.lastResult = data;
                PromiseLight._executeChain(self);
            };
            let reject = (data)=>{
                self.catchFn && self.catchFn(data);
                self.rejected = true;
            };
            self.lastResult.resolveFn(resolve,reject);
        } else {
            setTimeout(()=>{
                PromiseLight._executeChain(self);
            },0);
        }
    }

    then(fn){
        this.chain.push({fn:fn,resolved:false});
        return this;
    }

    catch(fn){
        this.catchFn = fn;
        return this;
    }

    static resolve(data){
        return new PromiseLight().then(()=>{return data});
    }

    static reject(data){
        return new PromiseLight().
        then(()=>{
            return new PromiseLight((resolve,reject)=>{
                reject(data);
            })
        });
    }

}