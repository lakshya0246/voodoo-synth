import { Component, EventEmitter, OnInit, Output } from '@angular/core';
const WAVE_TYPES: OscillatorType[] = ['sine', 'square', 'triangle', 'sawtooth'];

@Component({
  selector: 'vd-touch-select',
  templateUrl: './touch-select.component.html',
  styleUrls: ['./touch-select.component.scss'],
})
export class TouchSelectComponent implements OnInit {
  selectedWave: number = 0;
  @Output() selectWave: EventEmitter<OscillatorType> =
    new EventEmitter<OscillatorType>();
  constructor() {}

  ngOnInit(): void {}

  scroll(left?: boolean) {
    if (left) {
      this.selectedWave--;
    } else {
      this.selectedWave++;
    }
    this.selectWave.emit(WAVE_TYPES[this.selectedWave]);
  }
}
