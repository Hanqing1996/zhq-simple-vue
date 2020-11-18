import Compile from './compile'
const data={
    title:'newHeadline',
    name:'libai'
}

const root="#app"
new Compile(data,root)
data.title='changedTitle'
data.name='zhangfei'