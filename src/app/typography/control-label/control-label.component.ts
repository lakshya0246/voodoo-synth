import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'vd-control-label',
  templateUrl: './control-label.component.html',
  styleUrls: ['./control-label.component.scss'],
})
export class ControlLabelComponent implements OnInit {
  @Input() label: string = '';

  constructor() {}

  ngOnInit(): void {}
}
