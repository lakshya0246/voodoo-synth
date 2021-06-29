import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistogramComponent } from './histogram/histogram.component';
import { DisplayComponent } from './display/display.component';
import { CircularBeatIndicatorComponent } from './circular-beat-indicator/circular-beat-indicator.component';

@NgModule({
  declarations: [HistogramComponent, DisplayComponent, CircularBeatIndicatorComponent],
  imports: [CommonModule],
  exports: [DisplayComponent],
})
export class VisualizersModule {}
