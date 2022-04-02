import { IOrganizer, OrganizerStatus } from "models/types";
import React, { Component } from "react";

export interface Props {
  organizers: IOrganizer[];
}

export default class Admin extends React.Component<Props> {
  componentDidMount() {
    const buttons = document.getElementsByTagName("button");
  }

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


    return (
    <>
    <link rel="preconnect" href="https://fonts.googleapis.com"></link>
    <link rel="preconnect" href="https://fonts.gstatic.com"></link>
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;600&display=swap" rel="stylesheet"></link>
    <style type="text/css">
      {css}
    </style>
    <div className="header">
      <h1>Pepper Admin</h1>
    </div>
    <table className="container">
      <thead>
        <tr>
          <th>Title</th>
          <th>Location</th>
          <th>Phone</th>
          <th>Status</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          this.props.organizers.map((organizer) => (
            <tr>
              <th>{organizer.title}</th>
              <th>{organizer.location}</th>
              <th>{organizer.phoneNumber}</th>
              <th>{organizer.status}</th>
              <th><button data-action="delete" data-id={organizer.id} data-status={organizer.status} className={organizer.status !== OrganizerStatus.Rejected ? "delete" : "disabled"}>Delete</button></th>
              <th><button data-action="validate" data-id={organizer.id} data-status={organizer.status} className={organizer.status !== OrganizerStatus.Accepted ? "validate" : "disabled"}>Validate</button></th>
            </tr>
          ))
        }
      </tbody>
    </table>
    <script src="adminLogic.js"></script>
    </>
    );
  }
}