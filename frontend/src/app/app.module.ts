import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgOptimizedImage } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgentComponent } from './agent/agent.component';
import { TipsComponent } from './tips/tips.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FoundAgentsComponent } from './found-agents/found-agents.component';
import { LayoutModule } from "@angular/cdk/layout";
import { ImageFallbackDirective } from './agent/image-fallback.directive';
import { ActionsComponent } from './actions/actions.component';

@NgModule({
  declarations: [
    AppComponent,
    AgentComponent,
    TipsComponent,
    FoundAgentsComponent,
    ImageFallbackDirective,
    ActionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
