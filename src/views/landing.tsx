// landing page for pepper dating app

import React from 'react';

export default function LandingPage() {
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

  return (
    <>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <style type="text/css">{css}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link rel="preconnect" href="https://fonts.gstatic.com"></link>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@600&display=swap" rel="stylesheet"></link>
      <div className="mainContainer">
        <div className="header">
          <img src="pepperLogo.svg"/>
          <h1>Pepper</h1>
        </div>
        <img src="landing.svg"/>
        <div className="slogan">
          <h2>Bringing back dating to real life!</h2>
          <h2>You can't find love by staying home alone</h2>
        </div>
      </div>

      <div className="newsLetterContainer">
        <h1>Sign up for our newsletter</h1>
        <h3>We will organize parties for singles aimed to make you socialize and meet the love of your life</h3>
        <input type="text" placeholder="Enter your email address"/>
        <button>Sign up</button>
      </div>
    </>
  );
}