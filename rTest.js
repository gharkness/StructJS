var x = 50;
var y = 50;
var r = 30;


$(document).ready(function(){

  //borders for paper
  var x_0 = 350;
  var y_0 = 10;
  var x_End = 600;
  var y_End = 600;

  var g = new Graph();


  var paper = Raphael(x_0, y_0, x_End, y_End);

  initOutline(x_End, y_End, paper);

  // var circle = addNewCircle(x, y, r, paper);

  var vertexVal = 1;

  var vertices = new Array();

  //add Vertex button
  $("#wrap #left_col #input-group #addVertBtn").click( function() {

    var text = $("#wrap #left_col #input-group #vertTxt").val();

    //alert(text);

    if(text.length > 0 && text != null){
      vertices.push(addVert(text, vertexVal, paper));
      //g.addVertex(text);
      vertexVal++;
    }
  });

  //remove vertex button
  $("#wrap #left_col #removeVertDiv #removeBtn").click( function() {
      //TODO remove verticies and handle all repurcussions of this
      var vertToRemove = $('#wrap #left_col #removeVertDiv #removeSel').val();
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
          if(fromNode != toNode) {
            //pass to handler function
            alert(weight + " " + fromNode + " "+ toNode);
          } else {
            alert("edges must be made between two different nodes" + " " + fromNode + " "+ toNode);
          }
      } else {
        //TODO tell user to input num  with focus?
        alert("Enter number");
      }
  });

});

function addVert(text, vertexVal, paper){
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

  // $('#wrap #left_col #selectDiv #vertListSel').append($('<option/>', {
  //   value: vertexVal,
  //   text : text
  // }));

  //testing filling board with circles and drawing line
  if (x < 550){
    var circle = addNewCircle(x, y, r, paper);
    x += 125;
  }
  else if (y < 550){
    var circle = addNewCircle(x, y, r, paper);
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

function addEdge(fromNode, toNode, weight){


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

  // Sets the stroke attribute of the circle to white
  circle.attr("stroke", "green");

  return circle;
}

function drawLine(x1, y1, x2, y2, paper, color) {
  //draw line with format "Mx1 y1Lx2 y2"
  //move to x1,y1, line to x2, y2
  var path_string = "M" + x1 + " " + y1 + "L" + x2 + " " + y2;

  var line = paper.path(path_string);
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
