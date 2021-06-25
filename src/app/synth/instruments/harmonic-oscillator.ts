export class HarmonicOscillator {
  private oscillator: OscillatorNode;
  private harmonics: OscillatorNode[] = [];
  private gains: GainNode[] = [];
  private gainBeating: GainNode;
  constructor(
    audioContext: AudioContext,
    frequency: number,
    type: OscillatorType,
    beatOffset: number
  ) {
    this.oscillator = audioContext.createOscillator();
    this.oscillator.frequency.value = frequency;
    this.oscillator.type = type;
    const beating = audioContext.createOscillator();
    beating.frequency.value = frequency + beatOffset;
    this.gainBeating = audioContext.createGain();
    this.gainBeating.gain.value = 0.6;
    beating.connect(this.gainBeating);
    beating.start();

    for (let i = 0; i < 4; i++) {
      const overtone = audioContext.createOscillator();
      this.harmonics.push(overtone);
      this.gains.push(audioContext.createGain());
      this.gains[i].gain.value = 0.2;
      overtone.frequency.value = frequency * (i + 1);
    }
  }

  start(time: number = 0) {
    this.harmonics.forEach((harmonic) => harmonic.start(time));
    this.oscillator.start(time);
  }

  stop(time: number = 0) {
    this.harmonics.forEach((harmonic) => harmonic.stop(time));
  }

  connect(destination: AudioNode): AudioNode {
    this.harmonics.forEach((harmonic, i) => harmonic.connect(this.gains[i]));
    this.gains.forEach((gain) => gain.connect(destination));
    this.gainBeating.connect(destination);
    return this.oscillator.connect(destination);
  }
}
