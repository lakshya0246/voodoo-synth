export class HarmonicOscillator {
  private oscillator: OscillatorNode;
  private beatingOscillator: OscillatorNode;
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
    this.beatingOscillator = audioContext.createOscillator();
    this.beatingOscillator.frequency.value = frequency + beatOffset;
    this.gainBeating = audioContext.createGain();
    this.gainBeating.gain.value = 0.6;

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
    this.beatingOscillator.start();
  }

  stop(time: number = 0) {
    this.harmonics.forEach((harmonic) => harmonic.stop(time));
    this.oscillator.stop(time);
    this.beatingOscillator.stop(time);
  }

  connect(destination: AudioNode): AudioNode {
    this.harmonics.forEach((harmonic, i) => harmonic.connect(this.gains[i]));
    this.gains.forEach((gain) => gain.connect(destination));
    this.beatingOscillator.connect(this.gainBeating);
    this.gainBeating.connect(destination);
    return this.oscillator.connect(destination);
  }
}
