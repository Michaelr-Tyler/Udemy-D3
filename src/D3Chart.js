import * as d3 from 'd3'


const urlMen = "https://udemy-react-d3.firebaseio.com/tallest_men.json"
const urlWomen = "https://udemy-react-d3.firebaseio.com/tallest_women.json"
const MARGIN = {TOP:10, BOTTOM:50, LEFT:80, RIGHT:10}
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

export default class D3Chart {
    constructor(element){
        const vis = this

        vis.svg = d3.select(element)
        .append("svg")
            .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
            .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
        .append("g")
            .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)


        //adds label to the x axis
        vis.xLabel = vis.svg.append("text")
            //width divide by 2 so it starts in the middle
            .attr("x", WIDTH / 2)
            //height plus the margin area
            .attr("y", HEIGHT + 50)
            //this anchors the text to the center starting from it's center and not the first word
            .attr("text-anchor", "middle")
            //label text
            .text("The world's tallest man")

        vis.svg.append("text")
            .attr("x", -(HEIGHT / 2))
            .attr("y", -50)
            .attr("text-anchor", "middle")
            .text("Height in cm")
            .attr("transform", "rotate(-90)")

        vis.xAxisGroup = vis.svg.append("g")
            .attr("transform", `translate(0, ${HEIGHT})`)

        vis.yAxisGroup = vis.svg.append("g")

        Promise.all([
            d3.json(urlMen), 
            d3.json(urlWomen)
        ]).then((datasets) => {
            vis.menData = datasets[0]
            vis.womenData = datasets[1]
            vis.update("men")
         })
}
    
    
    update(gender){
        const vis = this

        vis.data =(gender === "men") ? vis.menData : vis.womenData;
        vis.xLabel.text(`The world's tallest ${gender}`)
        //this loads the data and then sets the domain
        //and range of our y and x values
        const y = d3.scaleLinear()
            .domain([
                d3.min(vis.data, d => d.height) * 0.95,
                d3.max(vis.data, d =>d.height)
            ])
            .range([HEIGHT, 0])

        const x = d3.scaleBand()
            .domain(vis.data.map(d=>d.name))
            .range([0,WIDTH])
            .padding(0.4)

        const xAxisCall = d3.axisBottom(x)
        vis.xAxisGroup.transition().duration(500).call(xAxisCall)
        

        const yAxisCall = d3.axisLeft(y)
        vis.yAxisGroup.transition().duration(500).call(yAxisCall)
        
        // DATA JOIN *tells D3 which array of data we want to associate with our shapes
        const rects = vis.svg.selectAll("rect")
            .data(vis.data)
        
        //Exit *Takes a look at these selection and removes any elements that don't exist in the new array of data
        rects.exit()
        .transition()
        .duration(500)
        .attr("height", 0)
        .attr("y", HEIGHT)
        .remove()

        //UPDATE *Works on our new data and whats on the screen
        rects.transition().duration(500)
            .attr("x", d=> x(d.name))
            .attr("y", d => y(d.height))
            .attr("width", x.bandwidth)
            .attr("height", d => HEIGHT - y(d.height))

        // ENTER works with anything with our data but not on the screen yet
        rects.enter().append("rect")
            .attr("x", d=> x(d.name))
            .attr("width", x.bandwidth)
            .attr("fill", "blue")
            .attr("y", HEIGHT)
            .transition().duration(500)
                .attr("height", d => HEIGHT - y(d.height))
                .attr("y", d => y(d.height))
            
        console.log(rects)
    } 
}