class PieVis {

    // constructor method to initialize Pie object
    constructor(parentElement, data, chartType) {
        this.parentElement = parentElement
        this.data = data
        this.chartType = chartType
        this.displayData = []
        this.circleColors = ['#A0006D','#2D375A', '#4A8BDF', '#F0C3EB', '#000000', '#ED47B9', '#ABB0B8']
        this.initVis()
    }

    initVis() {
        let vis = this

        vis.margin = {top: 40, right: 40, bottom: 60, left: 130};

        vis.width = 550 - vis.margin.left - vis.margin.right
        vis.height = 550 - vis.margin.top - vis.margin.bottom

        vis.svg = d3.select("#" + vis.parentElement)
                    .append("svg")
                    .attr("width", vis.width + vis.margin.left + vis.margin.right + 10)
                    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
                    .append('g')
                    .attr("class", "pie-svg")

        // Add title
        vis.svg.append('g')
            .attr('class', 'pie-title')
            .append('text')
            .text(vis.chartType)
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle')

        vis.pieGroup = vis.svg.append('g')
                        .attr('class', 'pie-chart')
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

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'pieTooltip')

        // Create legend group
        vis.legendGroup = vis.svg.append("g")
            .attr("transform", "translate(0, 425)")

        // Wrangle data
        vis.wrangleData()
    }

    wrangleData() {
        let vis = this
        const totals = vis.data.filter(x => x.state === 'Total')[0]
        vis.displayData = Object.keys(totals).filter(x => x && x !== 'state').map(x => {
            return {'key': x, "value": totals[x]}
        })
        if (vis.chartType === "Gender") {
            vis.displayData = vis.displayData.filter(x => x.key === 'Female' || x.key === 'Male' ||
                x.key === 'Transgender_or_Non_Conforming')
        } else {
            vis.displayData = vis.displayData.filter(x => x.key === 'White' || x.key === 'Black' ||
                x.key === 'Hispanic_or_Latino' || x.key === 'Other')
        }

        vis.updateVis()
    }

    updateVis() {
        let vis = this
        let color = d3.scaleOrdinal(vis.circleColors)

        // Bind data
        let arcs = vis.pieGroup.selectAll(".arc")
            .data(vis.pie(vis.displayData))

        // Append paths
        arcs.data(vis.pie(vis.displayData))
            .enter()
            .append("path")
            .attr("id", d => d.data.key)
            .attr("class", "arc")
            .on('mouseover', function(event, d){
                let a = d3.select(this)
                    .attr('stroke-width', '4px')
                    .attr('stroke', 'black')
                a.raise()
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div style="border: solid grey; border-radius: 5px; background: whitesmoke; padding: 20px">
                             <h3>${d.data.key.split("_").join(" ")}<h3>
                             <h4>${(d.data.value/326126 * 100).toFixed(2)}%</h4>
                             <h4>${parseInt((d.data.value), 10).toLocaleString()} People</h4>
                         </div>`)
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .attr("d", vis.arc)
            .style("fill", function(d, index) { return color(index); });

        arcs.exit().remove()

        // Create legend colors
        vis.legendGroup.selectAll(".rect")
            .data(vis.displayData)
            .enter()
            .append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .attr("x", 0)
            .attr("y", (d,i) => i * 30)
            .attr("fill", (d,i) => vis.circleColors[i])
            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                vis.highlightSegment(d)
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                vis.unhighlightSegment(d)
            })

        // Create legend labels
        vis.legendGroup.selectAll(".text")
            .data(vis.displayData)
            .enter()
            .append("text")
            .text(d => d.key.split("_").join(" "))
            .attr("x", 25)
            .attr("y", (d,i) => i * 30 + 17)
            .attr("id", "pie-legend")
            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '1px')
                    .attr('stroke', 'black')
                vis.highlightSegment(d)
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                vis.unhighlightSegment(d)
            })

    }

    highlightSegment(d) {
        let a = d3.selectAll("#" + d.key)
            .attr('stroke-width', '4px')
            .attr('stroke', 'black')
        a.raise()
    }

    unhighlightSegment(d) {
        d3.selectAll("#" + d.key)
            .attr('stroke-width', '0px')
    }

}