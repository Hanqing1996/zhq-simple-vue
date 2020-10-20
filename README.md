实际上，之前我对 vue 的双向绑定已有一些了解，见[vue-binding](https://github.com/Hanqing1996/vue-binding)。

但是我觉得深入一个新框架的最好办法还是造轮子。

所以我打算像[zhq-simple-react](https://github.com/Hanqing1996/zhq-simple-react),[zhq-simple-redux](https://github.com/Hanqing1996/zhq-simple-redux)一样，通过需求驱动开发，逐步搭建一个简易的 vue-like 框架。


* Observer
> 监听指定对象的属性读写
* Compile
> 查找模板中要绑定数据的节点，并根据初始值渲染视图
* Watcher
> 即所谓"订阅者"。模板中一个需要绑定的节点:形如 <div>{{xxx}}</div> 就对应一个 watcher 实例。用于指定节点数据更新后，要执行的操作(最常见：渲染对应节点内容)。 可以说， Watcher 是"内存数据更新后同步更新视图"的保证。
* Dep
> 负责收集订阅者，暂不实现


#### 整体流程梳理
> 以下的 root,data 皆由我们提供
1. Compile 负责查找模板中 root 下需要绑定数据的节点，并根据 data 渲染视图
2. Observer 劫持 data 的属性读写权限，并在1的"根据初始值渲染视图"步骤收集各个订阅者（Watcher 实例），放入 Observer 实例的 watchers
3. 我们修改 data 的属性值后，就会触发对应 watcher 实例去执行回调

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
// compile.js
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

#### 内存数据（data[key]）更新后渲染视图
需求:
1. 绑定 node 与对应 key,这样才知道 data[key] 变化后要更新哪个视图上的节点 
2. 要求**对于不同的 data[key] 变化,触发不同的回调函数**，这意味着每个<node,key>要有自己独立的 callback。我们可以通过构造 Watcher 类来实现，不同的 Watcher 实例存储不同 key 变化后的 callback。
3. 由于我们之前已经设置过，让 Observer 监听属性的变化，所以我们可以在对应 key 变化后调用对应 Watcher 的 callback。
4. 要做到3，前提是 Observer 记录着所有 watcher


#### React 和 Vue 的不同
至此，我已经极为初步地完成了一个最简单地 react-like 框架和 vue-like 框架。现在来比较一下它们的异同。

* 初始视图的渲染

| React                                                        | Vue                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 初始视图的渲染，就是各个组件逐步挂载到根节点上去的过程。 首先，ReactDOM.render 将 jsx 的编译结果（一棵 vnode 树）由上至下进行遍历，将 vnode 转化成对应真实DOM节点（遇到 vnode.tag 为 function 类型，则生成组件对应真实DOM节点），然后由底层至上层不断挂载节点，最终形成一个完整的DOM树。在此过程中，内存数据作为 props 自然而然地转化成了节点的文本内容。 | 不用 jsx。一开始是一个完整的HTML模板。调用 Compile 查找模板中有哪些需要作数据绑定的节点，然后修改节点文本内容为给定初始值。 |

* 内存数据更新，如何引起视图对应更新

| React                                                        | Vue                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 内存数据的更新，在 React 中表现为一个组件实例的 state 发生变化，且唯一变化方式是调用 setState()。该函数会引发组件实例对应 Vnode 发生变化，我们将 Vnode 与旧的DOM操作进行 diff，自上而下一直查找到发生变化的最小DOM节点，进行内容替换。 | 内存数据的更新，在 Vue 中表现为`data.xxx=...`的操作。 由于在初始视图的渲染过程中，我们就建立了含数据DOM节点与对应 callback 的映射关系（各个 watcher）。因此，在 data[key] 更新后，我们只需保证key 对应 callback 会执行就可以了。得益于 `Object.defineProperty`,我们可以在 data[key] 进行写操作时触发 callback。 |





在内存更新后，如何更新视图？对于这个问题，React 和 Vue 给出了两种思路：

* React

建立与真实DOM相对应的 Vnode 树。那么每次数据更新，也就是 Vnode 更新后，都只要比较发生变化的 Vnode 和 真实DOM树的差异（不是从 #root 比较哦），就知道哪些真实DOM节点的哪些部分要更新内容了。

* Vue

直接建立数据绑定节点和对应 callback 的映射关系。那么每次内存更新，只要调用对应 callback 即可。这里也存在优化的点，比如一个`data[key]`写操作，是会唤起所有 watcher 执行对应操作的。






最小开放原则