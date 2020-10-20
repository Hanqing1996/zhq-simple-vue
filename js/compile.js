import Observer from './observer'
import Watcher from "./watcher";

// 去查询root节点下要做数据绑定的节点
export default class Compile{
    
    constructor(data,root){
        this.data=data
        this.root=root

        this.init()
    }
    
    // 进行数模板数据绑定
    init(){
        let rootNode=document.querySelector(this.root)
        let fragment=this.nodeToFragment(rootNode)
        new Observer(this.data)
        this.findNode(fragment)
        rootNode.appendChild(fragment)
    }
    
    // 递归查找带有{{}}的子节点
    findNode(rootNode){
        Array.from(rootNode.childNodes).map(node=>{
        
            const reg = /\{\{\s*(.*?)\s*\}\}/;
            const text = node.textContent;
        
            // node 的后代节点有需要绑定的部分，才继续遍历，这实际上是做了一个剪枝
            if(reg.test(text)&&node.childNodes.length>0){
                this.findNode(node)
            }
        
            if(node.nodeType===3&&reg.test(text)){
                const key=reg.exec(text)[1]
                node.textContent=this.data[key] // 触发 Observer 监听对象的 get 函数
    
                new Watcher(node,key,(newValue)=>{
                    console.log(`callback for ${key} is executing`)
                    console.log(node);
                    node.textContent=newValue
                })

            }
        })
    }
    
    // 将元素转移到 fragment 下
    nodeToFragment(el) {
        let fragment = document.createDocumentFragment();
        let child = el.firstChild;
        while (child) {
            // 将Dom元素移入fragment中
            fragment.appendChild(child);
            child = el.firstChild
        }
        return fragment;
    }
    
}




