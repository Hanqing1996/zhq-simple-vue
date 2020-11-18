import Dep from "./dep";

export default class Watcher{
    constructor(vm,key,callback) {
        this.vm=vm
        this.key=key
        this.callback=callback
        this.get()
    }
    update(key,oldValue,newValue){
        if(key===this.key&&newValue!==oldValue){
            this.callback(newValue)
        }
    }
    get(){
        Dep.target = this;
        let value = this.vm[this.key];	// 这里会触发属性的getter，从而添加订阅者
        Dep.target = null;
    }
}