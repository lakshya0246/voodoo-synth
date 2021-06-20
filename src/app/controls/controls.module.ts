import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnKnobComponent } from './turn-knob/turn-knob.component';
import { TurnKnobDirective } from './turn-knob/turn-knob.directive';
import { FaderComponent } from './fader/fader.component';
import { FaderDirective } from './fader/fader.directive';

@NgModule({
  declarations: [TurnKnobComponent, TurnKnobDirective, FaderComponent, FaderDirective],
  imports: [CommonModule],
  exports: [TurnKnobComponent, FaderComponent],
})
export class ControlsModule {}
