import { Component, Input, OnInit } from '@angular/core';
import { DisplayConfig } from 'app/types/display';

@Component({
  selector: 'vd-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
})
export class DisplayComponent implements OnInit {
  @Input() config: DisplayConfig | undefined = undefined;
  constructor() {}

  ngOnInit(): void {}
}
