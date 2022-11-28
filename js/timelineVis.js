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

        vis.margin = {top: 0, right: 100, bottom: 50, left: 100}
        console.log(document.getElementById(vis.parentElement).getBoundingClientRect())
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)


        // Scales and axes
        vis.x = d3.scaleTime()
            .range([vis.margin.left, vis.margin.left + vis.width])

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)

        vis.yLeft = d3.scaleLinear()
            .range([vis.height - vis.margin.top, vis.margin.bottom])

        vis.yAxisLeft = d3.axisLeft()
            .scale(vis.yLeft)

        vis.yRight = d3.scaleLinear()
            .range([vis.height - vis.margin.top, vis.margin.bottom])

        vis.yAxisRight = d3.axisRight()
            .scale(vis.yRight)

        // Append x-axis and y-axis
        vis.svg.append("g")
            .attr("class", "x-axis axis timeline-axis")
            .attr("transform", `translate(0, ${vis.height})`)
            .call(vis.xAxis)

        vis.svg.append("g")
            .attr("class", "y-axisLeft axis timeline-axis")
            .attr("transform", `translate(50, 0)`)
            .call(vis.yAxisLeft)

        vis.svg.append("g")
            .attr("class", "y-axisRight axis timeline-axis")
            .attr("transform", `translate(${vis.width + vis.margin.left + vis.margin.right - 50}, 0)`)
            .call(vis.yAxisRight)

        // Radii scale
        vis.circleScale = d3.scaleLinear()
                            .domain([0, d3.max(vis.data, d => d.overall)])
                            .range([0, (vis.width / vis.data.filter(x => x.state === 'Total').length) / 2])

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'timelineTooltip')

        // Line graph
        vis.line = d3.line()
            .x(function(d) { return vis.x(new Date(d.year, 0))})
            .y(function(d) { return vis.yRight(d.overall)})
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
        // vis.y.domain([d3.min(vis.displayData, d => d.overall) - 50000, d3.max(vis.displayData, d => d.overall)])
        vis.yRight.domain([d3.min(vis.displayData, d => d.overall) - 50000, d3.max(vis.displayData, d => d.overall)])
        vis.yLeft.domain([0, d3.max(vis.displayData, d => d.overall)])
        vis.svg.select('.x-axis').call(vis.xAxis)
        vis.svg.select('.y-axisLeft').call(vis.yAxisLeft)
        vis.svg.select('.y-axisRight').call(vis.yAxisRight)

        // Create event lines
        const eventLineGroup = vis.svg.selectAll('.event-line-group')
            .data(policyEvents)
            .enter()
            .append('g')
            .attr('class', 'event-line-group')
            .attr("transform", d => `translate(${vis.x(d.date)}, ${-(vis.margin.top)})`)
            .on('mouseover', function(event, d){
                d3.select(this).selectAll('line, rect')
                    .style('stroke', '#2D375A')
                    .style('fill', '#2D375A')

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div style="border: solid grey; border-radius: 5px; background: whitesmoke; padding: 10px">
                            <h3>Event: ${d.name}</h3>
                            <h3>Date: ${d.date.toLocaleString().split(',')[0]}</h3>
                         </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this).selectAll('line, rect')
                    .style("stroke", "#A0006D")
                    .style("fill", "#A0006D")
                
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``)
            })

        eventLineGroup.append('line')
            .attr("y2", vis.height)
            .style("stroke-width", 4)
            .style("stroke", "#A0006D")
            .style("fill", "none")
        eventLineGroup.append('rect')
            .attr('width', 60)
            .attr('height', 40)
            .style("stroke-width", 4)
            .style("stroke", "#A0006D")
            .style("fill", "#A0006D")
        eventLineGroup.append('text')
            .attr("x", 30)
            .attr("y", 26)
            .style('stroke', '#F5F5F5FF')
            .style('fill', '#F5F5F5FF')
            .attr('text-anchor', 'middle')
            .attr('pointer-events', 'none')
            .text("Event")

        // Create circles
        vis.svg.selectAll(".timeline-bar")
            .data(vis.displayData)
            .enter()
            .append("rect")
            .attr('class', 'timeline-bar')
            .attr("x", d => vis.x(new Date(d.year, 0)) - (vis.x(new Date(d.year + 1, 0)) - vis.x(new Date(d.year, 0)))/2)
            .attr("y", d => vis.yLeft(d.overall))
            .attr('height', d => vis.height - vis.yLeft(d.overall))
            .attr('width', d => vis.x(new Date(d.year + 1, 0)) - vis.x(new Date(d.year, 0)))
            .attr('stroke', 'black')
            .attr('stroke-width', '2px')
            .attr("fill", '#4A8BDF')
            .attr("opacity", 0.5)
            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr('fill', '#2D375A')
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div style="border: solid grey; border-radius: 5px; background: whitesmoke; padding: 10px">
                            <h3>Year: ${d.year}</h3>
                             <h3>Number of Total Homeless: ${parseInt(d.overall).toLocaleString()}<h3>
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

        // Add the line
        vis.svg.append("path")
            .datum(vis.displayData)
            .attr("fill", "none")
            .attr("stroke", "#A0006D")
            .attr("stroke-width", 5.0)
            .attr("d", vis.line)

    }
}