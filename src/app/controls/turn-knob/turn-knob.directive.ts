import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { clampInteger } from '../controls.helpers';

@Directive({
  selector: '[vdTurnKnob]',
})
export class TurnKnobDirective {
  counter: number = 0;
  private prevMouseYPos: number = 0;
  private percent: number = -100;
  private readonly DRAG_THRESHOLD: number = 200;
  private readonly MAX_ANGLE: number = 140;
  private mouseMoveSubscription: Subscription | undefined = undefined;
  @Input() track: HTMLOrSVGElement | null = null;

  constructor(private el: ElementRef<HTMLDivElement>) {}

  onMouseMove(e: MouseEvent) {
    const deltaPercent =
      (clampInteger(e.clientY - this.prevMouseYPos, this.DRAG_THRESHOLD) /
        this.DRAG_THRESHOLD) *
      100;
    const clamped = clampInteger(this.percent + deltaPercent, 100);

    this.prevMouseYPos = e.clientY;
    this.percent = clamped;
    (
      this.el.nativeElement.children[0] as HTMLElement
    ).style.transform = `rotate(${(clamped / 100) * this.MAX_ANGLE}deg)`;
    this.percent = clamped;
    (
      this.el.nativeElement.children[2] as HTMLElement
    ).style.transform = `rotate(${(clamped / 100) * this.MAX_ANGLE}deg)`;
    if (this.track) {
      const track = this.track as SVGElement;
      const path = track.children[1] as SVGCircleElement;
      // subtract arc from circle
      const circumference = 3.14 * 56 * 2 - ((3.14 * 56 * 2) / 360) * 80;
      path.style.strokeDasharray = `${circumference} ${circumference}`;
      path.style.strokeDashoffset = (
        ((-clamped / 2 + 50) / 100) *
        circumference
      ).toString();
    }
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
