enum Env {
  Local = 'local',
  Test = 'test',
  Prod = 'prod',
}

export default class EnvHelper {
  public static isLocal(): boolean {
    if (process.env.ENV === Env.Prod) {
      return false;
    }
    return true;
  }
}