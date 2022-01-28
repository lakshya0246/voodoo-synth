import { MIDI_KEY_NOTE_FREQUENCY_MAP } from '.';

export function getMidiNote(inputKey: string): number {
  const baseKeys = Object.keys(MIDI_KEY_NOTE_FREQUENCY_MAP);
  for (let i = 0; i < baseKeys.length; i++) {
    const key = baseKeys[i];
    if (key === inputKey) {
      return MIDI_KEY_NOTE_FREQUENCY_MAP[key];
    }

    const difference = +key - +inputKey;
    if (Math.abs(difference) % 12 === 0) {
      const multiplier = Math.pow(2, Math.abs(difference) / 12);

      if (+key > +inputKey) {
        return MIDI_KEY_NOTE_FREQUENCY_MAP[key] / multiplier;
      }

      return MIDI_KEY_NOTE_FREQUENCY_MAP[key] * multiplier;
    }
  }
  return 0;
}
