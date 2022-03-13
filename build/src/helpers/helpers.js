"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = exports.parseFiles = exports.checkParametersAndCallRoute = exports.validation = void 0;
const tslib_1 = require("tslib");
require("dotenv/config");
const http_status_1 = (0, tslib_1.__importDefault)(require("http-status"));
const lodash_1 = (0, tslib_1.__importDefault)(require("lodash"));
const formidable_1 = (0, tslib_1.__importDefault)(require("formidable"));
const aws_sdk_1 = (0, tslib_1.__importDefault)(require("aws-sdk"));
const uuid_1 = require("uuid");
function validation(schema) {
    return (target, property) => {
        target[property].schema = schema;
    };
}
exports.validation = validation;
function getValidationHandler(schema) {
    return (req, res, next) => {
        const isValid = schema.validate(lodash_1.default.isEmpty(req.body) ? req.query : req.body);
        if (isValid.error) {
            console.log('Error at Validation', isValid.error.details[0].message);
            res.status(http_status_1.default.BAD_REQUEST);
            res.json({
                message: isValid.error.details[0].message,
            });
            return;
        }
        next();
    };
}
function checkParametersAndCallRoute(method) {
    const validation = method.schema ? getValidationHandler(method.schema) : (_req, _res, next) => next();
    const methodCall = (req, res, next) => {
        Promise.resolve(method.call(null, req, res, next)).catch((e) => next(e));
    };
    return [validation, methodCall];
}
exports.checkParametersAndCallRoute = checkParametersAndCallRoute;
function parseFiles(req) {
    return new Promise((resolve) => {
        const form = (0, formidable_1.default)({ multiples: true });
        form.parse(req, (err, fields, _files) => {
            if (err) {
                throw err;
            }
            resolve(fields);
        });
    });
}
exports.parseFiles = parseFiles;
function uploadToS3(file) {
    return new Promise((resolve) => {
        const s3 = new aws_sdk_1.default.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
        if (!process.env.AWS_BUCKET) {
            throw 'Bucket not specified';
        }
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: (0, uuid_1.v4)(),
            ContentType: 'image/jpeg',
            Body: file,
        };
        s3.upload(params, (s3Err, data) => {
            if (s3Err) {
                throw s3Err;
            }
            ;
            console.log('File uploaded successfully at', data);
            resolve(data.Location);
        });
    });
}
exports.uploadToS3 = uploadToS3;
//# sourceMappingURL=helpers.js.map