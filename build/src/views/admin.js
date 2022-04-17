"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const types_1 = require("models/types");
const react_1 = (0, tslib_1.__importDefault)(require("react"));
class Admin extends react_1.default.Component {
    render() {
        const css = `
    * { 
      padding: 0;
      margin: 0;
      font-family: Sora;
    }
    body {
      background-color: #F7F9F9;
      padding: 20px;
    }
    .header {
      width: 100%;
    }
    .header h1 {
      color: #B819F0;
      padding: 15px;
      font-family: Sora;
      margin-bottom: 15px;
    }
    table {
      border-collapse: collapse;
    }
    .container {
      width: 100%;
    }
    tr {
      border-radius: 10px;
      font-family: Sora;
      border-bottom: 1px solid #DCE1EE;
    }
    thead th {
      font-size: 12px;
      color: #959DAD;
    }
    tbody th {
      font-size: 14px;
      color: #001235;
    }
    th {
      padding: 10px;
      text-align: left;
      font-weight: 300;
      font-family: Sora;
    }
    button {
      all: unset;
      cursor: pointer;
      padding: 5px;
      border-bottom: 1px solid transparent;
      transition: 0.2s;
    }
    .delete {
      color: #E74C3C;
    }
    .delete:hover {
      border-bottom: 1px solid #E74C3C;
    }
    .validate {
      color: #0046DA;
    }
    .validate:hover {
      border-bottom: 1px solid #0046DA;
    }
    .disabled {
      color: #959DAD;
    }
    `;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
            react_1.default.createElement("link", { rel: "preconnect", href: "https://fonts.gstatic.com" }),
            react_1.default.createElement("link", { href: "https://fonts.googleapis.com/css2?family=Sora:wght@300;600&display=swap", rel: "stylesheet" }),
            react_1.default.createElement("style", { type: "text/css" }, css),
            react_1.default.createElement("div", { className: "header" },
                react_1.default.createElement("h1", null, "Pepper Admin")),
            react_1.default.createElement("table", { className: "container" },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", null, "Title"),
                        react_1.default.createElement("th", null, "Location"),
                        react_1.default.createElement("th", null, "Phone"),
                        react_1.default.createElement("th", null, "Status"),
                        react_1.default.createElement("th", null),
                        react_1.default.createElement("th", null))),
                react_1.default.createElement("tbody", null, this.props.organizers.map((organizer) => (react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", null, organizer.title),
                    react_1.default.createElement("th", null, organizer.location),
                    react_1.default.createElement("th", null, organizer.phoneNumber),
                    react_1.default.createElement("th", null, organizer.status),
                    react_1.default.createElement("th", null,
                        react_1.default.createElement("button", { "data-action": "delete", "data-id": organizer.id, "data-status": organizer.status, className: organizer.status !== types_1.OrganizerStatus.Rejected ? "delete" : "disabled" }, "Delete")),
                    react_1.default.createElement("th", null,
                        react_1.default.createElement("button", { "data-action": "validate", "data-id": organizer.id, "data-status": organizer.status, className: organizer.status !== types_1.OrganizerStatus.Accepted ? "validate" : "disabled" }, "Validate"))))))),
            react_1.default.createElement("script", { src: "adminLogic.js" })));
    }
}
exports.default = Admin;
//# sourceMappingURL=admin.js.map