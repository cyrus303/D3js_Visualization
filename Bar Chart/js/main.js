var margin = { top:10, right:20, bottom: 50, left:80 }

var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var flag = true;
var t = d3.transition().duration(750)

var svg = d3.select("#chart-area")
	.append("svg")
		.attr("width",width + margin.left + margin.right)
		.attr("height",height + margin.top + margin.bottom)
var g = svg.append("g")
	.attr("transform","translate("+margin.left+","+margin.top+")");

var xAxisGroup = g.append("g")
	.attr("class","bottom axis")
	.attr("transform","translate(0, "+ (height) + ")")
		
//X scale
var x = d3.scaleBand()
	.range([0,width])
	.padding(0.2)//Inner(0.3)
	//.paddingOuter(0.3);

//Y scale
var y = d3.scaleLinear()
	.range([height,0])
	
var yAxisGroup = g.append("g")
	.attr("class","left axis");
			

g.append("text")
	.attr("class", "x axis-label")
	.attr("x", (width/2))
	.attr("y", (height + 40))
	.attr("font-size","20px")
	.attr("text-anchor","middle")
	.attr("color","black")
	.text("month");

var yLabel = g.append("text")
	.attr("class", "y axis-label")
	.attr("x", -(height/2))
	.attr("y", (-60))
	.attr("font-size","20px")
	.attr("transform","rotate(-90)")
	.attr("text-anchor","middle")
	.attr("color","black")
	.text("revenue");

//data load
d3.json("data/revenues.json").then(function(data){
	//console.log(data);
	data.forEach(function(d){
		d.revenue = +d.revenue;
		d.profit = +d.profit;
	});

	d3.interval(function(){
		//var newdata = flag ? data : data.slice(2);

		update(data)
		flag = !flag;
	}, 1000);

	update(data)

});

function update(data){

	var value = flag ? "revenue" : "profit";
	x.domain(data.map(function(d){ return (d.month )}));
	y.domain([0, d3.max(data, function(d){ return d[value]})])

	//y axis
	var leftAxis = d3.axisLeft(y)
		//.ticks(5)
		.tickFormat(function(d){return d + "$" });
	yAxisGroup.transition(t).call(leftAxis);

	//x axis
	var bottomAxis = d3.axisBottom(x);
	xAxisGroup.transition(t).call(bottomAxis);;
		

	//bars
	
	var rects = g.selectAll("rect")
		.data(data, function(d){
			return d.month;
		});
		//console.log(data);

	//JOIN new data with old elements
	//var rects = g.selectAll("rect")
	//	.data(data, function(d){
	//		return d.month;
	//	});


	//EXIT old elements not present in new data
	rects.exit()
		.attr("fill", "grey")
	.transition(t)
		.attr("y",y(0))
		.attr("height", 0)
		.remove();

	//UPDATE old elements present in new data
	/*rects.transition(t)
		.attr("x",function(d,i){
				return x(d.month);
			})

		.attr("y", function(d){
				return y(d[value])
			})

		.attr("width",x.bandwidth)

		.attr("height",function(d){
				return height - y(d[value]);
			})*/

	// ENTER new element present in new data
	rects.enter()
		.append("rect")
			.attr("x",function(d){
				return x(d.month);
			})

			.attr("y", function(d){
				return y(d[value])
			})

			.attr("width",(x.bandwidth ))

			.attr("height",function(d){
				return height - y(d[value]);
			})
			.attr("fill","red")
		//before merge enter method
		.merge(rects)
		//after merge update method
		.transition(t)
			.attr("y", function(d){
				return y(d[value])
			})
			.attr("height",function(d){
				return height - y(d[value]);
			})


	var label = flag ? "Revenue":"Profit";
	yLabel.text(label);
}
