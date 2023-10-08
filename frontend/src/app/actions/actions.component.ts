import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnChanges {
  @Output() start$ = new EventEmitter<void>();
  @Input() isDone: boolean = false;
  isLoading = false;

  start() {
    this.isLoading = true;
    this.start$.emit();
  }

  ngOnChanges() {
    if (this.isDone) {
      this.isLoading = false;
    }
  }

}
