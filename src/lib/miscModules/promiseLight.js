
/**
 * v 1.0.0
 */

export default class PromiseLight{
    constructor(resolveFn){
        this.resolveFn = resolveFn;
        this.catchFn = null;
        this.chain = [{fn:resolveFn}];
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

        let resolve = (data)=>{
            self.lastResult = data;
            PromiseLight._executeChain(self);
        };
        let reject = (data)=>{
            self.catchFn && self.catchFn(data);
            self.rejected = true;
        };

        if (self.currentChainPointer==0){
            if (self.resolveFn) {
                self.resolveFn(resolve,reject);
                return;
            } else {
                self.chain.shift();
            }
        }


        let next = self.chain[self.currentChainPointer];
        if (!next) {
            if (!self.isSecondary) {
                clearTimeout(PromiseLight._resolve_tid);
                PromiseLight._resolve_tid = setTimeout(()=>{
                    RF.digest();
                },100);
            }
            return;
        }
        try {
            self.lastResult = next.fn(self.lastResult);
        } catch (e){
            if (self.rejectFn) {
                self.rejectFn(e);
            } else {
                console.error(e);
            }
            return;
        }
        if (self.lastResult instanceof PromiseLight) {
            self.lastResult.isSecondary = true;
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

PromiseLight._resolve_tid = null;