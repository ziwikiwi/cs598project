var id = 0;

var Node = function(parent) {
    this.id = id;
    dparent = null;
    dcost = null;
    id++ ;
}

var Edge = function(cost, node1, node2) {
    this.cost = cost;
    this.nodes = [ node1, node2 ]
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

var PathCollection = function() {
  this.paths = []

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

  this.addPath = function(path) {
      this.paths.push(path);
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
    for(var i=0; i < path.edges.length; i++){
      cost = path.edges[i].cost
      if(cost < min_cost)
        min_cost = cost;
    }
    return min_cost
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
    if(node.id == this.head(path).id) {
      path1 = null;
      x = null
    }
    else {
      endIndex1 = path.getIndex(this.before(node))
      edgeIndex = path.getEdgeIndex(node, this.before(node))
      path1 = new Path()
      path1.nodes = path.nodes.slice(0, endIndex1 + 1)
      path1.edges = path.edges.slice(0, edgeIndex -1)
      x = path.edges[edgeIndex].cost;
      path.edges.splice(edgeIndex, 1)
      this.paths.push(path1)
    }

    if(node.id == this.tail(path).id) {
      path2 = null;
      y = null;
    }
    else {
      startIndex2 = path.getIndex(this.after(node));
      edgeIndex = path.getEdgeIndex(node, this.after(node))
      path2 = new Path()
      path2.nodes = path.nodes.slice(startIndex2);
      path2.edges = path.edges.slice(edgeIndex + 1);
      y = path.edges[edgeIndex].cost;
      path.edges.splice(edgeIndex, 1)
      this.paths.push(path2)
    }

    this.paths.splice(this.getIndex(path),1);
    return [path1, path2, x, y]

  }

  this.splice = function(p) {
    v = this.tail(p).dparent
    var q, r, x, y;
    [q, r, x, y]= this.split(v)
    if(!q) {
      this.tail(q).dparent = v;
      this.tail(q).dcost = x;
    }
    p = this.concatenate(p, this.path(v), this.tail(p).dcost)
    if(!r)
      return p;
    else {
      return this.concatenate(p, r, y)
    }
  }

  this.expose = function(v) {
    var q, r, x, y ;
    [q, r, x, y] = this.split(v);
    if(!q) {
      this.tail(q).dparent = v;
      this.tail(q).dcost = x;
    }
    if(!r)
      p = this.path(v);
    else {
      p = this.concatenate(this.path(v), r, y)
    }
    while(!this.tail(p).dparent) {
      p = this.splice(p)
    }
    return p;
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
    v.dparent = null
  }

}
