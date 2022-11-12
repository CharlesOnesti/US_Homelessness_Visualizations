class templateVis {
    constructor(parentElement, data) {
        this.parentElement = parentElement
        this.data = data
        this.displayData = []

        this.initVis()
    }
    initVis() {
        let vis = this

        // margin conventions
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // Scales
        vis.x = d3.scaleLinear()
            .range([0, vis.width])
        vis.y = d3.scaleLinear()
            .range([vis.height, 0])

        // xAxis
        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .call(vis.xAxis)

        // yAxis
        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
        vis.svg.append("g")
            .attr("class", "y-axis axis")
            .call(vis.yAxis)

        vis.wrangleData()
    }
    wrangleData() {
        let vis = this

        vis.displayData = vis.data.filter(_ => true)

        vis.updateVis()
    }
    updateVis() {
        let vis = this

        // Update domains
        // vis.x.domain([0, d3.max(vis.displayData, x => x)]) TEMP
        // vis.y.domain([d3.max(vis.displayData, x => x), 0]) TEMP

        // Call axis functions with the new domain
        // vis.svg.select(".y-axis")
        //     .transition().duration(800)
        //     .call(vis.yAxis) TEMP

        // Draw
        const selection = vis.svg.selectAll('.temp')
            .data(vis.displayData, k => k)

        selection.enter()
            .append('g')
            .attr('class', 'temp')
            .merge(selection)
            .transition().duration(400)
            .attr('x', 0)
            .attr('y', 0)


    }
}