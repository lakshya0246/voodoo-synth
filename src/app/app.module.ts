import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ControlsModule } from './controls/controls.module';
import { SynthComponent } from './synth/synth.component';
import { TypographyModule } from './typography/typography.module';
import { VisualizersModule } from './visualizers/visualizers.module';

@NgModule({
  declarations: [AppComponent, SynthComponent],
  imports: [BrowserModule, ControlsModule, VisualizersModule, TypographyModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
