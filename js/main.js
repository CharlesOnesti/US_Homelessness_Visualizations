/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables & switches
let contactVis;
let cateMapVis;
let dotPlotVis;
let pieVis;

let selectedTimeRange = [];
let selectedState = '';
let slider;

let dotPlotYear = 2007;
let dotPlotState = 'Total';

let radarData = [
	{
		'name': 'District of Columbia',
		'shelter_capacity': 6272,
		'housing': 29.5,
		'per10000': 90.4,
		'spending': 150000000,
	},
	{
		'name': 'New York',
		'shelter_capacity': 83720,
		'housing': 31.6,
		'per10000': 46.9,
		'spending': 3000000000,
	},
	{
		'name': 'Hawaii',
		'shelter_capacity': 3312,
		'housing': 32,
		'per10000': 45.6,
		'spending': 50000000
	},
	{
		'name': 'California',
		'shelter_capacity': 60582,
		'housing': 32.9,
		'per10000': 40.9,
		'spending': 7200000000
	},
	{
		'name': 'Oregon',
		'shelter_capacity': 5315,
		'housing': 30.8,
		'per10000': 34.7,
		'spending': 2300000000
	},
]

// load data using promises
let promises = [
	d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"), // already projected -> you can just scale it to fit your browser window
	d3.csv("data/governors_usa.csv"),
	d3.csv("data/race_gender_2021.csv"),
	d3.csv("data/state_counts_2007_2020.csv"),
	d3.csv("data/map_category/state_2007.csv"),
	d3.csv("data/map_category/state_2008.csv"),
	d3.csv("data/map_category/state_2009.csv"),
	d3.csv("data/map_category/state_2010.csv"),
	d3.csv("data/map_category/state_2011.csv"),
	d3.csv("data/map_category/state_2012.csv"),
	d3.csv("data/map_category/state_2013.csv"),
	d3.csv("data/map_category/state_2014.csv"),
	d3.csv("data/map_category/state_2015.csv"),
	d3.csv("data/map_category/state_2016.csv"),
	d3.csv("data/map_category/state_2017.csv"),
	d3.csv("data/map_category/state_2018.csv"),
	d3.csv("data/map_category/state_2019.csv"),
	d3.csv("data/map_category/state_2020.csv")
];

Promise.all(promises)
	.then(function (data) {
		initMainPage(data)
	})
	.catch(function (err) {
		console.log(err)
	});

// initMainPage
function initMainPage(dataArray) {

	// log data
	// console.log('check out the data', dataArray);

	let data_category = dataArray.slice(4, 18)

	contactVis = new ContactVis('contact-map', dataArray[0], dataArray[1])
	cateMapVis = new CateMapVis('cate-map', dataArray[0], data_category)
	cateMapVis = new PieVis('pie', dataArray[2])
	dotPlotVis = new DotPlotVis('dotplot', dataArray[3])
}

// directly pass selected value to function in onchange!
function changeDotPlotState(chosen) {
	dotPlotState = chosen
	dotPlotVis.wrangleData()
}

function update() {
	slider = document.getElementById('slider');
	console.log(slider.noUiSlider.get())

	let start = document.getElementById('year-start')
	let end = document.getElementById('year-end')

	let handleArray = slider.noUiSlider.get()
	start.value = handleArray[0]
	end.value = handleArray[1]

	cateMapVis.wrangleData()
}