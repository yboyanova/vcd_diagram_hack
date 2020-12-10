import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { DiagramComponent } from "../diagram/diagram.component";

@NgModule({
  declarations: [AppComponent, DiagramComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
