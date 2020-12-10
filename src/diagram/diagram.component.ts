import { Component, AfterViewInit, Input } from "@angular/core";
import * as go from "gojs";

const $ = go.GraphObject.make;

@Component({
  selector: "app-diagram",
  templateUrl: "./diagram.component.html",
  styleUrls: ["./diagram.component.scss"]
})
export class DiagramComponent implements AfterViewInit {
  public diagram: go.Diagram = null;

  @Input()
  public model: go.Model;

  ngAfterViewInit(): void {
    this.diagram = $(go.Diagram, "vcd-diagram", {
      layout: $(go.TreeLayout, {
        treeStyle: go.TreeLayout.StyleLastParents,
        angle: 90,
        alternateAngle: 0,
        alignment: go.TreeLayout.AlignmentStart,
        alternateAlignment: go.TreeLayout.AlignmentStart
      }),
      // Enabling collapse or expand
      isReadOnly: false,
      // Disabling all other interactions
      isModelReadOnly: true,
      allowDelete: false,
      allowInsert: false,
      allowLink: false,
      allowMove: false,
      allowTextEdit: false
    });
    this.diagram.nodeTemplate = $(
      go.Node,
      "Auto",
      { isTreeExpanded: false },
      { locationSpot: go.Spot.Center },
      { alignment: new go.Spot(0, 0) },
      $(go.Shape, "Rectangle", {
        fill: "white",
        stroke: "lightgray",
        desiredSize: new go.Size(120, 50)
      }),
      $(
        go.Panel,
        "Auto",
        // $(go.Shape, 'Rectangle', { column: 0, desiredSize: new go.Size(50, 50), fill: '#b0d6eb', margin: 20 }),
        $(go.TextBlock, { row: 0, column: 1 }, new go.Binding("text", "type")),
        $(go.TextBlock, { row: 1, column: 1 }, new go.Binding("text", "name"))
      ),
      $("TreeExpanderButton")
    );

    // Edge nodes template
    this.diagram.nodeTemplateMap.add(
      "Edge",
      $(
        go.Node,
        "Spot",
        $(go.Shape, "Circle", {
          width: 36,
          height: 36,
          fill: "#62A420",
          stroke: null
        }),
        $(go.Picture, {
          desiredSize: new go.Size(30, 30),
          source: "assets/router-line.svg"
        }),
        // decorations
        $(
          go.Shape,
          "Circle",
          {
            alignment: go.Spot.TopRight,
            alignmentFocus: new go.Spot(0, 0, 12, 5),
            fill: "#565656",
            width: 16,
            height: 16,
            visible: false
          },
          new go.Binding("visible", "count", function (c) {
            return c > 1 ? true : false;
          })
        ),

        $(
          "TextBlock",
          {
            textAlign: "center",
            stroke: "#fff",
            alignment: go.Spot.TopRight,
            alignmentFocus: new go.Spot(0, 0, 8, 2)
          },
          new go.Binding("text", "count")
        )
      )
    );

    // define the Link template
    this.diagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Link.Orthogonal,
        selectable: false
      },
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" })
    );

    this.diagram.addDiagramListener("InitialLayoutCompleted", function (e) {
      e.diagram.findTreeRoots().each(function (r) {
        r.expandTree(3);
      });
    });

    this.diagram.model = this.model;
  }
}
