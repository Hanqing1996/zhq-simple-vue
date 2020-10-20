export default function Observer(data) {
    Object.keys(data).map(key=>{
        // value 作为 get,set 的闭包内变量。
        let value=data[key]
        
        if(typeof value=='object'){
            Observer(value)
        }
        
        Object.defineProperty(data,key,{
            get() {
                console.log(`oh,you1 read the value of ${key}`);
                return value
            },
            set(newValue){
                console.log(`oh,you1 change the value of ${key}`);
                value=newValue
            },
            enumerable : true,
            configurable : true
        })
    })
}