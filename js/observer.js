import Watcher from "./watcher";
import Dep from "./dep";

export default class Observer {
    constructor(data) {
        // 存储数据模板对应 key 的各个 watcher
        this.data=data
        this.init(this.data)
    }
    
    init(data){
        let dep=new Dep()
        Object.keys(data).map(key=>{
            // value 作为 get,set 的闭包内变量。
            let value=data[key]
        
            if(typeof value=='object'){
                this.init(value)
            }
        
            let that=this
            Object.defineProperty(data,key,{
                get() {
                    
                    Dep.target && dep.addSub(Dep.target)
                    
                    console.log(`oh,you read the value of ${key}`);
                    return value
                },
                set(newValue){
                    console.log(`oh,you change the value of ${key} to ${newValue}`);
                    console.log(dep.subs);
    
                    const oldValue=value
                    value=newValue
    
                    // dep.subs.map(watcher=>{
                    //     watcher.update(key,oldValue,newValue)
                    // })
                    dep.notify(key,oldValue,value)
                },
                enumerable : true,
                configurable : true
            })
        })
    }
}


