const IMAGE_FOLDER = "./test_data/combined_images/";

export class ImageView {
  name = "";
  svg = d3.select();

  contours = [];
  currentTime = 1;

  constructor({ name, svg }) {
    this.name = name;
    this.svg = svg;

    this.contoursPromise = fetch(`./test_data/features/${name}.json`)
      .then((res) => res.json())
      .then((features) => (this.contours = features))
      .then(() => this.setTime(this.currentTime))
      .catch((err) => console.log(err));

    this.image = svg
      .append("image")
      .attr("width", 512)
      .attr("height", 512)
      .attr("y", 0)
      .attr("x", 0)
      .style("filter", "url(#blue-only)");

    this.featureG = svg.append("g").attr("class", "contour-group");

    this.setTime(1);
  }

  setTime(t) {
    this.currentTime = t;

    this.image.attr(
      "href",
      `${IMAGE_FOLDER}/${this.name}/${t.toString().padStart(6, "0")}.png`
    );

    if (this.contours[t - 1]) {
      this.featureG.attr("visibility", "visible");
      const {
        contour_centers: centers,
        contour_outlines: paths,
      } = this.contours[t - 1];

      const features = this.featureG
        .selectAll(".feature")
        .data(Object.keys(centers))
        .join("g")
        .attr("class", "feature")
        .each(function (id) {
          const g = d3.select(this);
          const center = centers[id];
          const points = paths[id];

          g.selectAll("circle")
            .data([null])
            .join("circle")
            .attr("cx", center[0])
            .attr("cy", center[1])
            .attr("r", 2)
            .attr("fill", "white");

          g.selectAll("path")
            .data([null])
            .join("path")
            .attr(
              "d",
              "M " + points.map((p) => p[0].join(", ")).join("L ") + " Z"
            )
            .attr("fill", "none")
            .attr("stroke", "white")
            .style("stroke-linejoin", "round");
        });
    } else {
      this.featureG.attr("visibility", "hidden");
    }
  }
}