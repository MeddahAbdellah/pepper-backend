"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const body_parser_1 = (0, tslib_1.__importDefault)(require("body-parser"));
const routes_1 = (0, tslib_1.__importDefault)(require("routes"));
const jobs_1 = require("services/jobs");
const figlet_1 = (0, tslib_1.__importDefault)(require("figlet"));
const gradient_string_1 = (0, tslib_1.__importDefault)(require("gradient-string"));
const envHelper_1 = (0, tslib_1.__importDefault)(require("helpers/envHelper"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({
    limit: '10mb',
    extended: false
}));
app.use(body_parser_1.default.json());
app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use((req, _res, next) => {
    console.log('Requeset Body: ', req.body);
    console.log('Requeset Method: ', req.method);
    console.log('Requeset Url: ', req.originalUrl);
    console.log('Requeset Headers: ', req.headers);
    next();
});
app.use('/api/', routes_1.default);
app.get('/health-check/', (_req, res) => res.json({ message: 'up' }));
if (!envHelper_1.default.isTest()) {
    app.listen(process.env.PORT || 7550, () => {
        (0, jobs_1.runJobs)();
        console.log(gradient_string_1.default.pastel.multiline(figlet_1.default.textSync('Pepper')));
        console.log(`Https server running on port ${process.env.PORT || 7550}`);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map