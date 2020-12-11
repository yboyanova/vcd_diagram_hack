import { Component, AfterViewInit, Input, Type } from "@angular/core";
import * as go from "gojs";

const $ = go.GraphObject.make;

enum TYPE {
  site = "Site",
  zone = "Available Zone",
  group = "Data Center Group",
  vdc = "Virtual Data Center",
  edge = "Edge Gateway",
  vapp = "Virtual Application",
  vm = "Virtual Machine"
}

enum STATUS {
  active = "active",
  inactive = "inactive"
}

@Component({
  selector: "app-diagram",
  templateUrl: "./diagram.component.html",
  styleUrls: ["./diagram.component.scss"]
})
export class DiagramComponent implements AfterViewInit {
  public diagram: go.Diagram = null;

  @Input()
  public model: go.Model;

  roundedRectangleParams = {
    parameter1: 3,  // set the rounded corner
    spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight // make content go all the way to inside edges of rounded corners
  };

  ngAfterViewInit(): void {
    this.diagram = $(go.Diagram, "vcd-diagram", {
      layout: $(go.TreeLayout, {
        treeStyle: go.TreeLayout.StyleLastParents,
        angle: 90,
        alignment: go.TreeLayout.AlignmentStart,
        // properties for the "last parents":
        alternateAngle: 0,

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
      go.Node, "Auto",
      {
        isTreeExpanded: false,
        isShadowed: true,
        shadowBlur: 1,
        shadowOffset: new go.Point(0, 2),
        shadowColor: "#D7D7D7"
      },
      $(go.Shape, 'RoundedRectangle', this.roundedRectangleParams, {
        fill: "#ffffff",
        stroke: "lightgray",
        desiredSize: new go.Size(325, 80)
      }),
      $(go.Panel, "Vertical",

      // Main Content
        $(go.Panel, "Horizontal",
          {
            margin: new go.Margin(16, 16, 10, 16)
          },

          // Type Card
          $(go.Panel, "Spot",
            $(go.Shape, "RoundedRectangle", this.roundedRectangleParams, {
              margin: new go.Margin(0, 16, 0, 0),
              desiredSize: new go.Size(48, 48),
              fill: "#89CBDF",
              stroke: null
            },
              new go.Binding("fill", "type", type => this.getColorByType(type))
            ),
            $(go.Picture, {
              desiredSize: new go.Size(30, 30),
              alignment: go.Spot.Center
            },
              new go.Binding("source", "", (data) => this.getIconByType(data.type, data.status))
            )
          ),

          // Name and Type
          $(go.Panel, "Table",
          {
            desiredSize: new go.Size(200, 40)
          },
            $(go.TextBlock,
              {
                column: 0,
                row: 0,
                alignment: go.Spot.Left,
                font: "11px Metropolis",
                stroke: "#565656"
              },
              new go.Binding("text", "type")
            ),
            $(go.TextBlock,
              {
                column: 0,
                row: 1,
                alignment: go.Spot.Left,
                font: "18px Metropolis",
                stroke: "#0079B8"
              },
              new go.Binding("text", "name"),
              new go.Binding("stroke", "type", (type) => type === TYPE.site || type === TYPE.zone ? "#565656" : "#0079B8" )
            ),
          ),

          // Context Menu
          $(go.Picture, {
            source: "assets/ellipsis-vertical-line.svg",
            desiredSize: new go.Size(20, 20),
            alignment: go.Spot.Right
          })

        )
      ),
        $("TreeExpanderButton",
          {
            width: 16,
            height: 16,
            margin: 4,
            "ButtonIcon.stroke": "white",
            "ButtonBorder.fill": "lightblue",
            "ButtonBorder.stroke": "transparent"
          },
          { alignment: go.Spot.BottomCenter},
          new go.Binding("ButtonBorder.fill", "isTreeExpanded", function(v) { return v ? "grey" : "lightblue"; }),
          )
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

    // Invisible nodes - Hack for Edge link
    this.diagram.nodeTemplateMap.add(
      "Invisible",
      $(
        go.Node,
        "Spot",
        // "visible: false" hides the link
        { opacity: 0 }
      ));

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

  getColorByType(type: TYPE): any {
    switch (type) {
      case TYPE.site: return "#003D79";
      case TYPE.zone: return "#0065AB";
      case TYPE.group: return "#0095D3";
      case TYPE.vdc: return "#89CBDF";
      case TYPE.vm: return "#FAFAFA";
      case TYPE.vapp: return "#565656";
      default: return "#0095D3";
    }
  }

  getIconByType(type: TYPE, status: STATUS = STATUS.active) {
    switch (type) {
      case TYPE.site: return "assets/map-marker-solid.svg";
      case TYPE.zone: return "assets/host-solid.svg";
      case TYPE.group: return "assets/cloud-scale-line.svg";
      case TYPE.vdc: return "assets/cloud-solid.svg";
      case TYPE.vm: {
        return status === STATUS.active ?
          "assets/vm-outline-badged-active.svg" :
          "assets/vm-outline-badged-inactive.svg";
      };
      case TYPE.vapp: {
        return status === STATUS.active ?
          "assets/vmw-app-outline-badged-active.svg" :
          "assets/vmw-app-outline-badged-inactive.svg";
      };
      default: return "assets/cloud-scale-line.svg";
    }
  }

}
