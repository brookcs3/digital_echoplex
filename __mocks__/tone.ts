export class Player {
  start = jest.fn();
  stop = jest.fn();
  connect = jest.fn();
  dispose = jest.fn();
}
export class Recorder {
  start = jest.fn();
  stop = jest.fn();
  connect = jest.fn();
  dispose = jest.fn();
}
export class FeedbackDelay {
  feedback = { value: 0 };
  constructor() {}
  connect() { return this; }
  dispose() {}
}
export class Gain {
  gain = { value: 0 };
  constructor() {}
  toDestination() { return this; }
  connect() {}
  dispose() {}
}
export class CrossFade {
  a = {};
  b = {};
  fade = { value: 0 };
  constructor() {}
  connect() { return this; }
  dispose() {}
}
export class Analyser {
  constructor() {}
  connect() {}
  dispose() {}
  getValue() { return new Float32Array(); }
}
export class UserMedia {
  open = jest.fn().mockResolvedValue(undefined);
  connect = jest.fn();
  close = jest.fn();
}
export function setContext(){}
