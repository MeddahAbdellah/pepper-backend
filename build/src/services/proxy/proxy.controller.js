"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyController = void 0;
const tslib_1 = require("tslib");
const helpers_1 = require("helpers/helpers");
const joi_1 = (0, tslib_1.__importDefault)(require("joi"));
class ProxyController {
    static uploadImageToS3(req, res) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const body = yield (0, helpers_1.parseFiles)(req);
            const blob = Buffer.from(body.img, 'base64');
            const uri = yield (0, helpers_1.uploadToS3)(blob);
            return res.json({ uri });
        });
    }
}
(0, tslib_1.__decorate)([
    (0, helpers_1.validation)(joi_1.default.object({}))
], ProxyController, "uploadImageToS3", null);
exports.ProxyController = ProxyController;
//# sourceMappingURL=proxy.controller.js.map