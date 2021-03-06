var id = 0;


var Node = function(parent) {
    this.id = id;
    this.incomingEdges = [];
    this.nodeInfo = {};
    this.dparent = null;
    this.dcost = null;
    id++ ;

    this.setDashedParent = function(dparent, dcost){
      this.dparent = dparent;
      this.dcost = dcost;
    }

}

Node.prototype.toString = function nodeToString() {
  return this.id
}

var Edge = function(cost, node1, node2) {
    this.cost = cost;
    this.nodes = [ node1, node2 ];
}

Edge.prototype.toString = function edgeToString() {
  return this.nodes[0] + '-(' + this.cost.toString() + ')-' + this.nodes[1]
}

var Path = function() {
    this.nodes = []
    this.edges = []
    this.id = id;
    id++;

    this.addNode = function(node) {
        this.nodes.push(node);
    };

    this.addEdge = function(edge) {
        this.edges.push(edge);
    };

    this.getEdgeIndex = function(node1, node2) {
      for(var i = 0; i < this.edges.length; i++)
      {
        if(this.edges[i].nodes[0].id === node1.id && this.edges[i].nodes[1].id === node2.id)
          return i
        if(this.edges[i].nodes[1].id === node1.id && this.edges[i].nodes[0].id === node2.id)
          return i
      }
      return -1
    }

    this.checkNode = function(node) {
      for(var i = 0; i < this.nodes.length; i++){
        if(this.nodes[i].id === node.id){
          return true;
        }
      }

      return false;
    };

    this.getIndex = function(node) {
      if(!node)
        return -1;
      for(var i = 0; i < this.nodes.length; i++){
        if(this.nodes[i].id === node.id){
          return i;
        }
      }

      return -1;
    };
}

Path.prototype.toString = function pathToString() {
  var ret = ''
  if(this.edges.length > 0) {
    for(var i=0; i < this.nodes.length - 1; i++){
      if(i ===0) {
        ret += this.nodes[i] + '-(' + this.edges[this.getEdgeIndex(this.nodes[i], this.nodes[i+1])].cost + ')-'
      }
      else {
        ret +=  this.nodes[i] + '-(' + this.edges[this.getEdgeIndex(this.nodes[i], this.nodes[i+1])].cost + ')-'
      }

    }
    return ret + this.nodes[this.nodes.length-1]
  }
  else {
    return this.nodes[0].toString()
  }
}

var PathCollection = function() {
  this.paths = [];
  this.graph = new Graph();
  this.layouter = null;
  this.renderer = null;
  this.canvasName = "";

  this.getIndex = function(path) {
    if(!path)
      return -1;
    for(var i = 0; i < this.paths.length; i++){
      if(this.paths[i].id === path.id){
        return i;
      }
    }

    return -1;
  };

  this.populateGraph = function () {
    this.graph = new Graph();
    for (var i = 0; i < this.paths.length; i++) {
        var nodes = this.paths[i].nodes;
        for (var j = 0; j < nodes.length; j++) {
            var node = nodes[j];
            this.graph.addNode(node.id);
        }
        var edges = this.paths[i].edges;
        for (var j = 0; j < edges.length; j++) {
            var edge = edges[j];
            this.graph.addEdge(edge.nodes[0].id, edge.nodes[1].id, {stroke: "#FE1B2E", directed: true, label: edge.cost})
        }
    }
  };

  this.drawPaths = function (i) {
    var d = document;
    this.populateGraph();

    var oldDiv = document.getElementById('canvas' + i);
      if (oldDiv) {
        d.body.removeChild(oldDiv);
    }

    var canvasName = 'canvas' + i;
    var canvasDiv = d.createElement("div");
    canvasDiv.className = "graph";
    canvasDiv.id = canvasName;
    this.canvasName = canvasName;
    d.body.appendChild(canvasDiv);

    this.layouter = new Graph.Layout.Spring(this.graph, this.graph.nodes);
    this.layouter.layout();

    this.renderer = new Graph.Renderer.Raphael(canvasName, this.graph, 800, 600);
    this.renderer.draw();
};

  this.redraw = function() {
    this.renderer.clear();
    this.populateGraph();
    this.renderer.graph = this.graph;
    this.layouter.graph = this.graph;
    this.layouter.layout();
    this.renderer.draw();
  }

  this.addPath = function(path) {
      this.paths.push(path);
      this.populateGraph();
  };

  this.path = function(node) {
    for(var i = 0; i < this.paths.length; i++){
      if(this.paths[i].checkNode(node))
        return this.paths[i];
    }

    return null;
  }

  this.head = function(path) {
    if(path.nodes.length != 0)
      return path.nodes[0]
    return null;
  }

  this.tail = function(path) {
    if(path.nodes.length != 0)
      return path.nodes[path.nodes.length - 1]
    return null;
  }

  this.before = function(node) {
    path = this.path(node);
    index = path.getIndex(node);
    if(index === 0)
      return null;
    return path.nodes[index - 1];
  }

  this.after = function(node) {
    path = this.path(node);
    index = path.getIndex(node);
    if(index === path.nodes.length - 1)
      return null;
    return path.nodes[index + 1];
  }

  this.pcost = function(node) {
    after_node = this.after(node);
    path = this.path(node)
    return path.edges[path.getEdgeIndex(node, after_node)].cost;
  }

  this.pmincost = function(path) {
    min_cost = 9007199254740992;  // INT.max
    min_vertex = null
    for(var i=0; i < path.edges.length; i++){
      cost = path.edges[i].cost
      if(cost < min_cost) {
        min_cost = cost;
        if(path.edges[i].nodes[1].id === this.after(path.edges[i].nodes[0]).id){
          min_vertex = path.edges[i].nodes[0]
        }
        else {
          min_vertex = path.edges[i].nodes[1]
        }
      }

    }
    return min_vertex
  }

  this.pupdate = function(path, x) {
    for(var i=0; i < path.edges.length; i++){
      path.edges[i].cost += x;
    }
  }

  this.reverse = function(path) {
    path.nodes.reverse();
  }

  this.concatenate = function(path1, path2, x) {
    new_edge = new Edge(x, this.tail(path1), this.head(path2));
    path1.nodes = path1.nodes.concat(path2.nodes);
    path1.edges = path1.edges.concat(path2.edges);
    path1.addEdge(new_edge)
    this.paths.splice(this.getIndex(path2), 1); // remove path2
    return path1;
  }

  this.split = function(node) {
    path = this.path(node);
    var path1, path2 ;

    if(node.id === this.head(path).id) {
      path1 = null;
      x = null
    }
    else {
      endIndex1 = path.getIndex(this.before(node))
      edgeIndex = path.getEdgeIndex(node, this.before(node))
      path1 = new Path()
      path1.nodes = path.nodes.slice(0, endIndex1 + 1)
      path1.edges = []
      for(var i=0; i < path1.nodes.length - 1; i++){
        for(var j=0; j < path.edges.length; j++){
          if(path.edges[j].nodes[0].id === path1.nodes[i].id && path.edges[j].nodes[1].id === path1.nodes[i+1].id){
            path1.edges.push(path.edges[j])
            break
          }

          if(path.edges[j].nodes[1].id === path1.nodes[i].id && path.edges[j].nodes[0].id === path1.nodes[i+1].id){
            path1.edges.push(path.edges[j])
            break
          }
        }
      }
      x = path.edges[edgeIndex].cost;
      path.edges.splice(edgeIndex, 1)
      this.paths.push(path1)
    }

    if(node.id === this.tail(path).id) {
      path2 = null;
      y = null;
    }
    else {
      startIndex2 = path.getIndex(this.after(node));
      edgeIndex = path.getEdgeIndex(node, this.after(node))
      path2 = new Path()
      path2.nodes = path.nodes.slice(startIndex2);
      path2.edges = [];
      for(var i=0; i < path2.nodes.length - 1; i++){
        for(var j=0; j < path.edges.length; j++){
          if(path.edges[j].nodes[0].id === path2.nodes[i].id && path.edges[j].nodes[1].id === path2.nodes[i+1].id){
            path2.edges.push(path.edges[j])
            break
          }

          if(path.edges[j].nodes[1].id === path2.nodes[i].id && path.edges[j].nodes[0].id === path2.nodes[i+1].id){
            path2.edges.push(path.edges[j])
            break
          }
        }
      }
      y = path.edges[edgeIndex].cost;
      path.edges.splice(edgeIndex, 1)
      this.paths.push(path2)
    }

    this.paths.splice(this.getIndex(path),1);
    path = new Path()
    path.addNode(node)
    this.paths.push(path)
    return [path1, path2, x, y]

  }

  this.splice = function(p) {
    v = this.tail(p).dparent
    var q, r, x, y;
    [q, r, x, y]= this.split(v)

    if(q != null) {
      console.log(q);
      this.tail(q).dparent = v;
      this.tail(q).dcost = x;

    }
    p = this.concatenate(p, this.path(v), this.tail(p).dcost)
    if(r === null) {

      return p;
    }
    else {
      return this.concatenate(p, r, y)
    }
  }

  this.expose = function(v) {
    var q, r, x, y ;
    [q, r, x, y] = this.split(v);
    if(q != null) {
      this.tail(q).dparent = v;
      this.tail(q).dcost = x;
    }
    if(r === null) {
      p = this.path(v);
    }
    else {
      p = this.concatenate(this.path(v), r, y)
    }

    while(this.tail(p).dparent != null) {
      p = this.splice(p)
    }
    return p;
  }

  this.nca = function(v, w) {
    nodes1 = this.expose(v).nodes
    nodes2 = this.expose(w).nodes
    for(i = nodes1.length - 1, j = nodes2.length - 1; i > -1 && j > -1 && nodes1[i].id === nodes2[j].id; i--, j--);
    return nodes1[i+1]
  }

  this.parent = function(v) {
    if(v.id === this.tail(this.path(v)).id)
      return v.dparent;
    else {
      return this.after(v);
    }
  }

  this.root = function(v) {
    return this.tail(this.expose(v))
  }

  this.cost = function(v) {
    if(v.id === this.tail(this.path(v)).id)
      return v.dcost;
    else {
      return this.pcost(v);
    }
  }

  this.mincost = function(v) {
    return this.pmincost(this.expose(v));
  }

  this.update = function(v, x) {
    this.pupdate(this.expose(v), x);
  }

  this.link = function(v, w, x) {
    this.concatenate(this.path(v), this.expose(w), x)
  }

  this.cut = function(v) {
    var p, q, x, y;
    this.expose(v);
    [p, q, x, y] = this.split(v);
    v.dparent = null
    return y
  }

  this.evert = function(v) {
    this.reverse(this.expose(v));
    v.dparent = null;
  }

}

var Tree = function () {
  this.rootNode = new Node(null);
  this.pathCollection = new PathCollection();
  this.nodes = [];
  this.edges = [];
  this.leaves = [];
  this.graph = new Graph();
  this.layouter = null;
  this.renderer = null;
  this.canvasName = "";

  this.buildTree = function (levels, maxdegree) {
    this.rootNode.nodeInfo = {
      level: levels,
      childIndex: -1
    };
    this.nodes.push(this.rootNode);
    this.buildTreeHelper(this.rootNode, levels, maxdegree);
    //Each edgeless node has a solid edge of 0
    for (var i = 0; i < this.nodes.length; i++){
      var path = new Path();
      path.addNode(this.nodes[i]);
      this.pathCollection.addPath(path);
    }
    console.log(this.pathCollection + '');
  };

  this.buildTreeHelper = function (rootNode, levels, maxdegree) {
    if (levels == 0) {
      this.leaves.push(rootNode);
      return;
    }
    //var numChildren = Math.ceil(Math.random() * maxdegree);
    var numChildren = maxdegree;
    for (var i = 0; i < numChildren; i++) {
      var child = new Node(null);
      child.setDashedParent(rootNode, 20);
      child.nodeInfo = {
        level: levels-1,
        childIndex: i
      };
      this.nodes.push(child);
      var childEdge = new Edge(20, rootNode, child);
      //incoming edges
      rootNode.incomingEdges.push(childEdge);
      this.edges.push(childEdge);
      this.buildTreeHelper(child, levels-1, maxdegree);
    }
  }

  this.setupGraph = function(i) {
    var d = document;
  
    var oldDiv = document.getElementById('canvas' + i);
      if (oldDiv) {
        d.body.removeChild(oldDiv);
    }
    this.drawGraph();

    var canvasName = 'canvas' + i;
    var canvasDiv = d.createElement("div");
    canvasDiv.className = "graph";
    canvasDiv.id = canvasName;
    this.canvasName = canvasName;
    d.body.appendChild(canvasDiv);

    this.layouter = new Graph.Layout.Ordered(this.graph, this.graph.nodes);
    this.layouter.layout();

    this.canvasName = canvasName;
    this.renderer = new Graph.Renderer.Raphael(canvasName, this.graph, 800, 600);
    this.renderer.draw();
  }

  //makes some of the red (dashed) paths green (solid
  //also makes shailpik's functions work??? I hope??
  this.splitTree = function() {
    /*
    var edge = this.edges[3];
    var edgeobj = this.graph.addEdge(edge.nodes[0].id, edge.nodes[1].id, {stroke: "#12F42E", "stroke-dasharray": "-", directed: true, label: edge.cost});
    console.log(edgeobj);
    this.redraw();
    */
    for (var i = 0; i < this.nodes.length; i++) {
      var node = this.nodes[i];
      //console.log(node);
      if (node.incomingEdges.length > 0) {
        var selectedEdgeIndex = Math.floor(Math.random() * (node.incomingEdges.length));
        var selectedEdge = node.incomingEdges[selectedEdgeIndex];
        var prevNode = selectedEdge.nodes[0];
        //check if new pach can connect to head of existing path
        var pathContainingNode = this.pathCollection.path(prevNode);
        // console.log(pathContainingNode);

        if (pathContainingNode && this.pathCollection.tail(pathContainingNode) == prevNode) {
          //add the node
          pathContainingNode.addNode(prevNode);
          pathContainingNode.addEdge(selectedEdge);
        }
      }
    }
  }

  this.redraw = function() {
    this.drawGraph();
    this.renderer.clear();
    
    this.layouter.graph = this.graph;
    this.layouter.layout();
    
    for (var i = 0; i < this.graph.nodes.length; i++){
      var node = this.graph.nodes[i];
      node.shape = null;
    }
    this.renderer.graph = this.graph;
    this.renderer.draw();
    
  }

  this.drawGraph = function() {
    this.graph = new Graph();
    var nodes = this.nodes;
      for (var j = 0; j < nodes.length; j++) {
        var node = nodes[j];
        this.graph.addNode(node.id, node.nodeInfo);
      }
    var edges = this.edges;
    var solidEdges = [];
    for (var j = 0; j < edges.length; j++) {
        var edge = edges[j];
        this.pathCollection.paths.forEach((path) => {
            if (path.getEdgeIndex(edge.nodes[0], edge.nodes[1]) >= 0) {
              solidEdges.push(edge);
              return;
            }
        });
    }
    
    edges.forEach((edge) => {
        var isSolid = false;
        solidEdges.forEach((solid) => {
          if (solid === edge) {
            isSolid = true;
          }
        });
        if (!isSolid) {
            this.graph.addEdge(edge.nodes[0].id, edge.nodes[1].id, {stroke: "#FE1B2E", "stroke-dasharray": "-", directed: true, label: edge.cost});
        }
    });

    solidEdges.forEach((edge) => {
        this.graph.addEdge(edge.nodes[0].id, edge.nodes[1].id, {stroke: "#00FF99", "stroke-dasharray": "-", directed: true, label: edge.cost})
    });

  }
}

PathCollection.prototype.toString = function pathCollectionToString() {
  ret = ''
  for(var i=0; i < this.paths.length; i++){
    ret += this.paths[i] +'\n'
  }
  return ret
}
