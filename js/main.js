// Load CSV file
d3.csv("data/myCSV.csv", row => {
	return row
}).then( data => {
	console.log(data)
})