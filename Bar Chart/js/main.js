/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

var margin = { top:10, right:20, bottom: 50, left:80 }

var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

d3.json("data/revenues.json").then(function(data){
	//console.log(data);
	data.forEach(function(d){
		d.revenue = +d.revenue;
		d.profit = +d.profit;
	});
	//var data = [12,34,12,45,67];

	var svg = d3.select("#chart-area")
		.append("svg")
			.attr("width",width + margin.left + margin.right)
			.attr("height",height + margin.top + margin.bottom)
	var g = svg.append("g")
		.attr("transform","translate("+margin.left+","+margin.top+")");

	var y = d3.scaleLinear()
		.domain([0, d3.max(data, function(d){
					return d.profit;})
				])
		.range([height,0])


	var x =d3.scaleBand()
		.domain(data.map(function(d,i){
		return (d.month);})
			//"January","February","March","April","May",
			//	"June","July","August","September"
			)
		.range([0,400])
		.paddingInner(0.3)
		.paddingOuter(0.3);
		//console.log(x("June"))

	
	var leftAxis = d3.axisLeft(y)
		//.ticks(5)
		.tickFormat(function(d){
    		return d + "$"
    	});
		g.append("g")
			.attr("class","left axis")
			.call (leftAxis);

	var bottomAxis = d3.axisBottom(x);
		g.append("g")
			.attr("class","bottom axis")
			.attr("transform","translate(0, "+ (height) + ")")
			.call(bottomAxis)


	g.append("text")
		.attr("class", "x axis-label")
		.attr("x", (width/2) - 50)
		.attr("y", (height + 40))
		.attr("font-size","20px")
		//.attr("transform","rotate(-90)")
		.attr("text-anchor","middle")
		.attr("color","black")
		.text("month");

	g.append("text")
		.attr("class", "y axis-label")
		.attr("x", -(height/2))
		.attr("y", (-60))
		.attr("font-size","20px")
		.attr("transform","rotate(-90)")
		.attr("text-anchor","middle")
		.attr("color","black")
		.text("revenue");


	var rects = g.selectAll("rect")
		.data(data);
		//console.log(data);

	rects.enter()
		.append("rect")
			.attr("x",function(d,i){
				//console.log(d.month)
				return x(d.month);
			})

			.attr("y", function(d){
				return y(d.revenue)
			})

			.attr("width",x.bandwidth)

			.attr("height",function(d){
				return height - y(d.revenue);
			})

			.attr("fill","red")

})










