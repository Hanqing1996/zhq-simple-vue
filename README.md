实际上，之前我对 vue 的双向绑定已有一些了解，见[vue-binding](https://github.com/Hanqing1996/vue-binding)。

但是我觉得深入一个新框架的最好办法还是造轮子。

所以我打算像[zhq-simple-react](https://github.com/Hanqing1996/zhq-simple-react),[zhq-simple-redux](https://github.com/Hanqing1996/zhq-simple-redux)一样，通过需求驱动开发，逐步搭建一个简易的 vue-like 框架。

#### 实现对象监听
需求：实现一个 observe 函数，用于对象属性的读写监听
```js
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
```js
// index.js
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

#### 模板节点数据绑定
需求：
1. 查询模板中哪些节点要做数据绑定
2. 对要做数据绑定的节点，指定初始值，以渲染视图
```html
<div id="app">
    <h2>{{title}}</h2>
    <h1>{{name}}</h1>
</div>
<script type="text/javascript">
    const data={
        title:'newHeadline',
        name:'libai'
    }

    const root="#app"

    // 指定要去查找节点root下哪些数据节点要做绑定，并提供这些数据初始值
    binding(data,root)
</script>
```
我们要实现的，就是 binding 的细节
```html
<script type="text/javascript">
    // 去查询root节点下要做数据绑定的节点
    function binding(data,root) {
        let rootNode=document.querySelector(root)

        let fragment=nodeToFragment(rootNode)
        findNode(fragment)
        rootNode.appendChild(fragment)
    }


    function findNode(rootNode) {
        Array.from(rootNode.childNodes).map(node=>{

            const reg = /\{\{\s*(.*?)\s*\}\}/;
            const text = node.textContent;

            // node 的后代节点有需要绑定的部分，才继续遍历，这实际上是做了一个剪枝
            if(reg.test(text)&&node.childNodes.length>0){
                findNode(node)
            }

            if(node.nodeType===3&&reg.test(text)){
                const key=reg.exec(text)[1]
                node.textContent=data[key]
            }
        })
    }

    function nodeToFragment(el) {
        let fragment = document.createDocumentFragment();
        let child = el.firstChild;
        while (child) {
            // 将Dom元素移入fragment中
            fragment.appendChild(child);
            child = el.firstChild
        }
        return fragment;
    }


    const data={
        title:'newHeadline',
        name:'libai'
    }

    const root="#app"

    binding(data,root)
</script>
```











