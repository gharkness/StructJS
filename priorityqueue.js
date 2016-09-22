function PriorityQueue() {
  this.nodes = [];

  this.enqueue = function(priority, key) {
    this.nodes.push({priority: priority, key:key});
    this.sort();
  }

  this.dequeue = function() {
    var len = this.nodes.length;
    var ret;
    if (len <= 0){
      return undefined;
    }
    else if(len == 1){
      //clear the queue if it only contains one element
      this.nodes = [];
    } else {
        ret = this.nodes.shift().key;
    }
    return ret;
  }

  this.sort = function() {
    this.nodes.sort(function(a,b){return a.priority - b.priority});
  }

  this.isEmpty = function() {
    return !this.nodes.length;
  }

}

/*
var pqueue = new PriorityQueue();

pqueue.enqueue(4, "four");
pqueue.enqueue(3, "three");
pqueue.enqueue(2, "two");
pqueue.enqueue(1, "one");

for(var i = 0; i < pqueue.nodes.length; i++){
  console.log(pqueue.nodes[i]);
}

pqueue.dequeue();
pqueue.enqueue(2.5, "two.five");

for(var i = 0; i < pqueue.nodes.length; i++){
  console.log(pqueue.nodes[i]);
}
*/
