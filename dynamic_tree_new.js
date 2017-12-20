var id = 0;

var Node = function(external, bparent, bleft, bright, cost) {
    this.id = id;
    this.external = external;
    this.bparent = bparent;
    this.left = bleft;
    this.right = bright;
    this.reversed = false;
    this.gross_cost = cost;
    this.net_min = null;
    this.dparent = null;
    this.dcost = null;
    id++ ;


    var checkReversed = function() {
      curr = this
      this.reverselist = []
      while(curr.bparent)
      {
        this.reverselist.push(curr.bparent.reversed)
      }
      if(this.reverselist < 2)
        return;

      this.reversed = this.reverselist[0]
      for(var i=1; i < this.reverselist.length; i++)
      {
        this.reversed = (!this.reversed != !this.reverselist[i])
      }

    }

    var bleft = function() {
      if(this.reversed)
        return this.right;
      return this.left;
    }

    var bright = function() {
      if(this.reversed)
        return this.left;
      return this.right;
    }

    var grossmin = function() {
      if(this.bright().external && this.bleft().external)
        return this.cost;

      return Math.min(this.cost, this.bright().grossmin(), this.bleft().grossmin())
    }

    var netcost = function() {
      return this.gross_cost - this.grossmin()
    }

    var netmin = function() {
      if(this.net_min)
        return this.net_min;
      if(!this.bparent) {
        this.net_min = this.grossmin()
      } else {
        this.net_min = this.grossmin() - this.grossmin(this.bparent.grossmin())
      }
      return this.net_min;
    }

    var bhead = function() {
      curr = this.bleft();
      while(!curr.external)
        curr = curr.bleft();
      return curr;
    }

    var btail = function() {
      curr = this.bright();
      while(!curr.external)
        curr = curr.bright;
      return curr;
    }
}

var Forest = function() {

  var checkReversed = function(v) {
    nodes = []
    if(v.external)
      curr = v.bparent;
    else
      curr = v;
    while(curr.bparent) {
      nodes.push(curr)
    }
    for(var i=nodes.length - 1; i > -1; i--)
    {
      nodes[i].checkReversed()
    }
  }
  var path = function(v) {
    curr = v.bparent;
    while(curr){
      curr = curr.bparent
    }
  return curr
  }

  var head = function(p) {
    if(p.reversed)
      return p.btail()
    return p.bhead()
  }

  var tail = function(p) {
    if(p.reversed)
      return p.bhead()
    return p.btail()
  }

  var before = function(v) {
    this.checkReversed(v);
    curr = v;
    while(curr.id != curr.bparent.bright.id){
      curr = curr.bparent;
    }
    curr = curr.bparent.bleft;
    while(!curr.external) {
      curr = curr.bright;
    }
    return curr;
  }

  var after = function(v) {
    this.checkReversed(v);
    curr = v;
    while(curr.id != curr.bparent.blefts.id){
      curr = curr.bparent;
    }
    curr = curr.bparent.bright;
    while(!curr.external) {
      curr = curr.bleft;
    }
    return curr;
  }

  var pcost = function(v) {
    this.checkReversed(v);
    curr = v;
    while(curr.id != curr.bparent.blefts.id){
      curr = curr.bparent;
    }
    return curr.bparent.netcost() + curr.bparent.grossmin();
  }

  var pmincost = function(p) {
    u = p;
    while(!(u.netcost() === 0 && (u.bright().external || u.bright().netmin > 0))){
      if(!u.bright().external && u.bright().netcost() === 0) {
        u = u.bright();
      }
      else {
        u = u.bleft();
      }
    }
  }

  var pupdate = function(p, x) {
    p.net_min += x;
  }

  var reverse = function(p) {
    p.reversed = !p.reversed;
  }

  var construct = function(v, w, x) {
    var root = new Node(false, null, v, w, x)
    v.bparent = root;
    w.bparent = root;
    return root
  }

  var destroy = function(u) {
    u = this.path(u)
    v = u.bleft();
    w = u.bright();
    x = u.gross_cost;
    v.bparent = null;
    w.bparent = null;
    return [v, w, x]
  }

  var concatenate = function(p, q, x){
    return construct(p, q, x)
  }

  var split = function(v){
  // TOO HARD ;-;
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
    v.dparent = null;
  }

}
