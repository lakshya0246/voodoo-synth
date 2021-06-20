import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistogramComponent } from './histogram/histogram.component';
import { DisplayComponent } from './display/display.component';

@NgModule({
  declarations: [HistogramComponent, DisplayComponent],
  imports: [CommonModule],
  exports: [DisplayComponent],
})
export class VisualizersModule {}
