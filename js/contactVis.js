class ContactVis {

    constructor(parentElement, geoData, contactData) {
        this.parentElement = parentElement;
        this.contactData = contactData;
        this.geoData = geoData;
        this.displayData = geoData;

        this.initVis()
    }

    initVis() {
        let vis = this

        // margin conventions
        vis.margin = {top: 30, right: 50, bottom: 20, left: 50};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

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
        vis.usaContact = topojson.feature(vis.geoData, vis.geoData.objects.states).features

        // draw states
        vis.states = vis.map.selectAll(".state")
            .data(vis.usaContact)
            .enter()
            .append("path")
            .attr("fill", "transparent")
            .attr("d", vis.path)
            .attr("class","state")

        // add tooltip
        vis.tooltip = d3.select('body')
            .append("div")
            .attr('class', "tooltip")



        vis.wrangleData()

    }

    wrangleData() {
        let vis = this

        vis.usaContact.forEach(
            function (d) {
                vis.contactData.forEach(elt => {
                    if (d.properties.name == elt['state_name']) {
                        d.properties.info = elt
                    }
                })
            }
        )


        vis.updateVis()
    }

    updateVis() {
        let vis = this

        vis.states
            .style("fill", "white")
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .style('fill', '#85005b')
                    .style("opacity", 1)

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", (event.pageX + 10) + 'px') //event.pageX & event.pageY refer to the mouse Coors on the webpage, not the Coors inside the svg
                    .style("top", (event.pageY + 20) + 'px')
                    .style("pointer-events", "none")
                    .html(`
                         <div style=" font-size:20px; border: solid grey; border-radius: 5px; background: whitesmoke; padding: 20px; font-family: "American Typewriter", serif; font-size:20px">
                             <p style="font-size:24px; font-weight: 700">${d.properties.info['state_name']}</p>
                             <p>Click me for more details!</p>
                         </div>
                    `)
            })
            .on('mouseout', function () {
                d3.select(this)
                    .style('fill', 'white')

                vis.tooltip
                    .style("pointer-events", "none")
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``)

            })
            .on('click', showEdition)
    }

}
