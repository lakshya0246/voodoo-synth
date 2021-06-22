import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnKnobComponent } from './turn-knob/turn-knob.component';
import { TurnKnobDirective } from './turn-knob/turn-knob.directive';
import { FaderComponent } from './fader/fader.component';
import { FaderDirective } from './fader/fader.directive';
import { TypographyModule } from 'app/typography/typography.module';
import { TouchSelectComponent } from './touch-select/touch-select.component';
import { RadioButtonComponent } from './radio-button/radio-button.component';

@NgModule({
  declarations: [
    TurnKnobComponent,
    TurnKnobDirective,
    FaderComponent,
    FaderDirective,
    TouchSelectComponent,
    RadioButtonComponent,
  ],
  imports: [CommonModule],
  exports: [
    TurnKnobComponent,
    FaderComponent,
    TouchSelectComponent,
    RadioButtonComponent,
  ],
})
export class ControlsModule {}
