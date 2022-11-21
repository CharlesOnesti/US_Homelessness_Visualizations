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

        vis.margin = {top: 0, right: 50, bottom: 30, left: 50}

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            // .append("g")
            // .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + 150 + ")")

        // Scales and axes
        vis.x = d3.scaleTime()
            .range([0, vis.width])

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)

        // Append x-axis
        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", `translate(${vis.margin.left}, ${vis.height / 2})`)
            .call(vis.xAxis)

        // Radii scale
        vis.circleScale = d3.scaleLinear()
                            .domain([0, d3.max(vis.data, d => d.overall)])
                            .range([0, (vis.width / vis.data.filter(x => x.state === 'Total').length) / 2])

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'timelineTooltip')

        vis.wrangleData()
    }

    wrangleData() {
        let vis = this
        vis.displayData = vis.data.filter(x => x.state === 'Total')
        vis.updateVis()
    }

    updateVis() {
        let vis = this

        vis.x.domain(d3.extent(vis.displayData, function(d) {return new Date(d.year, 0) }))
        vis.svg.select('.x-axis').call(vis.xAxis)

        // Create event lines
        vis.svg.selectAll('.event-lines')
            .data(policyEvents)
            .enter()
            .append('line')
            .attr("x1", d => vis.x(d.date))
            .attr("y1", -(vis.margin.top))
            .attr("x2", d => vis.x(d.date))
            .attr("y2", vis.height)
            .style("stroke-width", 4)
            .style("stroke", "#A0006D")
            .style("fill", "none")
            .on('mouseover', function(event, d){
                console.log(d)
                d3.select(this)
                    .style('stroke', 'green')
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 10px">
                            <h3>Event: ${d.name}</h3>
                            <h3>Date: ${d.date.toLocaleString().split(',')[0]}</h3>
                         </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .style("stroke", "#A0006D")
                vis.tooltip
                    .style("opacity", 0)
            })

        // Create circles
        vis.svg.selectAll("circle")
            .data(vis.displayData)
            .enter()
            .append("circle")
            .attr("r", d => vis.circleScale(d.overall))
            .attr("cx", d => vis.x(new Date(d.year, 0)) + vis.margin.left)
            .attr("cy", d => vis.height/2 - vis.circleScale(d.overall))
            .attr('stroke', 'black')
            .attr('stroke-width', '2px')
            .attr("fill", '#4A8BDF')
            .on('mouseover', function(event, d){
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
                    .attr('stroke-width', '2px')
                    .attr("fill", '#4A8BDF')
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })

    }
}