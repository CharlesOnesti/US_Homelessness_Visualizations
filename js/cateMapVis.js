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
        vis.margin = {top: 0, right: 150, bottom: 50, left: -30};
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
            start: vis.yearStart,
            connect: true,
            behaviour: 'drag',
            step: 1,
            range: {
                'min': 2007,
                'max': 2020
            },
            pips: {
                mode: 'steps',
                stepped: true,
                density: 4
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

        vis.slider.noUiSlider.on('update', function (values, handle) {
            vis.yearStart = values[0]
            document.getElementById('current-year')
                .innerHTML = `Year Selected: <b style="font-size: 18px;">${values[0]}</b>`
            vis.wrangleData()
        })

        vis.wrangleData()

    }
    wrangleData() {
        let vis = this

        vis.cateInfo = {}

        let years = Array.from(new Array(14), (x, i) => i + 2007);

        for (let i = 0; i < years.length; i++) {
            vis.cateInfo[String(years[i])] = vis.cateData[i]
        }

        vis.filteredData = vis.cateInfo[parseInt(vis.yearStart)]


        vis.usa.forEach(
            function (d) {
                vis.filteredData.forEach(elt => {
                    if (d.properties.name == elt['State']) {
                        d.properties.info = elt
                    }
                })
            }
        )
        vis.updateVis()
    }

    updateVis() {
        let vis = this

        vis.colorScale = d3.scaleLinear()
            .range(["#FFFFFF", "#A0006DFF"])
            .domain([0, d3.max(vis.filteredData, d => d[vis.selected])])

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
                    .style('fill', '#2D375A')
                    .style("opacity", 1)

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", (event.pageX + 10) + 'px') //event.pageX & event.pageY refer to the mouse Coors on the webpage, not the Coors inside the svg
                    .style("top", (event.pageY + 20) + 'px')
                    .style("pointer-events", "none")
                    .html(`
                         <div id="contact-tooltip" style=" font-size:20px; border: solid grey; border-radius: 5px; background: whitesmoke; padding: 20px; font-family: "American Typewriter", serif; font-size:20px">
                             <p style="font-size:24px; font-weight: 700">${d.properties.info['State']}</p>
                             <p><b>Total homeless population:</b> ${parseInt((d.properties.info['OverallHomeless']), 10).toLocaleString()}</p>
                             <p><b>Homeless Individuals:</b> ${parseInt((d.properties.info['OverallHomelessIndividuals']), 10).toLocaleString()}</p>
                             <p><b>Homeless Families:</b> ${parseInt((d.properties.info['OverallHomelessFamilyHouseholds']), 10).toLocaleString()}</p>
                             <p><b>Homeless Veterans:</b> ${parseInt((d.properties.info['OverallHomelessVeterans']), 10).toLocaleString()}</p>
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
            d3.max(vis.filteredData, d => d[vis.selected]),
            d3.max(vis.filteredData, d => d[vis.selected])/100);

        // Update legend fill
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

        let maxLegend = d3.max(vis.filteredData, d => d[vis.selected])

        // create a legend axis
        vis.legendAxis = d3.axisBottom()
            .scale(vis.appearScale)
            .ticks(3)
            .tickValues([0,100])
            .tickFormat((d, i) => ['0', parseInt(maxLegend, 10).toLocaleString()][i])

        // call the legend axis inside the legend axis group
        vis.legendGroup
            .attr("class", "axis legend-axis")
            .attr('transform', `translate(0, 10)`)
            .call(vis.legendAxis)

    }

}