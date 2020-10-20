
function observe(data) {
    Object.keys(data).map(key=>{
        // value 作为 get,set 的闭包内变量。
        let value=data[key]

        if(typeof value=='object'){
            observe(value)
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

const obj={
    name:'libai',
    child:{
        name:'zahngsan',
        age:12,
        hobby:{
            type:'SWIMMING',
            level:'high'
        }
    }
}

observe(obj)

console.log('-------')

obj.child.name='coco'

console.log(obj.child.hobby.type)