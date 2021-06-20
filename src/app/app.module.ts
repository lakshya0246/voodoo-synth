import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ControlsModule } from './controls/controls.module';
import { SynthComponent } from './synth/synth.component';

@NgModule({
  declarations: [AppComponent, SynthComponent],
  imports: [BrowserModule, ControlsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
