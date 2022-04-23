"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizerStatus = exports.StoreStatus = exports.Gender = exports.UserPartyStatus = exports.MatchStatus = void 0;
;
;
;
var MatchStatus;
(function (MatchStatus) {
    MatchStatus["ACCEPTED"] = "accepted";
    MatchStatus["WAITING"] = "waiting";
    MatchStatus["UNCHECKED"] = "unchecked";
    MatchStatus["UNAVAILABLE"] = "unavailable";
})(MatchStatus = exports.MatchStatus || (exports.MatchStatus = {}));
var UserPartyStatus;
(function (UserPartyStatus) {
    UserPartyStatus["WAITING"] = "waiting";
    UserPartyStatus["ACCEPTED"] = "accepted";
    UserPartyStatus["ATTENDED"] = "attended";
    UserPartyStatus["REJECTED"] = "rejected";
    UserPartyStatus["ABSENT"] = "absent";
})(UserPartyStatus = exports.UserPartyStatus || (exports.UserPartyStatus = {}));
var Gender;
(function (Gender) {
    Gender["MAN"] = "man";
    Gender["WOMAN"] = "woman";
})(Gender = exports.Gender || (exports.Gender = {}));
var StoreStatus;
(function (StoreStatus) {
    StoreStatus["Idle"] = "idle";
    StoreStatus["Pending"] = "pending";
    StoreStatus["Fulfilled"] = "fulfilled";
    StoreStatus["Rejected"] = "rejected";
})(StoreStatus = exports.StoreStatus || (exports.StoreStatus = {}));
;
var OrganizerStatus;
(function (OrganizerStatus) {
    OrganizerStatus["Pending"] = "pending";
    OrganizerStatus["Accepted"] = "accepted";
    OrganizerStatus["Rejected"] = "rejected";
})(OrganizerStatus = exports.OrganizerStatus || (exports.OrganizerStatus = {}));
//# sourceMappingURL=types.js.map