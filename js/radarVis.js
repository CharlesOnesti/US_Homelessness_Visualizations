

class RadarVis {
    constructor(parentElement, data) {
        this.parentElement = parentElement
        this.data = data
        this.displayData = []
        this.initVis()
    }
    angleToCoordinate(angle, value){
        let vis = this
        let x = Math.cos(angle) * vis.radialScale(value);
        let y = Math.sin(angle) * vis.radialScale(value);
        return {"x": vis.width/2 + x, "y": vis.height/2 - y};
    }
    getPathCoordinates(data_point){
        let coordinates = [];
        for (let i = 0; i < this.features.length; i++){
            let ft_name = this.features[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
            coordinates.push({...this.angleToCoordinate(angle, data_point[ft_name]), 'name': ft_name});
        }
        return coordinates;
    }
    initVis() {
        let vis = this

        // margin conventions
        vis.margin = {top: 20, right: 0, bottom: 20, left: 0};
        vis.width = 800 - vis.margin.left - vis.margin.right;
        vis.height = 800 - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)

        // Scales
        vis.radialScale = d3.scaleLinear()
            .domain([0,10])
            .range([0,250]);
        let ticks = [2,4,6,8,10];

        ticks.forEach(t =>
            vis.svg.append("circle")
                .attr("cx", vis.width/2)
                .attr("cy", vis.height/2)
                .attr("fill", "none")
                .attr("stroke", "gray")
                .attr("r", vis.radialScale(t))
        );

        vis.features = Object.keys(vis.data[0]).filter(x => x !== 'name')

        // Axes
        vis.features.forEach((ft_name, i) => {
            let angle = (Math.PI / 2) + (2 * Math.PI * i / vis.features.length);
            let line_coordinate = vis.angleToCoordinate(angle, 10);
            let label_coordinate = vis.angleToCoordinate(angle, 11);

            //draw axis line
            vis.svg.append("line")
                .attr("x1", vis.width/2)
                .attr("y1", vis.height/2)
                .attr("x2", line_coordinate.x)
                .attr("y2", line_coordinate.y)
                .attr("stroke","black");

            //draw axis label
            vis.svg.append("text")
                .attr("x", label_coordinate.x)
                .attr("y", label_coordinate.y)
                .attr('text-anchor', angle > 5 ? 'start' : (angle < 2 ? 'middle' : 'end'))// 'middle')
                .text(ft_name);
        })

        // Lines
        vis.line = d3.line()
            .x(d => d.x)
            .y(d => d.y);
        vis.colors = d3.scaleOrdinal()
            .domain(vis.data.map(x => x.name))
            .range(['#4A8BDF','#2D375A', '#ABB0B8', '#A0006D', '#F0C3EB', '#ABB0B8']);
            //['#4A8BDF','#2D375A', '#A0006D','#F0C3EB'
        // add tooltip
        vis.tooltip = d3.select('body')
            .append("div")
            .attr('class', "tooltip")

        vis.wrangleData()
    }
    wrangleData() {
        let vis = this

        vis.scales = {};
        vis.features.forEach(f => {
            vis.scales[f] = d3.scaleLinear()
                .domain([0, d3.max(vis.data, d => d[f])])
                .range([1,9])
        })

        vis.displayData = vis.data.map(x => {
            const temp = {...x}
            vis.features.forEach(feature => {
                const featureScale = vis.scales[feature]
                temp[feature] = featureScale(temp[feature])
            })
            return temp
        }).filter(x => radarState === 'All' ? true : x.name === radarState)

        vis.updateVis()
    }
    updateVis() {
        let vis = this
        console.log(vis.displayData)
        // Draw
        const paths = vis.svg.selectAll('.radar-path')
            .data(vis.displayData)
        paths.enter().append('path')
            .attr('class', d => `radar-path radar-path-${d.name.split(' ').join('_')}`)
            .attr("stroke-opacity", 1)
            .attr("opacity", 0.5)
            .attr("stroke-width", 3)
            .merge(paths)
            .datum(d => vis.getPathCoordinates(d).map(y => {
                y.state = d.name
                return y
            }))
            .transition().duration(400)
            .attr("d",vis.line)
            .attr("stroke", d => vis.colors(d[0].state))
            .attr("fill", d => vis.colors(d[0].state))
        paths.exit().remove()
        const circles = vis.svg.selectAll(`.radar-circle`)
            .data(vis.displayData.map(x => vis.getPathCoordinates(x).map(y => {
                y.state = x.name
                return y
            })).flat())
        circles.enter().append('circle')
            .attr('class', `radar-circle`)
            .on('mouseover', function(event, d) {
                vis.svg.select(`.radar-path-${d.state.split(' ').join('_')}`)
                    .attr('fill', 'green')
                    .attr('stroke', 'green')

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", (event.pageX + 10) + 'px') //event.pageX & event.pageY refer to the mouse Coors on the webpage, not the Coors inside the svg
                    .style("top", (event.pageY + 20) + 'px')
                    .html(`
                         <div>
                             <h5>${vis.data.find(x => x.name === d.state)[d.name]}</h5>
                         </div>
                    `)
            })
            .on('mouseout', function (event, d) {
                vis.svg.select(`.radar-path-${d.state.split(' ').join('_')}`)
                    .attr("stroke", d => vis.colors(d[0].state))
                    .attr("fill", d => vis.colors(d[0].state))

                vis.tooltip
                    .style("opacity", 0)
            })
            .merge(circles)
            .transition().duration(400)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 7)
            .attr('fill', d => vis.colors(d.state))

        circles.exit().remove()
    }
}