import {
  Component,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'vd-circular-beat-indicator',
  templateUrl: './circular-beat-indicator.component.html',
  styleUrls: ['./circular-beat-indicator.component.scss'],
})
export class CircularBeatIndicatorComponent implements OnInit {
  @Input() analyser: AnalyserNode | undefined = undefined;
  private drawLoopId: number = 0;
  private canvas: CanvasRenderingContext2D | null = null;
  private dataArray: Uint8Array | undefined = undefined;
  @ViewChild('canvasEl', { static: true })
  canvasEl: ElementRef<HTMLCanvasElement> | null = null;

  constructor(private ngZone: NgZone) {}

  ngOnDestroy(): void {
    cancelAnimationFrame(this.drawLoopId);
  }

  ngOnInit(): void {
    if (this.analyser) {
      this.dataArray = new Uint8Array(128);
    }
    if (this.canvasEl) {
      this.canvas = this.canvasEl.nativeElement.getContext('2d');
      this.ngZone.runOutsideAngular(() => this.draw());
    }
  }

  draw() {
    this.drawLoopId = requestAnimationFrame(this.draw.bind(this));
    if (this.canvas) {
      this.canvas.clearRect(0, 0, 12, 12);
      if (this.analyser && this.dataArray) {
        this.analyser.getByteFrequencyData(this.dataArray);
        // take every 8th freq of for eight times
        this.canvas.fillRect(0, 0, 12, 12);
        for (let i = 0; i < this.dataArray.length; i += 16) {
          this.canvas.fillStyle = `rgba(0, 169, 222, ${
            this.dataArray[i] / 100
          })`;
        }
      }
    }
  }
}
