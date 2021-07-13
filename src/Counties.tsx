import * as topojson from "topojson";
import * as d3 from "d3";
import { useEffect, useState } from "react";
import us from "./data/counties-albers-10m.json";
import population from "./data/population.json";
import { GeometryObject, Topology } from "topojson-specification";
import { ExtendedFeatureCollection } from "d3";

const Counties = () => {
  const path = d3.geoPath();
  useEffect(() => {
    const features = new Map(
      (
        topojson.feature(
          us as unknown as Topology,
          us.objects.counties as GeometryObject
        ) as ExtendedFeatureCollection
      ).features.map((d) => [d.id, d])
    );
    const data = population.slice(1).map(([population, state, county]) => {
      const id = state + county;
      const feature = features.get(id);
      return {
        id,
        position: feature && path.centroid(feature),
        title: feature && feature.properties!.name,
        value: +population,
      };
    });
    const svg = d3
      .select(".counties")
      .append("svg")
      .attr("viewBox", "0, 0, 975, 610");
    svg
      .append("path")
      .datum(
        topojson.feature(
          us as unknown as Topology,
          us.objects.nation as GeometryObject
        ) as ExtendedFeatureCollection
      )
      .attr("fill", "green")
      .attr("stroke", "blue")
      .attr("d", path);

    svg
      .append("path")
      .datum(
        topojson.mesh(
          us as unknown as Topology,
          us.objects.states as GeometryObject,
          (a, b) => a !== b
        )
      )
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("d", path);
    const radius = d3.scaleSqrt(
      [0, d3.max(data, (d) => d.value) as number],
      [5, 40]
    );
    const scaleText = d3.scaleSqrt(
      [0, d3.max(data, (d) => d.value) as number],
      [6, 14]
    );
    const g = svg
      .append("g")
      .attr("id", "svg")
      .attr("fill", "brown")
      .attr("fill-opacity", 0.5)
      .attr("stroke", "blue")
      .attr("stroke-width", 0.5)
      .selectAll("circle");
    g.data(
      data
        .filter((d) => d.position)
        .sort((a, b) => d3.descending(a.value, b.value))
    )
      .join("circle")
      .attr("id", (d) => `circle:${d.id}`)
      .attr("transform", (d) => `translate(${d.position})`)
      .attr("r", (d) => radius(d.value))
      .on("mouseenter", function (_, d) {
        const el = d3.selectAll("text").filter(function () {
          return d3.select(this).property("id") === `text:${d.id}`;
        });
        el.style("opacity", 1);
        const thisCircle = d3.select(this);
        thisCircle.attr("fill-opacity", 1);
      })
      .on("mouseleave", function (_, d) {
        const el = d3.selectAll("text").filter(function () {
          return d3.select(this).property("id") === `text:${d.id}`;
        });
        el.style("opacity", 0);
        const thisCircle = d3.select(this);
        thisCircle.attr("fill-opacity", 0.5);
      });
    g.data(
      data
        .filter((d) => d.position)
        .sort((a, b) => d3.descending(a.value, b.value))
    )
      .join("text")
      .attr("stroke", "#fff")
      .attr("id", (d) => `text:${d.id}`)
      .on("mouseenter", function (_, d) {
        const elCircle = d3.selectAll("circle").filter(function () {
          return d3.select(this).property("id") === `circle:${d.id}`;
        });
        elCircle.attr("fill-opacity", 1);
        const el = d3.select(this);
        el.style("opacity", 1);
      })
      .on("mouseleave", function (_, d) {
        const elCircle = d3.selectAll("circle").filter(function () {
          return d3.select(this).property("id") === `circle:${d.id}`;
        });
        elCircle.attr("fill-opacity", 0.5);
        const el = d3.select(this);
        el.style("opacity", 0);
      })
      .attr("x", (d) => (d.position as [number, number])[0])
      .attr("y", (d) => (d.position as [number, number])[1])
      .attr("text-anchor", "middle")
      .attr("fill", "yellow")
      .attr("fill-opacity", 1)
      .attr("alignment-baseline", "middle")
      .style("font-size", (d) => `${scaleText(d.value)}px`)
      .style("opacity", 0)
      .text((d) => d.value);
  }, []);

  return <div className='counties' />;
};

export default Counties;
