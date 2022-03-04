enum Env {
  Local = 'local',
  Test = 'test',
  Prod = 'prod',
}

export default class EnvHelper {
  public static isLocal(): boolean {
    return process.env.NODE_ENV === Env.Local;
  }

  public static isTest(): boolean {
    return process.env.NODE_ENV === Env.Test;
  }
}