import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  @Input() appHighlight: any;

  constructor(private el: ElementRef) {}

  ngOnChanges() {
    if (!this.appHighlight || !this.appHighlight[0]) {
      this.el.nativeElement.innerHTML = this.appHighlight[1];
      return;
    }

    const re = new RegExp(this.appHighlight[0], 'gi');
    let value = this.appHighlight[1];
    if (typeof value !== 'string') {
      value = value + '';
    }
    this.el.nativeElement.innerHTML = value.replace(
      re,
      "<b style='background-color: yellow;'>$&</b>"
    );
  }
}