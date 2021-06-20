import {
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'vd-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss'],
})
export class HistogramComponent implements OnInit, OnDestroy {
  @Input() height: number = 80;
  @Input() width: number = 20;
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
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    }
    if (this.canvasEl) {
      this.canvas = this.canvasEl.nativeElement.getContext('2d');
      this.ngZone.runOutsideAngular(() => this.draw());
    }
  }

  draw() {
    this.drawLoopId = requestAnimationFrame(this.draw.bind(this));
    if (this.canvas) {
      this.canvas.clearRect(0, 0, this.width, this.height);
      if (this.analyser && this.dataArray) {
        this.analyser.getByteFrequencyData(this.dataArray);
        let barHeight = 0;
        // take every 8th freq of for eight times
        for (let i = 0; i < 64; i = i + 8) {
          barHeight = this.dataArray[i] / 1.5;
          this.canvas.fillStyle = 'rgba(0, 0, 0, .2)';
          this.canvas.fillRect(
            0,
            this.height - barHeight / 2,
            this.width,
            barHeight
          );
        }
        this.canvas.fillRect(
          0,
          this.height - barHeight / 2,
          this.width,
          barHeight
        );
      }
    }
  }
}
