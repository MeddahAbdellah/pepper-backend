export const AUTH_FOR_ALL = 'AUTH_FOR_ALL';
export const AUTH_NAMES = {
  All: 'All',
  IsOrganizer: 'IsOrganizer',
  IsUser: 'IsUser',
};

export const AUTH_FUNCS = {
  [AUTH_NAMES.All]: () => {},
  [AUTH_NAMES.IsOrganizer]: () => {},
  [AUTH_NAMES.IsUser]: () => {},
}

export class auth {
    public static readonly acl = AUTH_NAMES;
  
    static For(authorizations: Array<string>, paramsGetters: Record<string, (req: Request) => unknown> = {}): MethodDecorator {
      return (target: any, property: any): void => {
        target[property].authorizedFor = authorizations; // eslint-disable-line no-param-reassign
        target[property].authorizedForGetters = paramsGetters; // eslint-disable-line no-param-reassign
      };
    }
  }