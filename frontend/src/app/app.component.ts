import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";
import { BehaviorSubject, catchError, debounceTime, filter, map, Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import gsap from 'gsap';
import { HistoryService } from "./history.service";
import { BreakpointObserver } from "@angular/cdk/layout";
import { Status } from "./agent/agent.component";

export interface Agent {
  agent: {
    agent_name: string;
    agent_url: string;
    endpoint: string;
    description: string;
    metadata: object;
    icon: string;
  },
  goal: string;
}


interface AgentsResponse {
  agents: Agent[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  instructions = new FormControl<string>('');
  agents: Agent[] = [];
  minWidthPx = 300;
  isLoading = false;
  hasResults = false;
  theme = 'dark'
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('searchTextarea') searchTextarea!: ElementRef;
  agentToState: {[index: number]: Status} = {};
  isFireworks = false;
  successImgIndex = 1;

  private mouseMoved$ = new BehaviorSubject<MouseEvent | undefined>(undefined);

  constructor(private http: HttpClient,
              public breakpointObserver: BreakpointObserver,
              private historyService: HistoryService) {
  }


  ngAfterViewInit() {
    this.focusSearch();
  }


  ngOnInit() {
    // initPixi();
    this.instructions.valueChanges.subscribe((instructions) => {
      this.setMinWidth(instructions as string);
    });
    this.mouseMoved$.pipe(
      filter((event) => !!event),
      debounceTime(10),
      filter(() => this.theme === 'crazy'),
    ).subscribe((event) => {
      this.changeColor(event as MouseEvent)
    });
  }

  search() {
    const instructions = this.instructions.value as string;
    if (instructions === "") {
      return;
    }
    if (instructions.toLowerCase().includes("make it crazy") && !this.isLoading) {
      this.fireUp();
    }
    this.isLoading = true;
    this.agents = [];
    this.hasResults = false;
    this.agentToState = {}
    this.getData(instructions).pipe(
      catchError(() => of({agents: []})),
      map((searchResult) => this.prepareAgents(searchResult.agents))
    ).subscribe(agents => {
      this.historyService.append(instructions);
      this.agents = agents;
      for (let i = 0; i < this.agents.length; i++) {
        this.agentToState[i] = Status.InQueue;
      }
      this.isLoading = false;
      this.hasResults = this.agents.length > 0;
    });
  }

  onMouseMove(event: MouseEvent): void {
    this.mouseMoved$.next(event);
  }

  changeColor(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;
    gsap.to(document.body, {
      background: `radial-gradient(circle at ${x}px ${y}px, #7498d3, #98e2ac, #f3dd9d, #ffbbb5)`,
      duration: 2,  // Adjust duration as needed
      ease: "power1.out"  // Adjust easing as needed
    });
  }

  fireUp() {
    this.theme = 'crazy';
    document.body.classList.add('crazy');
    document.body.classList.remove('dark');
    if (this.mouseMoved$.value) {
      this.changeColor(this.mouseMoved$.value);
    }
  }

  setInstructions(instructions: string) {
    this.instructions.setValue(instructions);
    this.focusSearch();
  }

  startAllAgents() {
    for (let i = 0; i < this.agents.length; i++) {
      this.agentToState[i] = Status.Running;
    }
    for (let i = 0; i < this.agents.length; i++) {
      setTimeout(() => {
        this.agentToState[i] = Status.Done;
        if (Object.values(this.agentToState).every((state) => state === Status.Done)) {
          this.launchFireworks();
        }
      }, 1500 * (i + 1));
    }
  }

  private launchFireworks() {
    this.isFireworks = true;
    this.successImgIndex = Math.floor(Math.random() * 5) + 1;
    setTimeout(() => {
      this.isFireworks = false;
    }, 10000);
  }

  private prepareAgents(agents: Agent[]): Agent[] {
    return agents.map(agent => {
      return {
        agent: { // @ts-ignore
          icon: agent.agent.icon.replaceAll('https://', 'http://'),
          ...agent.agent
        },
        goal: this.capitalize(agent.goal),
      }
    }).slice(0, 20);
  }

  private countUppercase(str: string) {
    let count = 0;
    for(let i = 0; i < str.length; i++) {
      let charCode = str.charCodeAt(i);
      if(charCode >= 65 && charCode <= 90) {  // ASCII values for 'A' is 65 and for 'Z' is 90
        count++;
      }
    }
    return count;
  }

  private setMinWidth(instructions: string) {
    const buttonWidth = 100;
    const uppercaseLettersCount = this.countUppercase(instructions);
    const otherLettersCount = instructions.length - uppercaseLettersCount;
    // fix for mobiles
    if (this.breakpointObserver.isMatched('(max-width: 800px)')) {
      this.minWidthPx = 300;
    } else {
      this.minWidthPx = Math.min(Math.max(otherLettersCount * 16 + uppercaseLettersCount * 22, 300), 800) + buttonWidth;
    }
  }

  private getData(instruction: string | null): Observable<AgentsResponse> {
    if (instruction) {
      const history = this.historyService.getAll();
      return this.http.post<AgentsResponse>('https://core.portal.ai/v2/find-agents', {instruction, context: history});
    } else {
      return of({agents: []});
    }
  }

  private focusSearch() {
    if (this.breakpointObserver.isMatched('(max-width: 600px)')) {
      this.searchTextarea.nativeElement.focus();
    } else {
      this.searchInput.nativeElement.focus();
    }
  }

  private capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
}
