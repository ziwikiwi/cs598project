
window.onload = initGraph;
var height = 500;
var canvasses = [];
var trees = [];

function initGraph(){

    var g = new Graph();

    g.addNode("A");
    g.addNode("B");
    g.addNode("C");
    g.addNode("D");
    g.addNode("E");

    g.addEdge("A", "B", {label: 10, directed: true});
    g.addEdge("A", "C", {label: 9, directed: true});
    g.addEdge("C", "D", {label: 4, directed: true});
    g.addEdge("C", "E", {label: 5, directed: true});

    trees.push(g);



    var h = new Graph();
    h.addNode("A");
    h.addNode("B");
    h.addNode("C");

    h.addEdge("A", "B", {label: 2, directed: true});
    h.addEdge("A", "C", {label: 2, directed: true});

    trees.push(h);



    var numTrees = trees.length;

    
 };

function drawGraphs(numTrees) {
	var d = document;
	for (var i = 0; i < numTrees; i++) {
		var oldDiv = document.getElementById('canvas' + i);
		if (oldDiv) {
			d.body.removeChild(oldDiv);
		}
			console.log(d.body);
			var canvasName = 'canvas' + i;
			var canvasDiv = d.createElement("div");
			canvasDiv.className = "graph";
			canvasDiv.id = canvasName;
			d.body.appendChild(canvasDiv);
			var renderer = new Graph.Renderer.Raphael(canvasName, trees[i], getCanvasWidth(numTrees), height);
			var layouter = new Graph.Layout.Spring(trees[i]);
    		layouter.layout();
    		renderer.drawTree("A");
			renderer.draw();
	}
}

function getCanvasWidth(numberOfTrees) {
	console.log(window.innerWidth/numberOfTrees);
	return window.innerWidth/numberOfTrees - 100;
}