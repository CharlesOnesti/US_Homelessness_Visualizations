/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables & switches
let contactVis;
let cateMapVis;
let dotPlotVis;
let pieVis;
let radarVis;

let selectedTimeRange = [];
let selectedState = '';
let selectedCategory;
let slider;
let timePeriod;
let dotPlotYear = 2007;
let dotPlotState = 'Total';
let radarState = 'All';

let parseDate = d3.timeParse("%Y")

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
	d3.csv("data/map_category/state_2020.csv"),
	// need to have duplicates - added at the end
	// else maps will use same method
	d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json")
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

	let data_category = dataArray.slice(4, 18)
	data_category.forEach(dataPerYear => {
		dataPerYear.forEach(
			data => {
				data['State'] = convertRegion(data['State'], TO_NAME)
				data['Year'] = parseDate(data['Year'])
				data['OverallHomeless'] = +data['OverallHomeless']
				data['OverallHomelessIndividuals'] = +data['OverallHomelessIndividuals']
				data['OverallHomelessFamilyHouseholds'] = +data['OverallHomelessFamilyHouseholds']
				data['OverallHomelessVeterans'] = +data['OverallHomelessVeterans']
			}
		)

		// remove undefined states
		dataPerYear = dataPerYear.splice(3,1)
		dataPerYear = dataPerYear.splice(26,1)
	})

	cateMapVis = new CateMapVis('cate-map', dataArray[0], data_category)
	contactVis = new ContactVis('contact-map', dataArray[dataArray.length-1], dataArray[1])
	pieVis = new PieVis('pie', dataArray[2])
	dotPlotVis = new DotPlotVis('dotplot', dataArray[3])
	radarVis = new RadarVis('radar', radarData)
}

// directly pass selected value to function in onchange!
function changeDotPlotState(chosen) {
	dotPlotState = chosen
	dotPlotVis.wrangleData()
}

function changeRadarState(chosen) {
	radarState = chosen
	radarVis.wrangleData()
}

function updateCateMap() {
	slider = document.getElementById('slider');

	let start = document.getElementById('year-start')
	let end = document.getElementById('year-end')

	let handleArray = slider.noUiSlider.get()
	start.value = handleArray[0]
	end.value = handleArray[1]

	timePeriod = handleArray

	cateMapVis.wrangleData()
}
