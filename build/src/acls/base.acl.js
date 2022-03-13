"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.AUTH_FUNCS = exports.AUTH_NAMES = exports.AUTH_FOR_ALL = void 0;
exports.AUTH_FOR_ALL = 'AUTH_FOR_ALL';
exports.AUTH_NAMES = {
    All: 'All',
    IsOrganizer: 'IsOrganizer',
    IsUser: 'IsUser',
};
exports.AUTH_FUNCS = {
    [exports.AUTH_NAMES.All]: () => { },
    [exports.AUTH_NAMES.IsOrganizer]: () => { },
    [exports.AUTH_NAMES.IsUser]: () => { },
};
class auth {
    static For(authorizations, paramsGetters = {}) {
        return (target, property) => {
            target[property].authorizedFor = authorizations;
            target[property].authorizedForGetters = paramsGetters;
        };
    }
}
exports.auth = auth;
auth.acl = exports.AUTH_NAMES;
//# sourceMappingURL=base.acl.js.map