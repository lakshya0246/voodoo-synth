import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'vd-turn-knob',
  templateUrl: './turn-knob.component.html',
  styleUrls: ['./turn-knob.component.scss'],
})
export class TurnKnobComponent implements OnInit {
  @Input() isSmall: boolean = false;
  constructor() {}

  ngOnInit(): void {}
}
