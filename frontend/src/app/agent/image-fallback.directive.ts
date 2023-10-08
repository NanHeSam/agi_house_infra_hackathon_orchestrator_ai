import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appImageFallback]'
})
export class ImageFallbackDirective implements OnInit {
  @Input() src!: string;
  @Input() placeholder: string = '/assets/img/fallback.png';

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.renderer.setAttribute(this.el.nativeElement, 'src', this.placeholder);
    const img = new Image();
    img.src = this.src;
    img.onload = () => {
      this.renderer.setAttribute(this.el.nativeElement, 'src', this.src);
    };
  }

}
