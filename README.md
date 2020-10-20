实际上，之前我对 vue 的双向绑定已有一些了解，见[vue-binding](https://github.com/Hanqing1996/vue-binding)。

但是我觉得深入一个新框架的最好办法还是造轮子。

所以我打算像[zhq-simple-react](https://github.com/Hanqing1996/zhq-simple-react),[zhq-simple-redux](https://github.com/Hanqing1996/zhq-simple-redux)一样，通过需求驱动开发，逐步搭建一个简易的 vue-like 框架。

#### 实现对象监听
需求：实现一个 observe 函数，用于对象属性的读写监听
```
const obj={
    name:'libai',
    child:{
        name:'zahngsan',
        age:12
    }
}

observe(obj)

console.log(obj.name); // 打印"oh,you1 read the value of name"

obj.child.age=18 // 打印"oh,you1 change the value of child.age"
```
解决方法：递归监听对象子属性即可
```

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
```