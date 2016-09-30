var x = 50;
var y = 50;
var r = 30;


$(document).ready(function(){

  //borders for paper
  var x_0 = 350;
  var y_0 = 10;
  var x_End = 600;
  var y_End = 600;

  g = new Graph();


  paper = Raphael(x_0, y_0, x_End, y_End);

  initOutline(x_End, y_End, paper);

  // var circle = addNewCircle(x, y, r, paper);

  var vertexVal = 1;

  var vertices = new Array();

  var vertMap = {};

  var mapToCircles = {};

  edgesFrom = {};

  //add Vertex button
  $("#wrap #left_col #input-group #addVertBtn").click( function() {

    var text = $("#wrap #left_col #input-group #vertTxt").val();

    if(text.length > 0 && text != null){
      vertices.push(addVert(text, vertexVal, paper, mapToCircles));
      //addVertex(text, vertexVal, paper);
      //addVert(text, vertexVal, paper);
      g.addVertex(text);
      vertMap[text] = g.getVertex(text);
      vertexVal++;
    }
  });

  //remove vertex button
  $("#wrap #left_col #removeVertDiv #removeBtn").click( function() {
      //TODO remove verticies and handle all repurcussions of this
      var vertToRemove = $('#wrap #left_col #removeVertDiv #removeSel').val();
      var label = $('#wrap #left_col #removeVertDiv #removeSel :selected').text();
    
      if(vertToRemove != null){
          removeVert(vertToRemove);
      }
  });


  //add edge button
  $("#wrap #left_col  #addEdgeDiv #addEdgeBtn").click( function() {
      //TODO add weights and draw connextions between nodes
      //var alphaNum= /[^0-9]/i;
      var weight = $("#wrap #left_col  #addEdgeDiv #edgeWeightTxt").val();
      if(weight != null && weight.length > 0 && !weight.match(/[^0-9]/i) ){

          var fromNode = $("#wrap #left_col  #addEdgeDiv #vertFromSel :selected").text();
          var toNode =  $("#wrap #left_col  #addEdgeDiv #vertToSel :selected").text();
          if(fromNode.localeCompare(toNode) != 0) {
            //pass to handler function
            //alert(weight + " " + fromNode + " "+ toNode);
            //addEdge(fromNode, toNode, weight, edgesFrom);
            var line = drawLine(mapToCircles[fromNode].attr("cx"), mapToCircles[fromNode].attr("cy"), mapToCircles[toNode].attr("cx"), mapToCircles[toNode].attr("cy"), paper, "black");
            addEdge(fromNode, toNode, weight, edgesFrom, line);
            g.addEdge(fromNode, toNode, weight);
            mapToCircles[fromNode].undrag();
            mapToCircles[toNode].undrag();
            line.toBack();
          } else {
            alert("edges must be made between two different nodes" + " " + fromNode + " "+ toNode);
          }
      } else {
        //TODO tell user to input num  with focus?
        alert("Enter number");
      }
  });

  $("#wrap #left_col #dijkstra #dijkstraBtn").click(function() {
    var src = $('#wrap #left_col #dijkstra #beginPath :selected').text();
    var dest = $('#wrap #left_col #dijkstra #endPath :selected').text();

    //var path = g.dijkstra(src, dest).concat([src]).reverse();

    console.log(g.dijkstra(src,dest));

    console.log(path);
    var path = g.dijkstra(src, dest);
    path.push(src);

   //if (src === dest) return;

    if (path.length >= 2) {
        var cur;
        for (var i = 0; i < path.length - 1; i++) {
            drawLine(mapToCircles[path[i]].attr("cx"), mapToCircles[path[i]].attr("cy"), mapToCircles[path[i+1]].attr("cx"), mapToCircles[path[i+1]].attr("cy"), paper, "green");
                   
        }
        //drawLine(mapToCirles[path[i-1]].attr("cx"), mapToCircles[path[i-1]].attr("cy"), mapToCircles[src].attr("cx"), path)
    } 
  });

});

function addVert(text, vertexVal, paper, map){

  $('#wrap #left_col #dijkstra #beginPath').append($('<option/>', {
    value: vertexVal,
    text: text
  }));

  $('#wrap #left_col #dijkstra #endPath').append($('<option/>', {
      value: vertexVal,
      text: text
    }));

  $('#wrap #left_col #removeVertDiv #removeSel').append($('<option/>', {
    value: vertexVal,
    text : text
  }));

  $('#wrap #left_col #addEdgeDiv #vertFromSel').append($('<option/>', {
    value: vertexVal,
    text : text
  }));

  $('#wrap #left_col #addEdgeDiv #vertToSel').append($('<option/>', {
    value: vertexVal,
    text : text
  }));

  //testing filling board with circles and drawing line
  if (x < 550){
    var circle = addNewCircle(x, y, r, paper);
    map[text] = circle;
    x += 125;
  }
  else if (y < 550){
    var circle = addNewCircle(x, y, r, paper);
    alert(text + " Type: " + typeof text);
    map[text] = circle;
    x = 50
    y += 125;
  } else {
    alert("Display full " + x + " " + y);
    drawLine(50, 50, 175, 300, paper, "green");
  }
  return circle;
}

function removeVert(vertToRemove){

  var rmRemoveSel = '#wrap #left_col #removeVertDiv #removeSel option[value=' + vertToRemove + ']';
  var rmRemoveFrom  = '#wrap #left_col #addEdgeDiv #vertFromSel option[value=' + vertToRemove + ']';
  var rmRemoveTo  = '#wrap #left_col #addEdgeDiv #vertToSel option[value=' + vertToRemove + ']';

  $(rmRemoveSel).remove();
  $(rmRemoveFrom).remove();
  $(rmRemoveTo).remove();

  //handle remove from tracked vertices
}

function addEdge(fromNode, toNode, weight, map, line){

  var selectString = fromNode + " --------- " + toNode;

  $('#wrap #left_col #selectDiv #vertListSel').append($('<option/>', {
    value: fromNode + toNode,
    text : selectString
  }));

  $('#wrap #left_col #selectDiv #edgeListSel').append($('<option/>', {
    value: fromNode + toNode,
    text : weight
  }));

  map[fromNode] = line;
  map[toNode] = line;

}

function Vertex() {
  this.neighbors = [];

  this.newVertex()
}

function initOutline(x_End, y_End, paper){
  drawLine(0, 0, x_End, 0, paper, "black");
  drawLine(x_End, 0, x_End, y_End, paper, "black");
  drawLine(0, y_End, x_End, y_End, paper, "black");
  drawLine(0, y_End, 0, 0, paper, "black");
}



function addNewCircle(x,y,r,paper){
  // Creates circle at x = 50, y = 40, with radius 10
  var circle = paper.circle(x, y, r);

  // Sets the fill attribute of the circle to red (#f00)
  circle.attr("fill", "#f00");

  //var circleSet = paper.set();
  //var label = paper.text(x,y, "label").attr({fill: 'white'});

  // Sets the stroke attribute of the circle to white
  circle.attr("stroke", "green");

  var start = function() {
    this.ox = this.attr("cx");
    this.oy = this.attr("cy");
  },
  move = function(dx,dy) {
    this.attr({cx:this.ox + dx, cy: this.oy + dy});
    this.attr({opacity: 0.5});
  },
  end = function() {
    this.attr({opacity: 1});
  }

  circle.drag(move, start, end);

  return circle;
}

function drawLine(x1, y1, x2, y2, paper, color) {
  //draw line with format "Mx1 y1Lx2 y2"
  //move to x1,y1, line to x2, y2
  var path_string = "M" + x1 + " " + y1 + "L" + x2 + " " + y2;

  var line = this.paper.path(path_string);
  line.attr("stroke", color);
  line.attr("stroke-width", 10);

  return line;
}

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

    this.getVertex = function(label) {
        if (this.vertices[label] != null) return this.vertices[label];
        else return;
    }

    this.getNeighbors = function(label) {
        if (this.vertices[label] === null) return;
        else return this.vertices[label];
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
