window.BWC = {
  zeroPad: function (value, options) {
    options || (options = {});
    var length = options.length || 10;
    var zeros = "";
    if (!value) value = "";
    for (var i = 0; i < length - (value.toString()).length; i++) zeros = zeros + "0";
    return zeros + value;
  }
}

describe("GridView", function() {
	beforeEach(function() {
		$("#testbed").remove();
		$("body").append("<div id='testbed'></div>");
		window.gv = new GridView({el: $("#testbed")});
	});

	it("should be able to calculate how many rows and columns are required for the tile collection",function() {
		gv.h = 100;
		gv.w = 125;
		_.each(d3.range(0,9),function(i) {
			gv.collection.add({meta:{title:"A"+i}});
		},this);

		var r = gv.rowsAndColumns(1, gv.collection.length);
		expect(r.rows).toEqual(3);
		expect(r.columns).toEqual(4);
		expect(r.tileSize).toEqual(30);

	});

	it("should be able to draw rows + columns",function() {
		gv = new GridView();
		_.each(d3.range(0,7),function(i) {
			gv.collection.add({meta:{title:"A"+i}});
		},this);
		
		$("#testbed").html(gv.render().el);
		expect($("body svg rect").length).toEqual(7);
		
		gv.collection.add({meta:{title: "asd"}});
		expect($("body svg .tiles").length).toEqual(8);
	});

	it("should animate in and out",function() { 
		gv = new GridView();
		_.each(d3.range(0,7),function(i) {
			gv.collection.add({meta:{title:"A"+i}});
		},this);
		
		$("#testbed").html(gv.render().el);
		expect($("body svg rect").length).toEqual(7);
		gv.collection.remove(gv.collection.first());
		setTimeout(function(){
				expect($("body svg rect").length).toEqual(6);
			},1000);
	});

	it("should redraw proportionally when new items enter the gridview", function() {
		gv = new GridView();
		_.each(d3.range(0,7),function(i) {
			gv.collection.add({meta:{title:"A"+i}});
		},this);
		$("#testbed").html(gv.render().el);

		setTimeout(function() {
			_.each(d3.range(0,7),function(i) {
			gv.collection.add({meta:{title:"A"+i}});
			},this);
			setTimeout(function() {
				expect($(gv.vis.select("rect")[0]).attr("height")).toEqual(102);
			},1000);
		},1000);

	});

	it("should draw the template on the card", function() {
    var template = function(rects) {
      rects.append("text")
      .text(function(d) { return d.model.get('meta').title; })
      .attr("x", 4)
      .attr("y", 25)
    }
    gv = new GridView({tileTemplate: template});
		_.each(d3.range(0,7),function(i) {
			gv.collection.add({meta:{title:"A"+i}});
		},this);
		$("#testbed").html(gv.render().el);
    
		expect($(gv.vis.select("text")[0]).text()).toEqual("A0");
	});



	it("should trigger an event when a tile is clicked",function() {
			gv = new GridView();
		_.each(d3.range(0,7),function(i) {
			gv.collection.add({meta:{title:"A"+i}});
		},this);

		$("#testbed").html(gv.render().el);
		gv.bind('tileClick',function(d) {
			$("#testbed").append("<div><pre>"+ JSON.stringify(d.toJSON())+"</pre></div>");
		});
		gv.trigger('tileClick',gv.collection.first());
		expect($("#testbed pre").html()).toEqual('{"meta":{"title":"A0"},"active":true,"template":""}');

	});

	it("should be able to sort against a particular facet",function() {
			gv = new GridView();
		gv.collection.comparator = function(t) {
			return t.get("meta").title;
		};

    _.each(window.fixtures.sample_response.response.results, function(i){
			gv.collection.add({meta:{title:i.sectionId,description:i.sectionName}});
		},this);

    gv.collection.sort();
		$("#testbed").html(gv.render().el);
		//console.log(gv.collection.first().get('meta').description);
		gv.collection.comparator = function(t) {
			return window.BWC.zeroPad(t.get("meta").description);
		};

		setTimeout(function() {
      gv.collection.sort();
    },2800);
	});
  
	it("should be able create a collection from Guardian data",function() {
			gv = new GridView();
    _.each(window.fixtures.sample_response.response.results, function(i){
			gv.collection.add({meta:{title:i.sectionId}});
		},this);
		$("#testbed").html(gv.render().el);
		//console.log(gv.collection.first().get('meta').description);
		gv.collection.comparator = function(t) {
			return window.BWC.zeroPad(t.get("meta").description);
		};

		setTimeout(function() {
      gv.collection.sort();
    },2800);
	});

  it("Should Pulsate", function(){
    var data = [ {x: 10, y:10, h:100, w:100} ];

		$("#testbed").html("<svg width='300' height='300'></svg>");
    var vis = d3.select("#testbed svg");
    var rects = vis.append("rect")
        .data(data)
        .attr("x", function(d) { return d.x; } )
        .attr("y", function(d) { return d.y; } )
        .attr("height", function(d) { return d.h; } )
        .attr("width", function(d) { return d.w; } )
        .attr("fill", "black");




    setInterval(function(){
      if (data[0].h == 200) {
        data[0].h = 100;
        data[0].w = 100;
      }
      else {
        data[0].h = 200;
        data[0].w = 200;
      }

      vis.selectAll("rect")
        .data(data)
          .transition().duration(750)
          .attr("height", function(d) { return d.h; } )
          .attr("width", function(d) { return d.w; } );
    }, 2000);
    
  
		
  });
});
