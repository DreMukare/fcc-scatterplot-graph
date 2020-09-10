const tooltip = document.getElementById("tooltip");

fetch(
	"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
	.then((res) => res.json())
	.then((data) => {
		createScatterPlot(
			data.map((d) => [
				parseTime(d.Time),
				d.Year,
				d.Name,
				d.Nationality,
				d.Doping,
			])
		);
	});

const parseTime = (time) => new Date(`2010 01 01 00:${time}`);

const createScatterPlot = (data) => {
	const w = 800;
	const h = 600;
	padding = 48;

	const xScale = d3
		.scaleTime()
		.domain([
			d3.min(data, (d) => new Date(d[1] - 1)),
			d3.max(data, (d) => new Date(d[1] + 1)),
		])
		.range([padding, w - padding]);

	const yScale = d3
		.scaleTime()
		.domain([d3.min(data, (d) => d[0]), d3.max(data, (d) => d[0])])
		.range([padding, h - padding]);

	const svg = d3
		.select("#container")
		.append("svg")
		.attr("width", w)
		.attr("height", h);

	svg
		.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("class", "dot")
		.attr("data-xvalue", (d) => d[1])
		.attr("data-yvalue", (d) => d[0])
		.attr("cx", (d) => xScale(d[1]))
		.attr("cy", (d) => yScale(d[0]))
		.attr("fill", (d) => (d[4] === "" ? "#d3de32" : "#ffffdd"))
		.attr("stroke", "#333333")
		.attr("r", 5)
		.on("mouseover", (d, i) => {
			svg.append("tooltip");
			tooltip.style.top = yScale(i[0]) - 30 + "px";
			tooltip.style.left = xScale(i[1]) + 10 + "px";
			tooltip.style.display = "block";
			tooltip.setAttribute("data-year", i[1]);
			tooltip.innerHTML = `${i[2]}: ${i[3]} <br> Year: ${
				i[1]
			}, Time: ${i[0].getMinutes()}:${i[0].getSeconds()} <br><br> ${i[4]}`;
		})
		.on("mouseout", () => {
			tooltip.style.display = "none";
		});

	const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
	const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

	svg
		.append("g")
		.attr("transform", `translate(0, ${h - padding})`)
		.attr("id", "x-axis")
		.call(xAxis);

	svg
		.append("g")
		.attr("transform", `translate(${padding}, 0)`)
		.attr("id", "y-axis")
		.call(yAxis);
};
