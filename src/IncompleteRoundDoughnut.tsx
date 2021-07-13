import React, { useEffect } from "react";
import * as d3 from "d3";
import { PieArcDatum } from "d3";

const RoundedDonut = () => {
  useEffect(() => {
    var width = 600;
    var height = 600; //this is the double because are showing just the half of the pie
    var radius = 200;

    var labelr = radius + 30; // radius for label anchor
    //array of colors for the pie (in the same order as the dataset)
    const color = d3
      .scaleOrdinal()
      .range(["#2b5eac", "#0dadd3", "#ffea61", "#ff917e", "#ff3e41"]);
    interface IncompletePieData {
      label: string;
      value: number;
    }
    const data = [
      { label: "CDU", value: 10 },
      { label: "SPD", value: 15 },
      { label: "Die Grünen", value: 8 },
      { label: "Die Mitte", value: 1 },
      { label: "Frei Wähler", value: 3 },
    ];
    var vis = d3
      .select(".incomplete-rounded-doughnut")
      .append("svg") //create the SVG element inside the <body>
      .data([data]) //associate our data with the document
      .attr("width", width) //set the width and height of our visualization (these will be attributes of the <svg> tag
      .attr("height", height)
      .append("svg:g") //make a group to hold our pie chart
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"); //move the center of the pie chart from 0, 0 to radius, radius

    const arc = d3
      .arc<PieArcDatum<IncompletePieData>>()
      .innerRadius(150)

      .cornerRadius(12)
      //  								.outerRadius(radius);
      .outerRadius(radius - 10); // full height semi pie  //.innerRadius(0);

    const pie = d3
      .pie<void, IncompletePieData>()
      .startAngle(-120 * (Math.PI / 180))
      .endAngle(120 * (Math.PI / 180))
      .padAngle(0.04) // some space between slices
      .sort(null) //No! we don't want to order it by size
      .value(function (d) {
        return d.value;
      });

    var arcs = vis
      .selectAll("g.slice") //this selects all <g> elements with class slice (there aren't any yet)
      .data(pie) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
      .enter() //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
      .append("svg:g") //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
      .attr("class", "slice"); //allow us to style things in the slices (like text)

    arcs
      .append("path")
      .attr("fill", (d, i) => {
        return color(`${i}`) as string;
      }) //set the color for each slice to be chosen from the color function defined above
      .attr("d", arc);

    arcs
      .append("text")
      .attr("class", "labels") //add a label to each slice
      .attr("fill", "grey")
      .attr("transform", function (d) {
        var c = arc.centroid(d),
          xp = c[0],
          yp = c[1],
          // pythagorean theorem for hypotenuse
          hp = Math.sqrt(xp * xp + yp * yp);
        return (
          "translate(" + (xp / hp) * labelr + "," + (yp / hp) * labelr + ")"
        );
      })
      .attr("text-anchor", "middle") //center the text on it's origin
      .text(function (d, i) {
        return data[i].value;
      })
      .text(function (d, i) {
        return data[i].label;
      });
  }, []);
  return <div className='incomplete-rounded-doughnut' />;
};

export default RoundedDonut;
