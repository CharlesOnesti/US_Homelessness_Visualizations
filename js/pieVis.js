class PieVis {

    // constructor method to initialize Donut object
    constructor(parentElement, data) {
        this.parentElement = parentElement
        this.data = data
        this.displayData = []
        this.colorsScale = d3.scaleLinear()
            .range(["#FFFFFF", "#136D70"])

        this.initVis()
    }

    initVis() {
        let vis = this

        vis.margin = {top: 40, right: 40, bottom: 60, left: 130};

        vis.width = 600 - vis.margin.left - vis.margin.right
        vis.height = 600 - vis.margin.top - vis.margin.bottom

        vis.svg = d3.select("#" + vis.parentElement)
                    .append("svg")
                    .attr("width", vis.width + vis.margin.left + vis.margin.right)
                    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
                    .append('g')

        // Add title
        vis.svg.append('g')
            .attr('class', 'donut-title')
            .append('text')
            .text('Title for Pie Chart')
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle')

        vis.donutGroup = vis.svg.append('g')
                        .attr('class', 'donut-chart')
                        .attr("transform", "translate(" + vis.width / 2 + "," + vis.height / 2 + ")")


        let outerRadius = vis.width / 2;
        let innerRadius = 0;

        // Define a default pie layout
        vis.pie = d3.pie()
            .value(d => d.value)

        // Path generator for the pie segments
        vis.arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)

        // vis.tooltip = d3.select("body").append('div')
        //     .attr('class', "tooltip")
        //     .attr('id', 'donutTooltip')

        // Wrangle data
        vis.wrangleData()
    }

    wrangleData() {
        let vis = this
        const totals = vis.data.filter(x => x.state === 'Total')[0]
        vis.displayData = Object.keys(totals).filter(x => x && x !== 'state').map(x => {
            return {'key': x, "value": totals[x]}
        })
        console.log(vis.displayData)

        vis.updateVis()
    }

    updateVis() {
        let vis = this

        // Bind data
        let arcs = vis.donutGroup.selectAll(".arc")
            .data(vis.pie(vis.displayData))

        // Append paths
        arcs.enter()
            .append("path")
            .attr("class", "arc")
            // .on('mouseover', function(event, d){
            //     d3.select(this)
            //         .attr('stroke-width', '2px')
            //         .attr('stroke', 'black')
            //         .attr('fill', 'rgba(173,222,255,0.62)')
            //     vis.tooltip
            //         .style("opacity", 1)
            //         .style("left", event.pageX + 20 + "px")
            //         .style("top", event.pageY + "px")
            //         .html(`
            //              <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
            //                  <h3>Arc with index #${d.index}<h3>
            //                  <h4> value: ${d.value}</h4>
            //                  <h4> startAngle: ${d.startAngle}</h4>
            //                  <h4> endAngle: ${d.endAngle}</h4>
            //                  <h4> data: ${JSON.stringify(d.data)}</h4>
            //              </div>`);
            // })
            // .on('mouseout', function(event, d){
            //     d3.select(this)
            //         .attr('stroke-width', '0px')
            //         .attr("fill", d => d.data.color)
            //
            //     vis.tooltip
            //         .style("opacity", 0)
            //         .style("left", 0)
            //         .style("top", 0)
            //         .html(``);
            // })
            .merge(arcs)
            .attr("d", vis.arc)
            .style("fill", function(d, index) { return vis.colorsScale(index); });

        arcs.exit().remove()

    }

}