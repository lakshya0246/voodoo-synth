import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'vd-turn-knob',
  templateUrl: './turn-knob.component.html',
  styleUrls: ['./turn-knob.component.scss'],
})
export class TurnKnobComponent implements OnInit {
  @Input() isSmall: boolean = false;
  @Input() initValue: number = 0;
  /**
   * Will go from -threshold to +threshold
   */
  @Input() threshold: number = 100;
  @Output() percent: EventEmitter<number> = new EventEmitter<number>();
  constructor() {}

  ngOnInit(): void {}

  convertInitToPercent(): number {
    return (this.initValue / this.threshold) * 100;
  }

  onChange(percent: number) {
    this.percent.emit(+(percent / 100).toFixed(2) * this.threshold);
  }
}
