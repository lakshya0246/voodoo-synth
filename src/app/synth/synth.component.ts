import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { HarmonicOscillator } from './instruments/harmonic-oscillator';
import { KEY_NOTE_FREQUENCY_MAP, MIDI_KEY_NOTE_FREQUENCY_MAP } from './notes';

@Component({
  selector: 'vd-synth',
  templateUrl: './synth.component.html',
  styleUrls: ['./synth.component.scss'],
})
export class SynthComponent implements AfterViewInit {
  private audioContext = new AudioContext();
  analyserNode: AnalyserNode = this.audioContext.createAnalyser();
  trackAnalyserNodes: AnalyserNode[] = [
    this.audioContext.createAnalyser(),
    this.audioContext.createAnalyser(),
    this.audioContext.createAnalyser(),
  ];
  playing: {
    [note: string]: { voc: HarmonicOscillator; voa: GainNode } | undefined;
  } = {};
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

  private _randomness: number = 0;
  public get randomness(): number {
    return this._randomness;
  }
  public set randomness(value: number) {
    this._randomness = (value + 50) / 100;
  }

  private _resolution: number = 4;
  public get resolution(): number {
    return this._resolution;
  }
  public set resolution(value: number) {
    this._resolution = value + 10;
  }

  private _masterGain: number = 0.5;
  public get masterGain(): number {
    return this._masterGain;
  }
  public set masterGain(value: number) {
    this._masterGain = value + 0.5;
  }

  private _effectsGain: number = 0.5;
  public get effectsGain(): number {
    return this._effectsGain;
  }
  public set effectsGain(value: number) {
    this._effectsGain = value + 0.5;
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

    const that = this;
    (navigator as any).requestMIDIAccess().then(function (access: any) {
      console.log(access);
      // Get lists of available MIDI controllers
      const inputs: Map<any, any> = access.inputs.values();
      const outputs = access.outputs.values();
      console.log(([...inputs][0] as any).name + ' connected');
      access.inputs.forEach(function (entry: any) {
        entry.onmidimessage = (event: any) => {
          const [status, key, velocity] = event.data as number[];
          // Ref: https://computermusicresource.com/MIDI.Commands.html
          if (status > 143 && status < 160) {
            that.onPress(
              new KeyboardEvent('press', { key: key.toString() }),
              true
            );
          } else if (status < 144 && status > 127) {
            that.onUp(
              new KeyboardEvent('press', { key: key.toString() }),
              true
            );
          }
          console.log(status, key, velocity);
        };
      });

      access.onstatechange = function (e: any) {
        // Print information about the (dis)connected MIDI controller
        console.log(e.port.name, e.port.manufacturer, e.port.state);
      };
    });
  }

  toggleSample(checked: boolean, index: number) {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    const track = this.sampleTracks[index];
    const sampleEl = this.sampleEls.get(index);
    if (track && sampleEl) {
      if (checked) {
        track
          .connect(this.trackAnalyserNodes[index])
          .connect(this.audioContext.destination);
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
        track.disconnect(this.trackAnalyserNodes[index]);
        sampleEl.nativeElement.pause();
      }
    }
  }

  playNote(frequency = 440.0) {
    const harmonica = new HarmonicOscillator(
      this.audioContext,
      frequency,
      this.oscillatorType,
      this.beatingOffset,
      this.randomness,
      this.resolution,
      this.effectsGain
    );
    const gain = this.audioContext.createGain();
    gain.gain.value = 0.1;
    const masterGain = this.audioContext.createGain();
    masterGain.gain.value = Math.min(this.masterGain, 0.9);
    harmonica
      .connect(gain)
      .connect(masterGain)
      .connect(this.analyserNode)
      .connect(this.audioContext.destination);
    harmonica.start(0);
    gain.gain.exponentialRampToValueAtTime(
      0.2,
      this.audioContext.currentTime + Math.max(this.attack, 0.05)
    );

    return { voa: gain, voc: harmonica };
  }

  @HostListener('document:keydown', ['$event'])
  onPress(event: KeyboardEvent, isMidi: boolean = false) {
    const keyNoteFrequency = isMidi
      ? MIDI_KEY_NOTE_FREQUENCY_MAP[event.key]
      : KEY_NOTE_FREQUENCY_MAP[event.key];
    console.log(event.key, keyNoteFrequency);
    if (keyNoteFrequency && !this.playing[keyNoteFrequency]) {
      this.playing[keyNoteFrequency] = this.playNote(keyNoteFrequency);
    }
  }
  @HostListener('document:keyup', ['$event'])
  onUp(event: KeyboardEvent, isMidi: boolean = false) {
    const keyNoteFrequency = isMidi
      ? MIDI_KEY_NOTE_FREQUENCY_MAP[event.key]
      : KEY_NOTE_FREQUENCY_MAP[event.key];
    const playingVoice = this.playing[keyNoteFrequency];

    if (playingVoice) {
      playingVoice.voa.gain.setTargetAtTime(
        0,
        this.audioContext.currentTime + this.attack,
        Math.max(this.release, 0.05) / 3
      );
      playingVoice.voc.stop(
        this.audioContext.currentTime +
          Math.max(this.release + this.attack, 0.05) * 3 +
          0.05
      );
      delete this.playing[keyNoteFrequency];
    }
  }
}
