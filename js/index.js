import Compile from './compile'

const data={
    title:'newHeadline',
    name:'libai'
}

const root="#app"

new Compile(data,root)

console.log(data.name);
data.title='hhh'