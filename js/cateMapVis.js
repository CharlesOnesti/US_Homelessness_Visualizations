class CateMapVis {

    constructor(parentElement, geoData, cateData) {
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.cateData = cateData;
        this.displayData = geoData;

        // Date parser
        this.formatDate = d3.timeFormat("%Y") // convert to year
        this.parseDate = d3.timeParse("%Y") // convert to date object


        this.initVis()
    }

    initVis() {
        let vis = this
        console.log(vis.cateData)

        // margin conventions
        vis.margin = {top: 30, right: 50, bottom: 20, left: 50};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // user selection
        let selectionValues = [
            'OverallHomeless',
            'OverallHomelessIndividuals',
            'OverallHomelessFamilyHouseholds',
            'OverallHomelessVeterans'
        ]
        // selection display
        let selectionDisplay = [
            'Total Homeless Population',
            'Homeless Individuals',
            'Homeless Families',
            'Homeless Veterans'
        ]

        // add the options to the button
        d3.select("#selectButton")
            .selectAll('myOptions')
            .data(selectionValues)
            .enter()
            .append('option')
            .text((d, i) => selectionDisplay[i]) // text showed in the menu
            .attr("value", d => d) // corresponding value returned by the button

        // default select
        let selected = "OverallHomeless"

        // default time range
        let yearStart = vis.parseDate("1930")
        let yearEnd = vis.parseDate("2014")
        let slider = document.getElementById('slider');
        vis.slider_info = noUiSlider.create(slider, {
            start: [yearStart, yearEnd],
            connect: true,
            behaviour: 'drag',
            step: 1,
            tooltips: true,
            range: {
                'min': 2007,
                'max': 2020
            }
        })


        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // create a projection.
        vis.projection = d3.geoAlbersUsa()

        vis.viewpoint = {'width': 975, 'height': 610};
        vis.zoom = vis.width / vis.viewpoint.width;


        // Adjust map position
        vis.map = vis.svg.append("g") // group will contain all state paths
            .attr("class", "states")
            .attr('transform', `scale(${vis.zoom} ${vis.zoom})`);

        // define a geo generator and pass your projection to it
        vis.path = d3.geoPath();

        // convert your TopoJSON data into GeoJSON data structure
        vis.usa = topojson.feature(vis.geoData, vis.geoData.objects.states).features

        // draw states
        vis.states = vis.map.selectAll(".state")
            .data(vis.usa)
            .enter()
            .append("path")
            .attr("fill", "transparent")
            .attr("d", vis.path)
            .attr("class","state")

        // add tooltip
        vis.tooltip = d3.select('#contact-map')
            .append("div")
            .attr('class', "tooltip")

        vis.wrangleData()

    }

    wrangleData() {
        let vis = this

        // convert names

        vis.cateData.forEach(dataPerYear => {
            dataPerYear.forEach(
                data => {
                    data['State'] = convertRegion(data['State'], TO_NAME)
                }
            )
        })

        // filtered

        console.log("catedata")
        console.log(vis.cateData)

        vis.usa.forEach(
            function (d) {
                vis.cateData.forEach(dataPerYear => {
                    return;
                })
            }
        )

        console.log(vis.usa)

        vis.updateVis()
    }

    updateVis() {
        let vis = this

        vis.states
            .style("fill", "lightblue")
            .style("stroke", "black")
            .style("stroke-width", "0.5px")
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .style('fill', 'salmon')
                    .style("opacity", 1)

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", (event.pageX + 10) + 'px') //event.pageX & event.pageY refer to the mouse Coors on the webpage, not the Coors inside the svg
                    .style("top", (event.pageY + 20) + 'px')
                    .style("pointer-events", "none")
                    .html(`
                         <div id="contact-tooltip">
                             <h5>${d.properties.info['state_name']}</h5>
                             <p>Governor: ${d.properties.info['name']}</p>
                             <p>Phone: ${d.properties.info['phone']}</p>
                         </div>
                    `)
            })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .style('fill', 'lightblue')
            })
    }



}