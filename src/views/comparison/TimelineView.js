import { NUM_TIMESTEPS } from "../../global.js";
import { findMinimaLocations } from "../../util.js";

const MARGINS = {
  left: 40,
  top: 18,
  bottom: 18,
  right: 10,
};

export class TimelineView {
  topData = null;
  botData = null;

  botTime = 1;
  topTime = 1;
  playInterval = undefined;

  constructor({ container, onChange }) {
    this.container = container;
    this.onChange = onChange;

    this.svg = container.select("svg");
    this.svg.selectAll("*").remove();

    this.width = this.container.select(".svg-wrapper").node().clientWidth;
    this.height = this.container.select(".svg-wrapper").node().clientHeight;

    this.svg.attr("width", this.width).attr("height", this.height);

    console.log("TimelineView", this);

    this.setupControls();
    this.setupTimeline();
  }

  setTime({ top, bot }) {
    this.topTime = top;
    this.botTime = bot;

    this.topSliderG.attr("transform", `translate(${this.xScale(top)}, 0)`);
    this.topSliderG
      .select(".slider-label text")
      .html(
        `<tspan style="font-style: italic; font-weight: lighter;">t=</tspan>${top}`
      );
    this.botSliderG.attr("transform", `translate(${this.xScale(bot)}, 0)`);
    this.botSliderG
      .select(".slider-label text")
      .html(
        `<tspan style="font-style: italic; font-weight: lighter;">t=</tspan>${bot}`
      );
  }

  setTopData({ data }) {
    this.topData = data;
    this.drawPath({ data, scale: this.yScaleTop, name: "top-path" });
  }

  setBotData({ data }) {
    this.botData = data;
    this.drawPath({ data, scale: this.yScaleBot, name: "bot-path" });
  }

  setupControls() {
    const view = this;

    this.container.select("#play-button").on("click", function () {
      const button = d3.select(this);

      if (view.playInterval) {
        clearInterval(view.playInterval);
        view.playInterval = undefined;

        button.text("Play");
      } else {
        view.playInterval = setInterval(() => {
          view.onChange({
            top: 1 + (view.topTime % NUM_TIMESTEPS),
            bot: 1 + (view.botTime % NUM_TIMESTEPS),
          });
        }, 100);

        button.text("Pause");
      }
    });
  }

  setupTimeline() {
    this.paths = this.svg.append("g");

    this.axes = this.svg.append("g");

    this.xScale = d3
      .scaleLinear()
      .domain([1, NUM_TIMESTEPS])
      .range([MARGINS.left, this.width - MARGINS.right]);

    const xAxis = d3.axisBottom(this.xScale);

    const midpoint =
      MARGINS.top + (this.height - MARGINS.top - MARGINS.bottom) / 2;

    this.axes
      .append("g")
      .attr("class", "x-axis")
      .call(xAxis)
      .attr("transform", `translate(0, ${midpoint})`);

    this.yScaleTop = d3
      .scaleLinear()
      .domain([0, 0.5])
      .range([midpoint, MARGINS.top]);

    const yAxisTop = d3
      .axisLeft(this.yScaleTop)
      .ticks(3)
      .tickFormat(d3.format(".2~%"));

    this.axes
      .append("g")
      .attr("class", "y-axis y-axis-top")
      .call(yAxisTop)
      .attr("transform", `translate(${MARGINS.left}, 0)`);

    this.yScaleBot = d3
      .scaleLinear()
      .domain([0, 0.5])
      .range([midpoint, this.height - MARGINS.bottom]);

    const yAxisBot = d3
      .axisLeft(this.yScaleBot)
      .ticks(3)
      .tickFormat(d3.format(".2~%"));

    this.axes
      .append("g")
      .attr("class", "y-axis y-axis-bot")
      .call(yAxisBot)
      .attr("transform", `translate(${MARGINS.left}, 0)`);

    const topRange = this.yScaleTop.range();
    const botRange = this.yScaleBot.range();

    this.svg
      .append("rect")
      .attr("class", "slider-area")
      .attr("x", MARGINS.left)
      .attr("y", topRange[1])
      .attr("height", topRange[0] - topRange[1])
      .attr("width", this.width - MARGINS.left - MARGINS.right)
      .call(
        d3.drag().on("drag", (e) => {
          const t = Math.max(
            1,
            Math.min(NUM_TIMESTEPS, Math.round(this.xScale.invert(e.x)))
          );

          this.onChange({ top: t, bot: this.botTime });
        })
      );

    this.svg
      .append("rect")
      .attr("class", "slider-area")
      .attr("x", MARGINS.left)
      .attr("y", botRange[0])
      .attr("height", botRange[1] - botRange[0])
      .attr("width", this.width - MARGINS.left - MARGINS.right)
      .call(
        d3.drag().on("drag", (e) => {
          const t = Math.max(
            1,
            Math.min(NUM_TIMESTEPS, Math.round(this.xScale.invert(e.x)))
          );

          this.onChange({ bot: t, top: this.topTime });
        })
      );

    this.topSliderG = this.svg
      .append("g")
      .attr("class", "slider")
      .attr("transform", `translate(${MARGINS.left}, 0)`);

    this.topSliderG
      .append("line")
      .attr("class", "slider-bg")
      .attr("y1", topRange[1] - 2)
      .attr("y2", topRange[0])
      .attr("x1", 0)
      .attr("x2", 0);

    this.topSliderG
      .append("line")
      .attr("class", "slider-line")
      .attr("y1", topRange[1] - 2)
      .attr("y2", topRange[0])
      .attr("x1", 0)
      .attr("x2", 0);

    const topLabel = this.topSliderG
      .append("g")
      .attr("class", "slider-label")
      .attr("transform", `translate(0, ${topRange[1] - 2})`);

    topLabel
      .append("rect")
      .attr("x", -20)
      .attr("width", 40)
      .attr("height", 14)
      .attr("y", -14)
      .attr("rx", 2)
      .style("fill", "#fff4")
      .style("stroke", "#fff8");

    topLabel
      .append("text")
      .html(
        `<tspan style="font-style: italic; font-weight: lighter;">t=</tspan>1`
      )
      .attr("font-size", 12)
      .attr("y", -3)
      .attr("text-anchor", "middle");

    this.botSliderG = this.svg
      .append("g")
      .attr("class", "slider")
      .attr("transform", `translate(${MARGINS.left}, 0)`);

    this.botSliderG
      .append("line")
      .attr("class", "slider-bg")
      .attr("y1", botRange[1] + 2)
      .attr("y2", botRange[0])
      .attr("x1", 0)
      .attr("x2", 0);

    this.botSliderG
      .append("line")
      .attr("class", "slider-line")
      .attr("y1", botRange[1])
      .attr("y2", botRange[0])
      .attr("x1", 0)
      .attr("x2", 0);

    const botLabel = this.botSliderG
      .append("g")
      .attr("class", "slider-label")
      .attr("transform", `translate(0, ${botRange[1] + 2})`);

    botLabel
      .append("rect")
      .attr("x", -20)
      .attr("width", 40)
      .attr("height", 14)
      .attr("y", 0)
      .attr("rx", 2)
      .style("fill", "#fff4")
      .style("stroke", "#fff8");

    botLabel
      .append("text")
      .html(
        `<tspan style="font-style: italic; font-weight: lighter;">t=</tspan>1`
      )
      .attr("font-size", 12)
      .attr("y", 11)
      .attr("text-anchor", "middle");
  }

  drawPath({ data, scale, name }) {
    const interstitial = d3.area().y0(scale(0.5)).curve(d3.curveMonotoneX);
    const air = d3.line().curve(d3.curveMonotoneX);

    data
      .getAllFeatures()
      .then((features) => {
        const minima = findMinimaLocations(features);

        const ratios = features.map(
          ({ alveoli_area, interstitial_area }) =>
            alveoli_area / (alveoli_area + interstitial_area)
        );

        this.paths
          .selectAll(`.${name}`)
          .data([
            ratios.map((ratio, index) => [
              this.xScale(index + 1),
              scale(ratio),
            ]),
          ])
          .join("path")
          .attr("class", `ratio-path ${name}`)
          .attr("visibility", "visible")
          .attr("d", interstitial);

        this.paths
          .selectAll(`.${name}-air`)
          .data([
            ratios.map((ratio, index) => [
              this.xScale(index + 1),
              scale(ratio),
            ]),
          ])
          .join("path")
          .attr("class", `airspace ${name}-air`)
          .attr("visibility", "visible")
          .attr("d", air);

        this.paths
          .selectAll(`.${name}-minima`)
          .data(minima)
          .join("line")
          .attr("class", `${name}-minima`)
          .attr("x1", this.xScale)
          .attr("x2", this.xScale)
          .attr("y1", scale(0.5))
          .attr("y2", scale(0))
          .attr("stroke-width", 1)
          .attr("stroke", "var(--accent)")
          .attr("stroke-dasharray", "4 4");
      })
      .catch((err) => {
        console.error(err);
        d3.select(`.${name}`).attr("visibility", "hidden");
        d3.select(`.${name}-air`).attr("visibility", "hidden");
      });
  }
}
