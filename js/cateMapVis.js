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

        // margin conventions
        vis.margin = {top: 30, right: 50, bottom: 20, left: 50};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // user selection
        let selectionValues = [
            "OverallHomeless",
            "OverallHomelessIndividuals",
            "OverallHomelessFamilyHouseholds",
            "OverallHomelessVeterans"
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
        vis.selected = "OverallHomeless"

        // default time range
        vis.yearStart = vis.parseDate("1930")
        vis.yearEnd = vis.parseDate("2014")
        vis.slider = document.getElementById('slider');
        vis.slider_info = noUiSlider.create(vis.slider, {
            start: [vis.yearStart, vis.yearEnd],
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
        vis.tooltip = d3.select('body')
            .append("div")
            .attr('class', "tooltip")

        // add legend
        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')
            .attr('transform', `translate(${vis.width * 2.8 / 4}, ${vis.height - 40})`)

        vis.legendGroup = vis.legend.append("g")

        // detect change
        d3.select("#selectButton")
            .on("change", function() {
                vis.selected = d3.select("#selectButton")
                    .property("value")
                vis.wrangleData()
            })

        d3.selectAll(".time-range")
            .on("change", function() {
                vis.wrangleData()
            })

        vis.wrangleData()

    }
    wrangleData() {
        let vis = this

        // update time start
        vis.yearStart = vis.parseDate(d3.select("#year-start")
            .property("value"))

        // update slider
        vis.slider.noUiSlider.set([vis.formatDate(vis.yearStart), null]);

        // update time end
        vis.yearEnd = vis.parseDate(d3.select("#year-end")
            .property("value"))

        // update slider
        vis.slider.noUiSlider.set([null, vis.formatDate(vis.yearEnd)]);

        vis.filteredData = vis.cateData.filter(dataPerYear =>
            dataPerYear[0]['Year'] >= vis.yearStart && dataPerYear[0]['Year'] <= vis.yearEnd
        )

        vis.cateInfo = vis.filteredData[0]
        for (let i = 1; i < vis.filteredData.length; i++) {
            let catePerYear = vis.filteredData[i]
            for (let j = 0; j < catePerYear.length; j++) {
                vis.cateInfo[j]['OverallHomeless'] += catePerYear[j]['OverallHomeless']
                vis.cateInfo[j]['OverallHomelessIndividuals'] += catePerYear[j]['OverallHomelessIndividuals']
                vis.cateInfo[j]['OverallHomelessFamilyHouseholds'] += catePerYear[j]['OverallHomelessFamilyHouseholds']
                vis.cateInfo[j]['OverallHomelessVeterans'] += catePerYear[j]['OverallHomelessVeterans']
            }
        }

        vis.usa.forEach(
            function (d) {
                vis.cateInfo.forEach(elt => {
                    if (d.properties.name == elt['State']) {
                        d.properties.info = elt
                    }
                })
            }
        )

        console.log(vis.usa)

        vis.updateVis()
    }

    updateVis() {
        let vis = this

        vis.colorScale = d3.scaleLinear()
            .range(["#FFFFFF", "#85005b"])
            .domain([0, d3.max(vis.cateInfo, d => d[vis.selected])])

        console.log(vis.usa)
        console.log(vis.cateInfo)
        vis.states
            .style("fill", function (d) {
                if (d.properties.info && d.properties.info[vis.selected]) {
                    return vis.colorScale(d.properties.info[vis.selected])
                }
                else {
                    return "red"
                }
            })
            .style("stroke", "black")
            .style("stroke-width", "2px")
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .style('fill', 'gray')
                    .style("opacity", 1)

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", (event.pageX + 10) + 'px') //event.pageX & event.pageY refer to the mouse Coors on the webpage, not the Coors inside the svg
                    .style("top", (event.pageY + 20) + 'px')
                    .style("pointer-events", "none")
                    .html(`
                         <div id="contact-tooltip" style="border-color: black; 
                         background-color: whitesmoke; opacity: 0.8; border-radius: 0.2rem; 
                         border-width: 0.5rem; padding: 20px 20px 20px 20px">
                             <h5>${d.properties.info['State']}</h5>
                             <p>Total homeless population: ${d.properties.info['OverallHomeless']}</p>
                             <p>Homeless Individuals: ${d.properties.info['OverallHomelessIndividuals']}</p>
                             <p>Homeless Families: ${d.properties.info['OverallHomelessFamilyHouseholds']}</p>
                             <p>Homeless Veterans: ${d.properties.info['OverallHomelessVeterans']}</p>
                         </div>
                    `)
            })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .style("fill", function (d) {
                        if (d.properties.info && d.properties.info[vis.selected]) {
                            return vis.colorScale(d.properties.info[vis.selected])
                        }
                        else {
                            return "grey"
                        }
                    })
                vis.tooltip
                    .style("pointer-events", "none")
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``)

            })

        // update legend
        vis.gradientRange = d3.range(0,
            d3.max(vis.cateInfo, d => d[vis.selected]),
            d3.max(vis.cateInfo, d => d[vis.selected])/100);

        // Update the legend fill
        vis.legend = vis.legendGroup.selectAll(".rect")
            .data(vis.gradientRange)
            .enter()
            .append("rect")
            .attr("y", 0)
            .attr("height", 25)
            .attr("x", function(d,i) {
                return i*1
            })
            .attr("width", 1)
            .attr("fill", d=>vis.colorScale(d))
            .attr('transform', `translate(0, -25)`)

        vis.appearScale = d3.scaleLinear()
            .range([0, 100])
            .domain([0, 100])

        // console.log(typeof d3.max(vis.stateInfo, d => d[selectedCategory]))

        let maxLegend = d3.max(vis.cateInfo, d => d[vis.selected])

        // create a legend axis
        vis.legendAxis = d3.axisBottom()
            .scale(vis.appearScale)
            .ticks(3)
            .tickValues([0,100])
            .tickFormat((d, i) => ['0', maxLegend][i])

        // call the legend axis inside the legend axis group
        vis.legendGroup
            .attr("class", "axis legend-axis")
            .attr('transform', `translate(0, 10)`)
            .call(vis.legendAxis)

    }



}