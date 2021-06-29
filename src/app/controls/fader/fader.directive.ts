import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { clampInteger } from '../controls.helpers';

@Directive({
  selector: '[vdFader]',
})
export class FaderDirective implements OnInit {
  counter: number = 0;
  private prevMouseYPos: number = 0;
  private yPosition: number = 0;
  private readonly TRACK_THRESHOLD: number = 120;
  private mouseMoveSubscription: Subscription | undefined = undefined;
  @Input() initValue: number = 0;
  @Output() change: EventEmitter<number> = new EventEmitter<number>();
  constructor(private el: ElementRef<HTMLDivElement>) {}

  ngOnInit(): void {
    const clamped = this.initValue;
    this.yPosition = clamped;
    this.change.emit(clamped * -1);
    this.el.nativeElement.style.transform = `translate3d(0, ${clamped}px, 0)`;
  }

  onMouseMove(e: MouseEvent) {
    const deltaPosition = clampInteger(
      e.clientY - this.prevMouseYPos,
      this.TRACK_THRESHOLD
    );
    const clamped = clampInteger(
      this.yPosition + deltaPosition,
      this.TRACK_THRESHOLD
    );

    this.prevMouseYPos = e.clientY;
    this.yPosition = clamped;
    this.change.emit(clamped * -1);
    this.el.nativeElement.style.transform = `translate3d(0, ${clamped}px, 0)`;
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
