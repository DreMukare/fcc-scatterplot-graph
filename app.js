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

	console.log(
		svg
			.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("cx", (d) => xScale(d[1]))
			.attr("cy", (d) => yScale(d[0]))
			.attr("r", 7)
	);

	svg
		.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", (d) => xScale(d[1]))
		.attr("cy", (d) => yScale(d[2] / 60))
		.attr("r", 5);
};
