"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = (0, tslib_1.__importDefault)(require("react"));
function LandingPage() {
    const css = `
    * { 
      padding: 0;
      margin: 0;
      font-family: Sora;
      text-aling: center;
    }
    body {
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-x: hidden;
      background: rgb(151,47,255);
      background: linear-gradient(127deg, rgba(151,47,255,1) 0%, rgba(184,25,240,1) 35%, rgba(221,36,147,1) 100%);
    }

    .mainContainer {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }

    .header {
      font-size: 2.8rem;
      margin-bottom: 30px;
      margin-top: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .slogan {
      font-size: 1rem;
      text-align: center;
      margin-top: 15px;
    }

    img {
      width: 40%;
    }

    .newsLetterContainer {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }

    .newsLetterContainer h1 {
      font-size: 2.8rem;
      margin-bottom: 30px;
      margin-top: 30px;
      text-align: center;
    }

    .newsLetterContainer h3 {
      width: 50%;
      font-size: 1.5rem;
      margin-bottom: 30px;
      margin-top: 30px;
      text-align: center;
    }

    input {
      width: 50%;
      height: 40px;
      border-radius: 5px;
      border: 1px solid #DCE1EE;
      padding: 0 10px;
      font-size: 1rem;
      margin: 10px;
    }

    button {
      all: unset;
      cursor: pointer;
      padding: 10px;
      border-bottom: 1px solid transparent;
      transition: 0.2s;
      background-color: #424242;
      color: white;
      font-size: 1.1rem;
      border-radius: 5px;
      margin: 10px;
      width: 30%;
      text-align: center;
    }

    ::-webkit-scrollbar {
      display: none;
    }

    @media only screen and (max-width: 900px) {
      .mainContainer {
        justify-content: center;
      }

      .header {
        font-size: 7vw;
        margin-bottom: 60px;
        margin-top: 0px;
      }
  
      img {
        width: 90%;
      }

      .newsLetterContainer h3 {
        width: 90%;
      }

      .slogan {
        font-size: 3vw;
        margin-top: 60px;
      }

      input {
        width: 80%;
      }

      button {
        width: 60%;
      }
    }
    `;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("meta", { content: "width=device-width, initial-scale=1", name: "viewport" }),
        react_1.default.createElement("style", { type: "text/css" }, css),
        react_1.default.createElement("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
        react_1.default.createElement("link", { rel: "preconnect", href: "https://fonts.gstatic.com" }),
        react_1.default.createElement("link", { href: "https://fonts.googleapis.com/css2?family=Sora:wght@600&display=swap", rel: "stylesheet" }),
        react_1.default.createElement("div", { className: "mainContainer" },
            react_1.default.createElement("div", { className: "header" },
                react_1.default.createElement("img", { src: "pepperLogo.svg" }),
                react_1.default.createElement("h1", null, "Pepper")),
            react_1.default.createElement("img", { src: "landing.svg" }),
            react_1.default.createElement("div", { className: "slogan" },
                react_1.default.createElement("h2", null, "Bringing back dating to real life!"),
                react_1.default.createElement("h2", null, "You can't find love by staying home alone"))),
        react_1.default.createElement("div", { className: "newsLetterContainer" },
            react_1.default.createElement("h1", null, "Sign up for our newsletter"),
            react_1.default.createElement("h3", null, "We will organize parties for singles aimed to make you socialize and meet the love of your life"),
            react_1.default.createElement("input", { type: "text", placeholder: "Enter your email address" }),
            react_1.default.createElement("button", null, "Sign up"))));
}
exports.default = LandingPage;
//# sourceMappingURL=landing.js.map