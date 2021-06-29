const RAND_CONSTANT = Math.random();
const RAND_DIRECTION = Math.random() > 0.5 ? -1 : 1;
export class HarmonicOscillator {
  private oscillator: OscillatorNode;
  private beatingOscillator: OscillatorNode;
  private harmonics: OscillatorNode[] = [];
  private gains: GainNode[] = [];
  private gainBeating: GainNode;
  private masterGain: GainNode;
  constructor(
    audioContext: AudioContext,
    frequency: number,
    type: OscillatorType,
    beatOffset: number,
    /**
     * 0 to 1
     */
    randomnessFactor: number,
    /**
     * 0 to 6
     */
    resolution: number,
    masterGainValue: number = 0.5
  ) {
    this.oscillator = audioContext.createOscillator();
    this.oscillator.frequency.value = frequency;
    this.oscillator.type = type;
    this.beatingOscillator = audioContext.createOscillator();
    this.beatingOscillator.frequency.value = frequency + beatOffset;
    this.gainBeating = audioContext.createGain();
    this.gainBeating.gain.value = 0.7;
    this.masterGain = audioContext.createGain();
    this.masterGain.gain.value = masterGainValue;

    for (let i = 0; i < resolution; i++) {
      const overtone = audioContext.createOscillator();
      this.harmonics.push(overtone);
      this.gains.push(audioContext.createGain());
      this.gains[i].gain.value = 0.2;
      overtone.frequency.value =
        frequency * (i + 1) +
        RAND_DIRECTION * RAND_CONSTANT * 100 * randomnessFactor;
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
    this.gains.forEach((gain) => gain.connect(this.masterGain));
    this.beatingOscillator.connect(this.gainBeating);
    this.gainBeating.connect(this.masterGain);
    this.masterGain.connect(destination);
    return this.oscillator.connect(destination);
  }
}
