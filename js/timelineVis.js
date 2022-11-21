class Timeline {

    // constructor method to initialize Timeline object
    constructor(_parentElement, _data){
        this.parentElement = _parentElement
        this.data = _data

        // No data wrangling, no update sequence
        this.displayData = _data
        this.initVis()
    }

    // create initVis method for Timeline class
    initVis() {

        // store keyword this which refers to the object it belongs to in variable vis
        let vis = this

        vis.margin = {top: 0, right: 40, bottom: 30, left: 40}

        vis.width = 550 - vis.margin.left - vis.margin.right
        vis.height = 550  - vis.margin.top - vis.margin.bottom

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + 150 + ")")

        // Scales and axes
        vis.x = d3.scaleTime()
            .range([0, vis.width])

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)

        // Append x-axis
        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate("+ 0 +","  + 70 + ")")
            .call(vis.xAxis)

        // Radii scale
        vis.circleScale = d3.scaleLinear()
                            .domain([0, d3.max(vis.data, d => d.overall)])
                            .range([0, 20])

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'timelineTooltip')

        vis.wrangleData()
    }

    wrangleData() {
        let vis = this
        console.log(vis.data)
        vis.displayData = vis.data.filter(x => x.state === 'Total')
        console.log("Totals", vis.displayData)
        vis.updateVis()
    }

    updateVis() {
        let vis = this

        vis.x.domain(d3.extent(vis.displayData, function(d) {return new Date(d.year, 0) }))
        vis.svg.select('.x-axis').call(vis.xAxis)

        // Create circles
        vis.svg.selectAll("circle")
            .data(vis.displayData)
            .enter()
            .append("circle")
            .attr("r", d => vis.circleScale(d.overall))
            .attr("cx", (d, i) => i * 38)
            .attr("cy", 30)
            .attr("fill", '#4A8BDF')
            .on('mouseover', function(event, d){
                console.log("D", d)
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr('fill', 'rgba(173,222,255,0.62)')
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 10px">
                            <h3>Year: ${d.year}</h3>
                             <h3>Number of Total Homeless: ${d.overall}<h3>
                         </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", '#4A8BDF')

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })

    }
}