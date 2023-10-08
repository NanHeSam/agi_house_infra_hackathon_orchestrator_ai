import { Component, Input } from '@angular/core';
import { Agent } from "../app.component";
import { animate, query, stagger, style, transition, trigger } from "@angular/animations";
import { Status } from "../agent/agent.component";

const fadeInAnimation = trigger('fadeInAnimation', [
  transition('* <=> *', [ // each time the binding value changes
    query(':enter', [
      style({ opacity: 0 }),
      stagger('200ms', [
        animate('800ms ease-in', style({ opacity: 1 }))
      ])
    ], { optional: true })
  ])
]);


@Component({
  selector: 'app-found-agents',
  templateUrl: './found-agents.component.html',
  styleUrls: ['./found-agents.component.scss'],
  animations: [fadeInAnimation],
})
export class FoundAgentsComponent {
  @Input() agents: Agent[] = [];
  @Input() agentToState: {[index: number]: Status} = {};

}
