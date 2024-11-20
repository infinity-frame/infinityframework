export interface coreInt {
  /** Initializes the app. Optionally define the path to manifest.json */
  init: (manifest?: string) => void;
}

export interface manifestInt {
  name: string;
}

export declare const core: coreInt;
