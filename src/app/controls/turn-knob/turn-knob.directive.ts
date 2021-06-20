import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { clampInteger } from './turn-knob.helpers';

@Directive({
  selector: '[vdTurnKnob]',
})
export class TurnKnobDirective {
  counter: number = 0;
  private prevMouseYPos: number = 0;
  private percent: number = 0;
  private readonly DRAG_THRESHOLD: number = 200;
  private mouseMoveSubscription: Subscription | undefined = undefined;
  constructor(private el: ElementRef<HTMLDivElement>) {}

  onMouseMove(e: MouseEvent) {
    const deltaPercent =
      (clampInteger(e.clientY - this.prevMouseYPos, this.DRAG_THRESHOLD) /
        this.DRAG_THRESHOLD) *
      100;
    const clamped = clampInteger(this.percent + deltaPercent, 100);

    this.prevMouseYPos = e.clientY;
    this.percent = clamped;
    this.el.nativeElement.style.transform = `rotate(${clamped}deg)`;
    this.el.nativeElement.innerText = this.percent.toString();
  }

  @HostListener('mousedown', ['$event'])
  onHostMouseDown(e: MouseEvent) {
    this.prevMouseYPos = e.clientY;
    this.mouseMoveSubscription = fromEvent(document, 'mousemove')
      .pipe(throttleTime(30))
      .subscribe((e: Event) => {
        if (e instanceof MouseEvent) {
          this.onMouseMove(e);
        }
      });
  }

  @HostListener('document:mouseup', ['$event'])
  onDocumentMouseUp(e: MouseEvent) {
    this.mouseMoveSubscription?.unsubscribe();
  }
}
