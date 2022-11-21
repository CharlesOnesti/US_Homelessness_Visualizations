class DotPlotVis {
    constructor(parentElement, data) {
        this.parentElement = parentElement
        this.data = data.map(d => {
            d.year = +d.year
            d.emergency_shelter = +d.emergency_shelter
            d.overall = +d.overall
            d.transitional_housing = +d.transitional_housing
            d.pop = +d.pop
            d.unsheltered = +d.unsheltered
            return d
        })

        this.groups = [
            'emergency_shelter',
            'overall',
            'transitional_housing',
            // 'pop',
            'unsheltered',
        ]

        const row1 = 200
        const col1 = 0
        const row2 = row1+400
        const col2 = col1+400
        this.peoplePerDot = 5000
        this.jitter = 100

        this.grouping = {
            'emergency_shelter': [col1, row1],
            'overall': [col2, row2],
            'transitional_housing': [col2, row1],
            'pop': [0, 0],
            'unsheltered': [col1,row2],
        }

        this.colorScale = d3.scaleOrdinal()
            .domain(this.groups)
            .range(["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f"])

        this.initVis()
    }
    initVis() {
        let vis = this

        // margin conventions
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = 800 - vis.margin.left - vis.margin.right;
        vis.height = 800 - vis.margin.top - vis.margin.bottom;
        vis.groupRadius = 150

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            // .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`)

        const displayYear = vis.svg.append('text')
            .text(dotPlotYear)
            .attr('id', 'display-year')
            .attr('text-anchor', 'middle')
            .attr('x', vis.width/2 + vis.margin.left)
            .attr('y', vis.height/2 + vis.margin.top)

        // const circles = vis.svg.append('g')
        vis.groups.forEach(g => {
            const group = vis.svg.append('g')
                .attr('transform', `translate(${vis.grouping[g][0] + 200}, ${vis.grouping[g][1]})`)
            group.append('circle')
                .attr('class', `dotplot-group dotplot-${g}`)
                .attr('r', vis.groupRadius)
                .attr('stroke', vis.colorScale(g))
                .attr('stroke-width', 6)
                .attr('fill', 'white')
            group.append('text')
                .attr('class', `dotplot-text-${g}`)
                .attr('text-anchor', 'middle')
                .attr('transform', `translate(0, ${-vis.groupRadius - 20})`)
        })

        // Time Slider
        const dataTime = d3.range(0, 14).map(function(d) {
            return new Date(2007 + d, 10, 3);
        });

        const sliderTime = d3.sliderBottom()
            .min(d3.min(dataTime))
            .max(d3.max(dataTime))
            .step(1000 * 60 * 60 * 24 * 365)
            .width(400)
            .tickFormat(d3.timeFormat('%Y'))
            .tickValues(dataTime)
            .default(new Date(2007, 10, 3))
            .on('onchange', val => {
                if (dotPlotYear !== parseInt(d3.timeFormat('%Y')(val))) {
                    dotPlotYear = parseInt(d3.timeFormat('%Y')(val))
                    displayYear.text(dotPlotYear)
                    vis.wrangleData();
                }
            });

        const gTime = d3.select('div#slider-time')
            .append('svg')
            .attr('class', 'dotplot-year-slider')
            .attr('width', 500)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(30,30)');
        gTime.call(sliderTime);

        vis.wrangleData()
    }
    wrangleData() {
        let vis = this
        vis.selectedData = vis.data.filter(x => x.year === dotPlotYear).find(x => x.state === dotPlotState)
        vis.displayData = [
            'emergency_shelter',
            'overall',
            'transitional_housing',
            // 'pop',
            'unsheltered',
        ].map(cat => {
            return d3.packSiblings(d3.range(0,vis.selectedData[cat] / vis.peoplePerDot).map(_ => {
                const jit = cat === 'overall' ? vis.jitter*2 : vis.jitter
                return {
                    'state': vis.selectedData.state,
                    'type': cat,
                    'r': 10,
                }
            }))
        }).flat()

        vis.displayData = vis.displayData.map(x => {
            x.x += vis.grouping[x.type][0] + 200
            x.y += vis.grouping[x.type][1]
            return x
        })
        vis.updateVis()
    }
    updateVis() {
        let vis = this

        const select = vis.svg
            .selectAll('.not-overall')
            .data(vis.displayData.filter(t => t.type !== 'overall'))
        select.enter()
            .append('circle')
            .attr('class', 'dot not-overall')
            .attr('r', 10)
            .merge(select)
            .transition().duration(500)
            .attr('fill', d => vis.colorScale(d.type))
            .attr('stroke', 'black')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        select.exit().remove()
        const selectOverall = vis.svg
            .selectAll('.overall')
            .data(vis.displayData.filter(t => t.type === 'overall'))
        selectOverall.enter()
            .append('circle')
            // .join('circle')
            .attr('class', 'dot overall')
            .attr('r', 10)
            .merge(selectOverall)
            .transition().duration(500)
            .attr('fill', d => vis.colorScale(d.type))
            .attr('stroke', 'black')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        selectOverall.exit().remove()


        vis.groups.forEach(g => {
            vis.svg.select(`.dotplot-text-${g}`)
                .text(`${g.split('_').join(' ')
                    .replace(
                        /(^\w{1})|(\s+\w{1})/g,
                        letter => letter.toUpperCase()
                    )}: ${vis.selectedData[g].toLocaleString()}`)
        })

    }
}