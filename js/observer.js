import Watcher from "./watcher";

export default class Observer {
    constructor(data) {
        // 存储数据模板对应 key 的各个 watcher
        this.data=data
        this.watchers=undefined
        this.init(this.data)
    }
    
    init(data){
        this.watchers=this.watchers||[]
        Object.keys(data).map(key=>{
            // value 作为 get,set 的闭包内变量。
            let value=data[key]
        
            if(typeof value=='object'){
                this.init(value)
            }
        
            let that=this
            Object.defineProperty(data,key,{
                get() {
                    if(Watcher.target){
                        that.watchers.push(Watcher.target)
                        Watcher.target=null
                    }
                    console.log(`oh,you read the value of ${key}`);
                    return value
                },
                set(newValue){
                    console.log(`oh,you change the value of ${key} to ${newValue}`);
    
    
                    console.log(that.watchers);
    
                    const oldValue=value
                    value=newValue

                    that.watchers.map(watcher=>{
                        watcher.update(key,oldValue,newValue)
                    })
    
                },
                enumerable : true,
                configurable : true
            })
        })
    }
}


