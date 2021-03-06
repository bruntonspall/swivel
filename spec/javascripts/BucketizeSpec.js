var gv;
describe("Bucketize", function () {
	beforeEach(function() {
		$("#testbed").remove();
		$("body").append("<div id='testbed'></div>");
	});
		
	it ("should be able to determine bucket offset", function() {
		gv = new GridView();
		gv.w = 1000

    gv.collection.add({ title:"Sad title", description:"This is a description" },{silent:true});
    gv.collection.add({ title:"Happy title", description:"a different description" },{silent:true});

    gv.bucketize("title");

    expect(Object.keys(gv.buckets).length).toEqual(2);

	});

  it("should be able to create the necessary bucket name in the grid",function() { 

		gv = new GridView();
		gv.w = 1000

    gv.collection.add({ title:"Sad title", description:"This is a description" },{silent:true});
    gv.collection.add({ title:"Happy title", description:"a different description" },{silent:true});
    gv.collection.add({ title:"Happy title", description:"a different description" },{silent:true});
    gv.collection.add({ title:"Happy title", description:"a different description" },{silent:true});
    gv.collection.add({ title:"Happy title", description:"a different description" },{silent:true});
    gv.collection.add({ title:"Happy title", description:"a different description" },{silent:true});
    gv.collection.add({ title:"Happy title", description:"a different description" },{silent:true});
    gv.collection.add({ title:"Happy Panda", description:"a different description" },{silent:true});
    gv.collection.add({ title:"Rabbit monkey", description:"a different description" },{silent:true});
    gv.collection.add({ title:"Rabbit monkey", description:"a different description" },{silent:true});


    $("#testbed").html(gv.render().el);
    setTimeout(function() { 

      gv.bucketize("title");
      gv.animate();
    },1000);
  });
});
