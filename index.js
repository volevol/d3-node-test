const D3Node = require("d3-node");

function line({
    data,
    selector: _selector = "#chart",
    container: _container = `
    <div id="container">
      <div id="chart"></div>
    </div>
  `,
    style: _style = "",
    width: _width = 150,
    height: _height = 40,
    margin: _margin = { top: 2, right: 2, bottom: 2, left: 2 },
    lineWidth: _lineWidth = 2,
} = {}) {
    const d3n = new D3Node({
        selector: _selector,
        svgStyles: _style,
        container: _container,
    });

    const d3 = d3n.d3;

    const width = _width + _margin.left + _margin.right;
    const height = _height + _margin.top + _margin.bottom;

    const svg = d3n
        .createSVG(width, height)
        .append("g")
        .attr("transform", `translate(${_margin.left}, ${_margin.top})`);

    const g = svg.append("g");

    const { allKeys } = data;

    const xScale = d3
        .scaleLinear()
        .domain(allKeys ? d3.extent(allKeys) : d3.extent(data, (d) => d.key))
        .rangeRound([0,width]);

    const yScale = d3
        .scaleLinear()
        .domain(
            allKeys
                ? [
                      d3.min(data, (d) => d3.min(d, (v) => v.value)),
                      d3.max(data, (d) => d3.max(d, (v) => v.value)),
                  ]
                : d3.extent(data, (d) => d.value)
        )
        .rangeRound([_height, 0]);

    const lineChart = d3
        .line()
        .x((d) => xScale(d.key))
        .y((d) => yScale(d.value));

    g.append("linearGradient")
        .attr("id", "line-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", xScale(d3.max(data, (d) => d3.max(d, (v) => v.key))))
        .attr("y1", 0)
        .attr("x2", xScale(d3.min(data, (d) => d3.min(d, (v) => v.key))))
        .attr("y2", 0)
        .selectAll("stop")
        .data([
            { offset: "0%", color: "#F9D423" },
            { offset: "100%", color: "#E65C00" },

            // { offset: "0%", color: "#2D9EE0" },
            // { offset: "50%", color: "#2F80ED" },
            // { offset: "100%", color: "#091E3A" },

            // { offset: "0%", color: "#4B4F52" },
            // { offset: "100%", color: "#989999" },
        ])
        .enter()
        .append("stop")
        .attr("offset", (d) => d.offset)
        .attr("stop-color", (d) => d.color);

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "url(#line-gradient)")
        .attr("stroke-width", _lineWidth)
        .attr("d", lineChart);

    return d3n;
}

module.exports = line;
