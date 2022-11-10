/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables & switches
let contactVis;
let cateMapVis;

let selectedTimeRange = [];
let selectedState = '';


// load data using promises
let promises = [
	d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"), // already projected -> you can just scale it to fit your browser window
	d3.csv("data/governors_usa.csv"),
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
	console.log('check out the data', dataArray);

	let data_category = dataArray.slice(2, 16)

	contactVis = new ContactVis('contact-map', dataArray[0], dataArray[1])
	cateMapVis = new CateMapVis('cate-map', dataArray[0], data_category)

}

