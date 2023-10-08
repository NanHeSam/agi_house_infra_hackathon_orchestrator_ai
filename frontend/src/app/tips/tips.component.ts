import { Component, EventEmitter, Output } from '@angular/core';
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0, top: '-10px' }),  // Initial state with top offset
        animate(400, style({ opacity: 1, top: '0px' }))  // Final state with top reset to 0
      ]),
      transition(':leave', [
        animate(200, style({ opacity: 0, top: '20px' }))  // Final state with top offset
      ])
    ])
  ]
})
export class TipsComponent {
  @Output() tip$ = new EventEmitter<string>();
  tips = [
    'How to throw a medieval-themed feast? 🍗 🏰',
    'How to communicate with a ghost? 👻',
    'How to build a hoverboard from scratch? 🛹',
    'How to code AI that writes better tech jokes? 🤖',
    'How to build a functioning miniature volcano? 🌋',
   ' How to make a DIY holographic projector? 📽️ 🌈',
    'How to start your own micronation? 🤝',
  ]
  showTip = true;
  currentTipIndex = 0;

  chooseTip(tip: string) {
    this.tip$.emit(tip);
  }

  constructor() {
    setInterval(() => {
      this.showTip = false;
      setTimeout(() => {
        this.currentTipIndex = (this.currentTipIndex + 1) % this.tips.length;
        this.showTip = true;
      }, 0);
    }, 3000);
  }

}
