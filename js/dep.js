
let uid = 0;

export default function Dep() {
    this.id = uid++;
    this.subs = [];
}

Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },
    
    removeSub: function(sub) {
        let index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    },
    
    notify: function(key,oldValue,newValue) {
        this.subs.forEach(function(sub) {
            sub.update(key,oldValue,newValue);
        });
    }
};

Dep.target = null;

