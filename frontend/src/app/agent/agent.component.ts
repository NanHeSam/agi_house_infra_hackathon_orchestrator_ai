import { Component, Input } from '@angular/core';
import { Agent } from "../app.component";
import { animate, query, stagger, style, transition, trigger } from "@angular/animations";

export enum Status {
  Running = 'Running',
  Stopped = 'Stopped',
  InQueue = 'InQueue',
  Done = 'Done',
}


@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss'],
})
export class AgentComponent {
  @Input() agent!: Agent;
  @Input() status: Status = Status.InQueue;
  Status = Status;
}
