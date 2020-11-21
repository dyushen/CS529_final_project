import { NUM_TIMESTEPS } from "../../global.js";
import {
  chuckFeaturesByMinima,
  findMinimaLocations,
  findTimeInCycles,
} from "../../util.js";

const MARGINS = {
  left: 30,
  top: 50,
  bottom: 36,
  right: 14,
};

export class RespCycleView {
  cycles = null;

  constructor({ data, container }) {
    this.data = data;
    this.container = container;

    this.svg = container.select("svg");
    this.svg.selectAll("*").remove();

    this.width = this.container.node().clientWidth;
    this.height = this.container.node().clientHeight;

    this.svg
      .attr("width", this.container.node().clientWidth)
      .attr("height", this.container.node().clientHeight);

    this.setupChart();

    this.drawChart();
  }

  setTime(t) {
    // console.log("RespCycleView time:", t);
    // this.drawChart();
    if (this.cycles) {
      const loc = findTimeInCycles(t - 1, this.cycles);
      const cyc = this.cycles[loc.c];

      this.paths.selectAll(".cycle").classed("highlighted", false);

      this.paths.select(`.cycle-${loc.c}`).classed("highlighted", true).raise();

      if (loc.c !== 0 && loc.c !== this.cycles.length - 1) {
        this.timePoint
          .attr("visibility", "visible")
          .attr("cx", this.timeScale(loc.t / (cyc.length - 1)))
          .attr(
            "cy",
            this.yScale(
              cyc[loc.t].alveoli_area /
                (cyc[loc.t].alveoli_area + cyc[loc.t].interstitial_area)
            )
          );
      } else {
        this.timePoint.attr("visibility", "hidden");
      }
    }
  }

  setupChart() {
    this.svg
      .append("text")
      .attr("x", 4)
      .attr("y", MARGINS.top - 30)
      .attr("font-size", 16)
      .attr("font-weight", 300)
      .text("Respiratory Cycles");

    this.svg
      .append("text")
      .attr("x", this.width - 4)
      .attr("y", MARGINS.top - 12)
      .attr("font-size", 12)
      .attr("font-style", "italic")
      .style("text-anchor", "end")
      .style("fill", "var(--selected)")
      .text("Current Full Cycle");

    const axisLabel = this.svg
      .append("text")
      .attr("x", 4)
      .attr("y", MARGINS.top - 12)
      .attr("font-size", 12)
      .attr("text-anchor", "left");

    axisLabel
      .append("tspan")
      .style("color", "var(--alv)")
      .style("font-style", "italic")
      .text("Alveolar");

    axisLabel.append("tspan").text(" / ");

    axisLabel
      .append("tspan")
      .style("font-style", "italic")
      .style("color", "var(--inter)")
      .text("Interstitial");

    this.svg
      .append("line")
      .attr("class", "cycle highlighted")
      .style("stroke-linecap", "round")
      .attr("x1", this.width - 36)
      .attr("x2", this.width - 4)
      .attr("y1", MARGINS.top)
      .attr("y2", MARGINS.top);

    this.svg
      .append("circle")
      .attr("class", "time-point")
      .attr("r", 6)
      .attr("cx", this.width - 20)
      .attr("cy", MARGINS.top);

    const axesG = this.svg.append("g").attr("class", "axes-g");

    this.timeScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([MARGINS.left, this.width - MARGINS.right]);

    this.yScale = d3
      .scaleLinear()
      .domain([0, 0.5])
      .range([this.height - MARGINS.bottom, MARGINS.top]);

    this.colorScale = d3.scaleSequential(d3.interpolatePuBu).domain([0, 1.25]);

    const timeAxis = d3
      .axisBottom(this.timeScale)
      .ticks(4)
      .tickFormat(d3.format(".0~%"));
    const yAxis = d3
      .axisLeft(this.yScale)
      .ticks(6)
      .tickFormat(d3.format(".1~%"));

    axesG
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${this.height - MARGINS.bottom})`)
      .call(timeAxis);

    axesG
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${MARGINS.left}, 0)`)
      .call(yAxis);

    this.line = d3.line().curve(d3.curveMonotoneX);

    this.paths = this.svg.append("g").attr("class", "cycles");

    this.timePoint = this.svg
      .append("circle")
      .attr("class", "time-point")
      .attr("r", 6)
      .attr("visibility", "hidden");
  }

  drawChart() {
    this.data
      .getAllFeatures()
      .then((features) => {
        const minima = findMinimaLocations(features);
        const cycles = chuckFeaturesByMinima(features, minima);

        this.cycles = cycles;

        // const maxArea = d3.max(cycles.flat(), (t) => t.alveoli_area);

        this.paths
          .selectAll(".cycle")
          .data(cycles.slice(1, -1))
          .join("path")
          .attr("class", (d, i) => `cycle cycle-${i + 1}`)
          .attr("d", (cyc, i) =>
            this.line(
              cyc.map(({ alveoli_area, interstitial_area }, i) => [
                this.timeScale(i / (cyc.length - 1)),
                this.yScale(alveoli_area / (alveoli_area + interstitial_area)),
              ])
            )
          )
          .attr("stroke", (d, i) => this.colorScale(i / (cycles.length - 1)));
      })
      .catch(console.error);
  }
}
