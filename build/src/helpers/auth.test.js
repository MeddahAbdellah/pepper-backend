"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const auth_1 = (0, tslib_1.__importDefault)(require("helpers/auth"));
describe("# Twilio", () => {
    test.skip("Create verification", () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        yield auth_1.default.createVerification('0769238622');
    }));
    test.skip("Check verification", () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const isVerified = yield auth_1.default.checkVerification('0769238622', '231286');
        console.log('isVerified', isVerified);
    }));
});
//# sourceMappingURL=auth.test.js.map