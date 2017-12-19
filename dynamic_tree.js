var id = 0;

var Node = function(parent) {
    this.parent = parent
    this.parentEdge = null
    this.id = id;
    id++ ;
    this.setEdge = function(edge) {
      this.parentEdge = edge;
    }
}

var Edge = function(cost, node1, node2) {
    this.cost = cost;
    this.nodes = [ node1, node2 ]
}

var Path = function() {
    this.nodes = []
    this.id = id;
    id++;
    this.addNode = function(node) {
        this.nodes.push(node);
    };

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
    return node.parent;
  }

  this.after = function(node) {
    curr_path = this.path(node);
    if(node.id === curr_path.nodes[curr_path.nodes.length - 1].id)
      return null;
    for(var i=0; i < curr_path.nodes.length; i++){
      if(node.id === curr_path.nodes[i].id)
        return curr_path.nodes[i + 1];
    }

    return null;
  }

  this.pcost = function(node) {
    after_node = this.after(node);
    return after_node.parentEdge.cost;
  }

  this.pmincost = function(path) {
    min_cost = 9007199254740992;  // INT.max
    for(var i=0; i < path.nodes.length; i++){
      if(path.nodes[i].parentEdge){
        cost = path.nodes[i].parentEdge.cost
        if(cost < min_cost)
          min_cost = cost;
      }
    }
    return min_cost
  }

  this.pupdate = function(path, x) {
    for(var i=0; i < path.nodes.length; i++){
      if(path.nodes[i].parentEdge){
        path.nodes[i].parentEdge.cost += x;
      }
    }
  }

  this.reverse = function(path) {
    for(var i=0; i < path.nodes.length - 1; i++){
      path.nodes[i].parentEdge = path.nodes[i + 1].parentEdge
      path.nodes[i].parent = path.nodes[i + 1]
    }
    path.nodes[path.nodes.length - 1].parent = null
    path.nodes[path.nodes.length - 1].parentEdge = null
    path.nodes.reverse();
  }

  this.concatenate = function(path1, path2, x) {
    new_edge = new Edge(x, this.tail(path1), this.head(path2));
    this.head(path2).setEdge(new_edge);
    this.head(path2).parent = this.tail(path1);
    path1.nodes = path1.nodes.concat(path2.nodes);
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
      path1 = new Path()
      path1.nodes = path.nodes.slice(0, endIndex1 + 1)
      x = node.parentEdge.cost;
      this.paths.push(path1)
    }

    if(node.id == this.tail(path).id) {
      path2 = null;
      y = null;
    }
    else {
      startIndex2 = path.getIndex(this.after(node));
      path2 = new Path()
      path2.nodes = path.nodes.slice(startIndex2);
      y = this.after(node).parentEdge.cost;
      path2.nodes[0].parent = null
      path2.nodes[0].parentEdge = null;
      this.paths.push(path2)
    }

    this.paths.splice(this.getIndex(path),1);
    return [path1, path2, x, y]

  }

}
