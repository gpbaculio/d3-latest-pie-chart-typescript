import React, { useEffect } from "react";

import * as d3 from "d3";
import { PieArcDatum } from "d3";

const Pie = () => {
  useEffect(() => {
    const data = [
      {
        age: "0-10",
        population: 1,
      },
      {
        age: "10-20",
        population: 2,
      },
      {
        age: "20-30",
        population: 3,
      },
      {
        age: "30-40",
        population: 4,
      },
    ];

    //pie
    const svg = d3
      .select(".pie")
      .append("svg")
      .attr("width", 300)
      .attr("height", 300)
      .append("g")
      .attr("transform", "translate(" + 300 / 2 + "," + 300 / 2 + ")");
    interface PieData {
      age: string;
      population: number;
    }

    const pie = d3
      .pie<void, PieData>()
      .sort(null)
      .value((d) => d.population);

    const arc = d3
      .arc<PieArcDatum<PieData>>()
      .innerRadius(0)
      .outerRadius(Math.min(300, 300) / 2 - 1)
      .cornerRadius(12);

    const arcLabel = function () {
      const radius = (Math.min(300, 300) / 2) * 0.8;
      return d3
        .arc<PieArcDatum<PieData>>()
        .innerRadius(radius)
        .outerRadius(radius);
    };

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.age))
      .range(
        d3
          .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
          .reverse()
      );

    const arcs = pie(data);

    svg
      .append("g")
      .attr("stroke", "white")
      .selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("fill", (d) => color(d.data.age) as string)
      .attr("d", arc)
      .append("title")
      .text((d) => `${d.data.age}: ${d.data.population.toLocaleString()}`);

    svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(arcs)
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arcLabel().centroid(d)})`)
      .call((text) =>
        text
          .append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text((d) => d.data.age)
      )
      .call((text) =>
        text
          .filter((d) => d.endAngle - d.startAngle > 0.25)
          .append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
          .text((d) => d.data.population.toLocaleString())
      );
  }, []);
  return <div className='pie' />;
};

export default Pie;
