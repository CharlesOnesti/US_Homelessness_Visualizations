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

        const row1 = 180
        const col1 = 0
        const row2 = row1+350
        const col2 = col1+350
        this.peoplePerDot = 4000
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
        vis.height = 760 - vis.margin.top - vis.margin.bottom;
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
            .attr('x', vis.width/2)
            .attr('y', vis.height/2)

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
                .attr('transform', `translate(0, ${-vis.groupRadius - 10})`)
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
            return d3.range(0,vis.selectedData[cat] / vis.peoplePerDot).map(_ => {
                const jit = cat === 'overall' ? vis.jitter*2 : vis.jitter
                return {
                    'state': vis.selectedData.state,
                    'type': cat,
                    'x': vis.grouping[cat][0] + 200 + (Math.random()*jit - jit/2),
                    'y': vis.grouping[cat][1] + (Math.random()*jit - jit/2),
                }
            })
        }).flat()
        vis.updateVis()
    }
    updateVis() {
        let vis = this

        const updateSimNonOverall = () => {
            vis.svg
                .selectAll('.non-overall')
                .data(vis.displayData.filter(t => t.type !== 'overall'))
                .join('circle')
                .transition().duration(80)
                .attr('class', 'dot non-overall')
                .attr('r', 10)
                .attr('fill', d => vis.colorScale(d.type))
                .attr('stroke', 'black')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
        }
        const updateSimOverall = () => {
            vis.svg
                .selectAll('.overall')
                .data(vis.displayData.filter(t => t.type === 'overall'))
                .join('circle')
                .attr('class', 'dot overall')
                .attr('r', 10)
                .attr('fill', d => vis.colorScale(d.type))
                .attr('stroke', 'black')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
        }

        // Draw
        vis.force = d3.forceSimulation()
            .nodes(vis.displayData.filter(t => t.type !== 'overall'), k => k.index)
            .force('charge', d3.forceManyBody().strength(1))
            .force('x', d3.forceX().x(d => d.x))
            .force('y', d3.forceY().y(d => d.y))
            .force('collision', d3.forceCollide().radius(10))
            .on('tick', updateSimNonOverall)
        vis.force = d3.forceSimulation()
            .nodes(vis.displayData.filter(t => t.type === 'overall'))
            .force('charge', d3.forceManyBody().strength(3))
            .force('x', d3.forceX().x(d => d.x))
            .force('y', d3.forceY().y(d => d.y))
            .force('collision', d3.forceCollide().radius(10))
            .on('tick', updateSimOverall)


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