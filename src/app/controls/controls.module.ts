import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnKnobComponent } from './turn-knob/turn-knob.component';
import { TurnKnobDirective } from './turn-knob/turn-knob.directive';

@NgModule({
  declarations: [TurnKnobComponent, TurnKnobDirective],
  imports: [CommonModule],
  exports: [TurnKnobComponent, TurnKnobDirective],
})
export class ControlsModule {}
