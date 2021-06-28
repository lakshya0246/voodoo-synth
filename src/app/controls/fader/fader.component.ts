import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'vd-fader',
  templateUrl: './fader.component.html',
  styleUrls: ['./fader.component.scss'],
})
export class FaderComponent implements OnInit {
  @Input() initValue: number = 0;
  /**
   * Will go from -threshold to +threshold
   */
  @Input() threshold: number = 100;
  @Output() change: EventEmitter<number> = new EventEmitter<number>();
  constructor() {}

  ngOnInit(): void {}

  convertInitTo120(): number {
    return (this.initValue / this.threshold) * 120 * -1;
  }

  onChange(value: number) {
    this.change.emit(+(value / 120).toFixed(2) * this.threshold);
  }
}
