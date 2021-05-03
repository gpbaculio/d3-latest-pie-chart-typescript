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
      {
        age: "40-50",
        population: 5,
      },
      {
        age: "50-60",
        population: 6,
      },
      {
        age: "60-70",
        population: 7,
      },
      {
        age: "70-80",
        population: 8,
      },
      {
        age: "80-90",
        population: 9,
      },
      {
        age: "90-100",
        population: 10,
      },
      {
        age: "100+",
        population: 11,
      },
    ];

    const margin = { top: 30, right: 120, bottom: 30, left: 50 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      tooltip = { width: 100, height: 100, x: 10, y: -30 };

    const svg = d3
      .select(".pie")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
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
      .outerRadius(Math.min(width, height) / 2 - 1)
      .cornerRadius(15);

    const arcLabel = function () {
      const radius = (Math.min(width, height) / 2) * 0.8;
      return d3
        .arc<PieArcDatum<PieData>>()
        .innerRadius(radius)
        .outerRadius(radius);
    };
    var color = d3
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

  return (
    <div className='App'>
      <div className='pie' />
      <div className='donut' />
    </div>
  );
}

export default App;
