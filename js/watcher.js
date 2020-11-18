export default class Watcher{
    constructor(vm,key,callback) {
        this.vm=vm
        this.key=key
        this.callback=callback
        this.init()
    }
    update(key,oldValue,newValue){
        if(key===this.key&&newValue!==oldValue){
            this.callback(newValue)
        }
    }
    init(){
        
        
        // 让原型挂载当前实例
        Watcher.target=this
        let value=this.vm[this.key]
    }
}