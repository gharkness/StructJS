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

function Graph() {

    var infinity = Number.POSITIVE_INFINITY;

    this.vertices = {};

    this.addVertex = function(label, edgeSet) {
        if (edgeSet == null) {
            this.vertices[label] = {};
        } else {
            this.vertices[label] = edgeSet;
        }
    }

    this.addEdge = function(from,to,weight) {
        if (from in this.vertices) {
            this.vertices[from][to] = weight;
        } else return;

        if (to in this.vertices) {
            this.vertices[to][from] = weight;
        } else return;

        if (weight < 0) return;
    }

    this.dijkstra = function(beginVert,endVert) {
        var vertexQueue = new PriorityQueue()
        var curDistances = {}
        var prev = {}
        var curPath = []
        var curSmallest, vertex, neighbor, alt;

        for (vertex in this.vertices) {
            if (vertex === beginVert) {
                curDistances[vertex] = 0;
                vertexQueue.enqueue(0, vertex);
            } else {
                curDistances[vertex] = infinity;
                vertexQueue.enqueue(infinity, vertex);
            }

            prev[vertex] = null;
        }

        while (!vertexQueue.isEmpty()) {
            curSmallest = vertexQueue.dequeue();

            if (curSmallest === endVert) {
                while (prev[curSmallest]) {
                    curPath.push(curSmallest);
                    curSmallest = prev[curSmallest];
                }
                break;
            }

            if (!curSmallest || (curDistances[curSmallest] === infinity)) {
                continue;
            }

            for (neighbor in this.vertices[curSmallest]) {
                alt = curDistances[curSmallest] + this.vertices[curSmallest][neighbor];

                if (alt < curDistances[neighbor]) {
                    curDistances[neighbor] = alt;
                    prev[neighbor] = curSmallest;

                    vertexQueue.enqueue(alt, neighbor);
                }
            }
        }
        return curPath;
    }
}

var g = new Graph();

g.addVertex('A', {B: 7, C: 8});
g.addVertex('B', {A: 7, F: 2});
g.addVertex('C', {A: 8, F: 6, G: 4});
g.addVertex('D', {F: 8});
g.addVertex('E', {H: 1});
g.addVertex('F', {B: 2, C: 6, D: 8, G: 9, H: 3});
g.addVertex('G', {C: 4, F: 9});
g.addVertex('H', {E: 1, F: 3});

// Log test, with the addition of reversing the path and prepending the first node so it's more readable
console.log(g.dijkstra('A', 'H').concat(['A']).reverse());
