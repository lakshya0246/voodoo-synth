import { Component, HostListener, OnInit } from '@angular/core';
import { KEY_NOTE_FREQUENCY_MAP } from './notes';

@Component({
  selector: 'vd-synth',
  templateUrl: './synth.component.html',
  styleUrls: ['./synth.component.scss'],
})
export class SynthComponent {
  values = [12, 6];
  private audioContext = new AudioContext();
  private gain = this.audioContext.createGain();
  playing: boolean = false;
  analyserNode: AnalyserNode = this.audioContext.createAnalyser();
  private interval: any;
  noteSequence = [
    'a',
    's',
    'd',
    'f',

    'a',
    's',
    'w',
    'd',

    'f',
    'k',
    'e',
    'k',

    'a',
    's',
    'd',
    'f',

    'a',
    's',
    'w',
    'd',

    'f',
    'j',
    'e',
    'j',

    'a',
    's',
    'w',
    'd',

    'f',
    'j',
    'e',
    'j',

    'a',
    's',
    'w',
    'd',

    'f',
    'j',
    'e',
    'j',

    'a',
    's',
    'w',
    'd',

    'f',
    'j',
    'e',
    'j',
  ];
  noteSequence2 = ['k', 'j', 's', 'a'];

  constructor() {}

  play() {
    this.gain = this.audioContext.createGain();
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.connect(this.gain);
    this.gain.connect(this.audioContext.destination);
    oscillator.start(0);
    this.playing = true;
  }

  playNote(frequency = 440.0) {
    this.gain = this.audioContext.createGain();
    this.gain.gain.value = 0.5;
    const oscillator = this.audioContext.createOscillator();
    oscillator.frequency.value = frequency;
    oscillator.type = 'triangle';
    oscillator
      .connect(this.gain)
      .connect(this.analyserNode)
      .connect(this.audioContext.destination);
    oscillator.start(0);
    this.stop(1.5);
  }

  stopNoteSequence() {
    clearInterval(this.interval);
  }
  playNoteSequence(notes: string[]) {
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playNote(KEY_NOTE_FREQUENCY_MAP[notes[i]]);
      }, i * 500);
    }
    this.interval = setInterval(() => {
      for (let i = 0; i < notes.length; i++) {
        setTimeout(() => {
          this.playNote(KEY_NOTE_FREQUENCY_MAP[notes[i]]);
        }, i * 500);
      }
    }, notes.length * 500);
  }

  stop(delay: number = 0.04) {
    this.gain.gain.exponentialRampToValueAtTime(
      0.00001,
      this.audioContext.currentTime + delay
    );
    this.playing = false;
  }

  @HostListener('document:keyup', ['$event'])
  onPress(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.playNoteSequence(this.noteSequence);
      this.playNoteSequence(this.noteSequence2);
    }
    const keyNoteFrequency = KEY_NOTE_FREQUENCY_MAP[event.key];

    if (keyNoteFrequency) {
      this.playNote(keyNoteFrequency);
    }
  }
}
