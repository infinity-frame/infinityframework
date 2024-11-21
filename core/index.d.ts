export interface coreInt {
  /** Initializes the app. Optionally define the path to manifest.json */
  init: (manifest?: string) => void;
}

export interface ModuleConfig {
  version?: string;
}

export interface Manifest {
  modules?: {
    local?: {
      [packageName: string]: ModuleConfig;
    };
    npm?: object;
  };
}

export declare const core: coreInt;
