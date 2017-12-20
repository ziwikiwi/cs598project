var flow_id = 1;

var GraphNode = function() {
    this.id = flow_id;
    this.inEdges = [];
    this.outEdges = [];
    flow_id++ ;
}

var GraphEdge = function(cost, u, v) {
    this.cost = cost;
    this.u = u;
    this.v = v;
    u.outEdges.push(this);
    v.inEdges.push(this)
}

var FlowGraph = function() {
  this.nodes = []
  this.edges = []

  this.addEdge = function(cost, u, v){
    edge = new GraphEdge(cost, u, v)
    this.edges.push(edge)
    return edge
  }

  this.addNode = function(){
    node = new GraphNode()
    this.nodes.push(node)
    return node
  }

  this.deleteEdge = function(u, v){
    this.edges.splice(this.getEdgeIndex(u, v), 1)
  }

  this.getEdgeIndex = function(u, v){
    for(var i=0; i < this.edges.length; i++){
      if(this.edges[i].u.id === u.id && this.edges[i].v.id === v.id)
        break
    }
    return i;
  }


  this.printGraph = function(){
    ret = ''
    for(var i = 0; i < this.edges.length; i++){
      ret += this.edges[i].u.id + '-(' + this.edges[i].cost + ')-' + this.edges[i].v.id +'\n';
    }
    return ret;
  }
}


var flowg = new FlowGraph()
var f1 = flowg.addNode();
var f2 = flowg.addNode();
var f3 = flowg.addNode();
var f4 = flowg.addNode();
var f5 = flowg.addNode();
var f6 = flowg.addNode();
var fe1 = flowg.addEdge(3, f1, f2)
var fe2 = flowg.addEdge(3, f1, f6)
var fe3 = flowg.addEdge(3, f2, f3)
var fe4 = flowg.addEdge(2, f2, f6)
var fe5 = flowg.addEdge(2, f6, f5)
var fe6 = flowg.addEdge(4, f3, f5)
var fe7 = flowg.addEdge(2, f3, f4)
var fe8 = flowg.addEdge(3, f5, f4)
capacity = []
flow = []
for(var i=0; i < flowg.edges.length; i++){
  capacity.push(flowg.edges[i].cost)
}
for(var i=0; i < flowg.edges.length; i++){
  flow.push(0)
}
console.log(flowg.printGraph())
flow_to_node = {}
node_to_flow = {}
forest = new PathCollection()
for(var i=0; i< flowg.nodes.length; i++){
  flow_to_node[flowg.nodes[i].id] = new Node(null)
  node_to_flow[flow_to_node[flowg.nodes[i].id].id] = flowg.nodes[i]
  var path = new Path()
  path.addNode(flow_to_node[flowg.nodes[i].id])
  forest.addPath(path)
}
s = f1
t = f4
console.log(capacity)

var maxFlow = function(){
  stop = false
  while(!stop){
    v = forest.root(flow_to_node[s.id])
    if(v.id === flow_to_node[t.id]){
      v = forest.mincost(flow_to_node[s.id])
      c = forest.cost(v)
      forest.update(flow_to_node[s.id], -1 * c)
      v = forest.mincost(flow_to_node[s.id])
      while(cost(v) === 0){
        index = flowg.getEdgeIndex(node_to_flow[v.id], node_to_flow[forest.parent(v).id])
        flowg.deleteEdge(node_to_flow[v.id], node_to_flow[forest.parent(v).id])
        forest.cut(v)
        flow[index] = 0
        v = forest.mincost(flow_to_node[s.id])
      }
      continue;
    }else{
      if(node_to_flow[v.id].outEdges.length === 0){
        if(node_to_flow[v.id].id === s.id){
          for(var i=0; i < forest.paths; i++){
            for(var j=0; j< forest.paths[i].nodes; j++){
              if(parent(forest.paths[i])){
                index = flowg.getEdgeIndex(node_to_flow[forest.paths[i].nodes[j].id], node_to_flow[forest.parent(forest.paths[i].nodes[j]).id])
                flow[index] = forest.cost(forest.paths[i].nodes[j])
              }
            }
          }
          stop = true
          continue
        }
        else{
          for(var i=0; i < node_to_flow[v.id].inEdges.length; i++){
            u = flow_to_node[node_to_flow[v.id].inEdges[i].u.id]
            index = forest.path(v).getEdgeIndex(u, v)
            if(index != -1){
              flow_index = flowg.getEdgeIndex(node_to_flow[u.id], node_to_flow[v.id])
              flow[flow_index] = flowg.edges[flow_index]
              console.log(forest.path(u))
              forest.cut(u)
              flowg.deleteEdge(node_to_flow[u.id], node_to_flow[v.id])
              continue
            }
          }
        }
      }
      else {
        for(var i=0; i < node_to_flow[v.id].outEdges.length; i++){
          edge = node_to_flow[v.id].outEdges[i]
          if(forest.path(v).getIndex(flow_to_node[edge.v.id])!= -1)
            break
        }
        forest.link(v, flow_to_node[edge.v.id], edge.cost)
        continue
      }
    }
  }

}
maxFlow()


var n = new Node(null)
var n1 = new Node(null)
var n2 = new Node(null)
var n3 = new Node(null)
var n4 = new Node(null)
var n5 = new Node(null)
var n6 = new Node(null)
var n7 = new Node(null)
var n8 = new Node(null)
var n9 = new Node(null)
var n10 = new Node(null)
var n11 = new Node(null)
var n12 = new Node(null)
var n13 = new Node(null)
var n14 = new Node(null)
var n15 = new Node(null)

n2.setDashedParent(n1, 15)
n3.setDashedParent(n1, 10)
n4.setDashedParent(n2, 20)
n5.setDashedParent(n2, 25)
n6.setDashedParent(n3, 5)
n7.setDashedParent(n3, 30)
n8.setDashedParent(n4, 15)
n9.setDashedParent(n4, 10)
n10.setDashedParent(n5, 20)
n11.setDashedParent(n5, 25)
n12.setDashedParent(n6, 5)
n13.setDashedParent(n6, 30)
n14.setDashedParent(n7, 5)
n15.setDashedParent(n7, 30)

var path1 = new Path()
var path2 = new Path()
var path3 = new Path()
var path4 = new Path()
var path5 = new Path()
var path6 = new Path()
var path7 = new Path()
var path8 = new Path()
var path9 = new Path()
var path10 = new Path()
var path11 = new Path()
var path12 = new Path()
var path13 = new Path()
var path14 = new Path()
var path15 = new Path()

path1.addNode(n1)
path2.addNode(n2)
path3.addNode(n3)
path4.addNode(n4)
path5.addNode(n5)
path6.addNode(n6)
path7.addNode(n7)
path8.addNode(n8)
path9.addNode(n9)
path10.addNode(n10)
path11.addNode(n11)
path12.addNode(n12)
path13.addNode(n13)
path14.addNode(n14)
path15.addNode(n15)

var pathCollection = new PathCollection()
pathCollection.addPath(path1)
pathCollection.addPath(path2)
pathCollection.addPath(path3)
pathCollection.addPath(path4)
pathCollection.addPath(path5)
pathCollection.addPath(path6)
pathCollection.addPath(path7)
pathCollection.addPath(path8)
pathCollection.addPath(path9)
pathCollection.addPath(path10)
pathCollection.addPath(path11)
pathCollection.addPath(path12)
pathCollection.addPath(path13)
pathCollection.addPath(path14)
pathCollection.addPath(path15)

console.log(pathCollection.expose(n12) + '')
console.log(pathCollection.expose(n8) + '')
console.log(pathCollection)


var pathCollection = new PathCollection()
var n = new Node(null);
nodes = []
var buildTree = function (levels, maxdegree) {
  var n1 = new Node(null)
  nodes.push(n1)
  buildTreeHelper(n1, levels, maxdegree);
  //Each edgeless node has a solid edge of 0
  for (var i = 0; i < nodes.length; i++){
    var path = new Path();
    path.addNode(nodes[i]);
    pathCollection.addPath(path);
  }
};

var buildTreeHelper = function (rootNode, levels, maxdegree) {
  if (levels == 0) {
    return;
  }

  for (var i = 0; i < maxdegree; i++) {
    var child = new Node(null);
    child.setDashedParent(rootNode, 10);
    nodes.push(child);
    buildTreeHelper(child, levels-1, maxdegree);
  }
}

buildTree(3,2)
pathCollection.expose(nodes[6])
pathCollection.expose(nodes[5])
pathCollection.expose(nodes[6])
pathCollection.expose(nodes[5])
pathCollection.expose(nodes[6])
console.log(pathCollection + '')
