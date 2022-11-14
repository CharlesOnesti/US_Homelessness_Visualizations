class DotPlotVis {
    constructor(parentElement, data) {
        this.parentElement = parentElement
        this.data = data
        this.displayData = this.data.map(x => {
            x.x = x.type * 200
            x.y = 100
            return x
        })

        this.initVis()
    }
    initVis() {
        let vis = this

        // margin conventions
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = 800 - vis.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`)

        vis.svg.append('rect')

        vis.wrangleData()
    }
    wrangleData() {
        let vis = this

        vis.displayData = vis.data.filter(_ => true)

        vis.updateVis()
    }
    updateVis() {
        let vis = this

        const updateSim = () => {
            const circles = vis.svg
                .selectAll('circle')
                .data(vis.displayData)
                .join('circle')
                .attr('r', 10)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
        }
        // Draw
        vis.force = d3.forceSimulation()
            .nodes(vis.displayData)
            .force('charge', d3.forceManyBody().strength(1))
            .force('x', d3.forceX().x(d => d.x))
            .force('y', d3.forceY().y(d => d.y))
            .force('collision', d3.forceCollide().radius(10))
            .on('tick', updateSim)




    }
}