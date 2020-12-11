import { Component } from "@angular/core";
import * as go from "gojs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "CodeSandbox";

  constructor() {
  }

  public model: go.TreeModel = new go.TreeModel([
    { key: 1, name: "Tokio", type: "Site", loc: "100 100" },
    {
      key: 2,
      name: "T-AZ-1",
      type: "Available Zone",
      parent: 1,
      loc: "200 200"
    },
    { key: 3, name: "VDC Group 1", type: "Data Center Group", parent: 2 },
    { key: 4, name: "Data Center 1", type: "Virtual Data Center", parent: 3 },
    { key: 5, name: "Data Center 2", type: "Virtual Data Center", parent: 3 },
    {
      key: 13,
      name: "T-AZ-1",
      type: "Available Zone",
      parent: 1,
      loc: "200 200"
    },
    { key: 14, name: "VDC Group 2", type: "Data Center Group", parent: 13 },
    { key: 15, name: "VDC Group 3", type: "Data Center Group", parent: 13 },
    { key: 16, name: "Data Center 1", type: "Virtual Data Center", parent: 15 },
      { key: 6, name: 'Edge 1', type: 'Edge Gateway', parent: 4, category: 'Edge', count: 5 },
      { parent: 6, category: "Invisible" },
    {
      key: 7,
      name: "Edge 2",
      type: "Edge Gateway",
      parent: 4,
      category: "Edge"
    },
    { parent: 7, category: "Invisible" },
    {
      key: 8,
      name: "Edge 3",
      type: "Edge Gateway",
      parent: 5,
      category: "Edge"
    },
    { parent: 8, category: "Invisible" },
    { key: 9, name: "VM 1", type: "Virtual Machine", status: "active", parent: 5 },
    { key: 10, name: "VM 2", type: "Virtual Machine", status: "inactive", parent: 5 },
    { key: 11, name: "VM 3", type: "Virtual Machine", status: "active", parent: 5 },
    { key: 12, name: "vApp", type: "Virtual Application", status: "active", parent: 5 }
  ]);
}
