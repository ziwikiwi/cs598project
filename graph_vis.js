

var height = 500;
var canvasses = [];
var trees = [];

function getCanvasWidth(numberOfTrees) {
	console.log(window.innerWidth/numberOfTrees);
	return window.innerWidth/numberOfTrees - 100;
}

function pathStuff() {

    var pathCollection = new PathCollection();
    trees.push(pathCollection);
    pathCollection.drawPaths(0);
    
    //console.log(pathCollection.split(n3));
    //console.log(pathCollection);

}

/*Adds a new path with some nodes to our collection.
*/

function addPath(collection, length){
	var collection = 0;
	var prev = null;
	var path = new Path();
	for (var i = 0; i <= length; i++) {
		var n1 = new Node(prev);
		if (prev) {
			n1.setEdge(new Edge(20, prev, n1));
		}
		path.addNode(n1);
		prev = n1;
		console.log(prev);
	}

	var pathCollection;
	pathCollection = trees[collection];
	trees[collection].addPath(path);
	trees[collection].redraw();
}