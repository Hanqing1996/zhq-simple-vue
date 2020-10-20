export default class Watcher{
    constructor(node,key,callback) {
        this.node=node
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
    }
}