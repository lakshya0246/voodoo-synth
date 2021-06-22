import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { v4 as uuidV4 } from 'uuid';

@Component({
  selector: 'vd-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent implements OnInit {
  gradientId: string;
  constructor() {
    this.gradientId = uuidV4();
  }
  @Input() checked: boolean = false;
  @Output() check: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  ngOnInit(): void {}

  toggleCheck() {
    this.checked = !this.checked;
    this.check.emit(this.checked);
  }
}
