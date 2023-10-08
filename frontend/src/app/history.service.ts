import { Injectable } from '@angular/core';

interface HistoryEntry {
  date: Date;
  searchPrompt: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  history: HistoryEntry[] = [];

  constructor() {
  }

  append(searchPrompt: string) {
    this.history = [...this.history, {date: new Date(), searchPrompt}];
  }

  getAll(): string {
    return this.history.map((entry) => entry.searchPrompt).join('. ');
  }
}
