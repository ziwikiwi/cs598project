

var height = 500;
var canvasses = [];
var trees = [];
var tree = new Tree();
var drawnPaths = false;
var drawnTree = false;

function getCanvasWidth(numberOfTrees) {
	console.log(window.innerWidth/numberOfTrees);
	return window.innerWidth/numberOfTrees - 100;
}

function pathStuff() {

	if (!drawnPaths) {
		var pathsTitle = document.createElement("h2");
		pathsTitle.innerHTML = "Path Visualization";
		document.body.appendChild(pathsTitle);
		tree.pathCollection.drawPaths(1);
		drawnPaths = true;
	}
    else {
    	tree.pathCollection.redraw();
    }
}

/*Adds a new path with some nodes to our collection.
* @collection: index of the path collection we want to add our paths to
* @length: Length of added path. 0 = node.
*/

function addPath(collection, length){
	var collection = 0;
	console.log(length);
	var prev = null;
	var path = new Path();
	for (var i = 0; i <= length; i++) {
		var n1 = new Node(prev);
		if (prev) {
			var e1 = new Edge(20, prev, n1);
			path.addEdge(e1);
		}
		path.addNode(n1);
		prev = n1;
	}

	var pathCollection;
	pathCollection = trees[collection];
	trees[collection].addPath(path);
	trees[collection].redraw();
}

function buildTree(levels, maxdegree) {
	if (!drawnTree) {
		var pathsTitle = document.createElement("h2");
		pathsTitle.innerHTML = "Tree Visualization";
		document.body.appendChild(pathsTitle);
		tree.buildTree(levels, maxdegree);
		tree.setupGraph(0);
		//tree.splitTree();
		drawnTree = true;
	}
	else {
		tree.redraw();
	}
}

function expose(node) {
	var index = node;
	for (var i = 0; i < tree.pathCollection.paths.length; i++) {
		for (var j = 0; j < tree.pathCollection.paths[i].nodes.length; j++) {
			if (tree.pathCollection.paths[i].nodes[j].id == index) {
				tree.pathCollection.expose(tree.pathCollection.paths[i].nodes[j]);
				break;
			}
		}
	}
	console.log(tree.pathCollection + '');
	tree.redraw();
}

function splice(node1, node2) {
	for (var i = 0; i < tree.pathCollection.paths.length; i++) {
		var path = tree.pathCollection.paths[i];
		if ((tree.pathCollection.head(path) && tree.pathCollection.head(path).id == node1) && 
			(tree.pathCollection.tail(path) && tree.pathCollection.tail(path).id == node2))
		{
			tree.pathCollection.splice(path);
			break;
		}
	}
	tree.redraw();
}


function root() {
	
}



