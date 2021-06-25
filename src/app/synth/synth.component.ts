import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { HarmonicOscillator } from './instruments/harmonic-oscillator';
import { KEY_NOTE_FREQUENCY_MAP } from './notes';

@Component({
  selector: 'vd-synth',
  templateUrl: './synth.component.html',
  styleUrls: ['./synth.component.scss'],
})
export class SynthComponent implements AfterViewInit {
  private audioContext = new AudioContext();
  analyserNode: AnalyserNode = this.audioContext.createAnalyser();
  beatingOffset: number = 0;
  private _attack: number = 0.25;
  public get attack(): number {
    return this._attack;
  }
  public set attack(value: number) {
    this._attack = value + 0.5;
  }
  private _release: number = 1.25;
  public get release(): number {
    return this._release;
  }
  public set release(value: number) {
    this._release = value + 2.5;
  }
  private sampleTracks: Array<MediaElementAudioSourceNode | undefined> = [
    undefined,
    undefined,
    undefined,
  ];
  private sampleTrackPlaying: boolean[] = [false, false, false];

  @ViewChildren('sampleLoopEl') sampleEls!: QueryList<
    ElementRef<HTMLAudioElement>
  >;
  oscillatorType: OscillatorType = 'sine';

  constructor() {}
  ngAfterViewInit(): void {
    if (this.sampleEls.length) {
      this.sampleEls.forEach((sampleEl, i) => {
        this.sampleTracks[i] = this.audioContext.createMediaElementSource(
          sampleEl.nativeElement
        );
      });
    }
  }

  toggleSample(checked: boolean, index: number) {
    const track = this.sampleTracks[index];
    const sampleEl = this.sampleEls.get(index);
    if (track && sampleEl) {
      if (checked) {
        track.connect(this.analyserNode).connect(this.audioContext.destination);
        sampleEl.nativeElement.loop = true;
        // start all from beginning
        if (this.sampleEls.length) {
          this.sampleEls.forEach((_sampleEl, i) => {
            _sampleEl.nativeElement.currentTime =
              this.audioContext.currentTime + 0.5;
          });
        }
        sampleEl.nativeElement.currentTime =
          this.audioContext.currentTime + 0.5;
        sampleEl.nativeElement
          .play()
          .then(() => (this.sampleTrackPlaying[index] = true));
      } else {
        track.disconnect(this.analyserNode);
        sampleEl.nativeElement.pause();
      }
    }
  }

  playNote(frequency = 440.0) {
    const harmonica = new HarmonicOscillator(
      this.audioContext,
      frequency,
      this.oscillatorType,
      this.beatingOffset
    );
    const gain = this.audioContext.createGain();
    gain.gain.value = 1 / 6;
    harmonica
      .connect(gain)
      .connect(this.analyserNode)
      .connect(this.audioContext.destination);
    harmonica.start(0);
    gain.gain.exponentialRampToValueAtTime(
      0.5,
      this.audioContext.currentTime + this.attack
    );
    gain.gain.exponentialRampToValueAtTime(
      0.00001,
      this.audioContext.currentTime + this.attack + this.release
    );
    harmonica.stop(
      this.audioContext.currentTime + this.attack + this.release + 0.05
    );
  }

  @HostListener('document:keydown', ['$event'])
  onPress(event: KeyboardEvent) {
    const keyNoteFrequency = KEY_NOTE_FREQUENCY_MAP[event.key];

    if (keyNoteFrequency) {
      this.playNote(keyNoteFrequency);
    }
  }
}
