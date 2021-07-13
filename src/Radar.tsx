import { useEffect } from "react";
import * as d3 from "d3";

const Radar = () => {
  useEffect(() => {
    const tooltip = d3.select(".tooltip");
    const generateAndDrawLevels = (levelsCount: number, sideCount: number) => {
      for (let level = 1; level <= levelsCount; level++) {
        const hyp = (level / levelsCount) * r_0;

        const points = [];
        for (let vertex = 0; vertex < sideCount; vertex++) {
          const theta = vertex * polyangle;

          points.push(generatePoint({ length: hyp, angle: theta }));
        }
        const group = g.append("g").attr("class", "levels");
        drawPath([...points], group);
      }
    };
    const generateData = (length: number) => {
      const data = [];
      const min = 25;
      const max = 100;

      for (let i = 0; i < length; i++) {
        data.push({
          name: "Label",
          value: Math.round(min + (max - min) * Math.random()),
        });
      }

      return data;
    };

    const genTicks = (levels: number) => {
      const ticks = [];
      const step = 100 / levels;
      for (let i = 0; i <= levels; i++) {
        const num = step * i;
        if (Number.isInteger(step)) {
          ticks.push(num);
        } else {
          ticks.push(num.toFixed(2));
        }
      }
      return ticks;
    };

    const drawPath = (
      points: [number, number][],
      parent: d3.Selection<SVGGElement, unknown, HTMLElement, any>
    ) => {
      const lineGenerator = d3
        .line()
        .x((d) => d[0])
        .y((d) => d[1])
        .curve(d3.curveCardinalClosed.tension(0.6));

      parent
        .append("path")
        .attr("d", lineGenerator(points) as string)
        .attr("pointer-events", "visibleStroke")
        .attr("stroke", "green")
        .on("mouseenter", function () {
          const ele = d3.select(this);
          ele.attr("stroke", "red");
        })
        .on("mouseleave", function () {
          const ele = d3.select(this);
          ele.attr("stroke", "green");
        });
    };

    const drawLabels = (
      dataset: {
        name: string;
        value: number;
      }[],
      sideCount: number
    ) => {
      const drawText = (
        text: string,
        point: [number, number],
        isAxis: boolean,
        group: any
      ) => {
        if (isAxis) {
          const xSpacing = text.toString().includes(".") ? 30 : 22;
          group
            .append("text")
            .attr("x", point[0])
            .attr("y", point[1] + 5)
            .html(text)
            .style("text-anchor", "middle")
            .attr("fill", "darkgrey")
            .style("font-size", "12px")
            .style("font-family", "sans-serif");
        } else {
          group
            .append("text")

            .attr("x", point[0])
            .attr("y", point[1] + 3)
            .html(text)
            .style("text-anchor", "middle")
            .attr("fill", "darkgrey")
            .style("font-size", "12px")
            .style("font-family", "sans-serif");
          group
            .append("circle")
            .attr("cx", () => {
              return point[0];
            })
            .attr("cy", () => point[1])
            .attr("r", 2);
        }
      };
      const groupL = g.append("g").attr("class", "labels");
      for (let vertex = 0; vertex < sideCount; vertex++) {
        const angle = vertex * polyangle;
        const label = dataset[vertex].name;
        const point = generatePoint({ length: 0.93 * (size / 2), angle });
        drawText(label, point, false, groupL);
      }
    };

    const generatePoint = ({
      length,
      angle,
    }: {
      length: number;
      angle: number;
    }): [number, number] => {
      return [
        center[0] + length * Math.sin(offset - angle),
        center[1] + length * Math.cos(offset - angle),
      ];
    };

    const NUM_OF_SIDES = 9,
      NUM_OF_LEVEL = 4,
      size = Math.min(window.innerWidth, window.innerHeight, 400),
      offset = Math.PI,
      polyangle = (Math.PI * 2) / NUM_OF_SIDES,
      r = 0.8 * size,
      r_0 = r / 2,
      center = [size / 2, size / 2];

    const ticks = genTicks(NUM_OF_LEVEL);
    const dataset = generateData(NUM_OF_SIDES);

    const g = d3
      .select(".radar")
      .append("svg")
      .attr("width", size)
      .attr("height", size)
      .append("g");
    const defs = g.append("defs");

    const bgGradient = defs
      .append("linearGradient")
      .attr("id", "bg-gradient")
      .attr("y2", "-13.29%")
      .attr("x1", "102.53%")
      .attr("x2", "102.53%")
      .attr("y1", "127.85%")
      .attr("gradientTransform", "rotate(15.85)");

    bgGradient
      .append("stop")
      .attr("stop-color", "#418BFA")
      .attr("offset", "0%");

    bgGradient
      .append("stop")
      .attr("stop-color", "#134DA4")
      .attr("offset", "100%");

    let points: [number, number][] = [];
    const length = 100;
    for (let vertex = 0; vertex < NUM_OF_SIDES; vertex++) {
      const theta = vertex * polyangle;

      points.push(generatePoint({ length, angle: theta }));
    }
    const generateAndDrawLines = (sideCount: number) => {
      const group = g.append("g").attr("class", "grid-lines");
      for (let vertex = 1; vertex <= sideCount; vertex++) {
        const theta = vertex * polyangle;
        const point = generatePoint({ length: r_0, angle: theta });

        drawPath([[size / 2, size / 2], point], group);
      }
    };
    const drawCircles = (
      points: {
        point: [number, number];
        value: number;
      }[]
    ) => {
      g.append("g")
        .attr("class", "indic")
        .selectAll("circle")
        .data(points)
        .enter()
        .append("circle")
        .attr("cx", (d) => {
          return d.point[0];
        })
        .attr("cy", (d) => d.point[1])
        .attr("r", 2)
        .on("mouseenter", (event, d) => {
          tooltip.style("opacity", 1);
          const { x, y } = event;
          tooltip.style("top", `${y - 20}px`);
          tooltip.style("left", `${x + 15}px`);
          tooltip.text(d.value);
        })
        .on("mouseleave", (d) => {
          tooltip.style("opacity", 0);
        });
    };
    const scale = d3.scaleLinear().domain([0, 100]).range([0, r_0]);
    const drawData = (
      dataset: {
        name: string;
        value: number;
      }[],
      n: number
    ) => {
      const points: { point: [number, number]; value: number }[] = [];
      dataset.forEach((d, i) => {
        const len = scale(d.value);
        const theta = i * ((2 * Math.PI) / n);

        points.push({
          point: generatePoint({ length: len, angle: theta }),
          value: d.value,
        });
      });

      const group = g.append("g").attr("class", "shape");

      drawPath(
        [...(points.map((d) => [...d.point]) as [number, number][])],
        group
      );
      drawCircles(points);
    };
    generateAndDrawLevels(NUM_OF_LEVEL, NUM_OF_SIDES);
    generateAndDrawLines(NUM_OF_SIDES);

    const dataset2 = generateData(NUM_OF_SIDES);
    const dataset3 = generateData(NUM_OF_SIDES);
    drawData(dataset, NUM_OF_SIDES);
    drawData(dataset2, NUM_OF_SIDES);
    drawData(dataset3, NUM_OF_SIDES);
    drawLabels(dataset, NUM_OF_SIDES);
  }, []);
  return (
    <div className='radar'>
      <div className='tooltip' />
    </div>
  );
};

export default Radar;
