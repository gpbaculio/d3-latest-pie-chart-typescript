import React, { useEffect } from "react";
import logo from "./logo.svg";
import * as d3 from "d3";
import "./App.css";
import { PieArcDatum } from "d3";

function App() {
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

    const margin = { top: 30, right: 30, bottom: 30, left: 50 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      tooltip = { width: 100, height: 100, x: 10, y: -30 };

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

    // donut
    const donutSvg = d3
      .select(".donut")
      .append("svg")
      .attr("width", 300)
      .attr("height", 300)
      .append("g")
      .attr("transform", "translate(" + 300 / 2 + "," + 300 / 2 + ")");

    const donutPie = d3
      .pie<void, PieData>()
      .sort(null)
      .value((d) => d.population);

    const innerRadius = Math.min(300, 300) / 2 - 50;
    const outerRadius = Math.min(300, 300) / 2 - 1;

    const donutArc = d3
      .arc<PieArcDatum<PieData>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(12);

    const donutArcs = donutPie(data);

    donutSvg
      .append("g")
      .attr("stroke", "white")
      .selectAll("path")
      .data(donutArcs)
      .enter()
      .append("path")
      .attr("fill", (d) => color(d.data.age) as string)
      .attr("d", donutArc)
      .append("title")
      .text((d) => `${d.data.age}: ${d.data.population.toLocaleString()}`);

    donutSvg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(donutArcs)
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

  return (
    <div className='App'>
      <div className='pie' />
      <div className='donut' />
    </div>
  );
}

export default App;
