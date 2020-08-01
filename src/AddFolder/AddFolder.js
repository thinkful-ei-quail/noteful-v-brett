/* eslint-disable no-useless-escape */
import React from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import config from "../config";
import ApiContext from "../ApiContext";
import FormValidator from "../FormValidator/FormValidator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

import "./AddFolder.css";

export default class AddFolder extends React.Component {
  static contextType = ApiContext;

  constructor(props) {
    super(props);
    this.state = {
      name: {
        value: "",
        touched: false,
      },
    };
  }

  updateName(name) {
    this.setState({ name: { value: name, touched: true } });
    return name;
  }

  validateName() {
    const name = this.state.name.value.trim();
    const err = " Folder name is required";
    if (this.removeSpecialChars(name).length === 0) {
      return (
        <div className="critical">
          <FontAwesomeIcon
            className="criticalIcon"
            icon={faExclamationCircle}
          />
          {err}
        </div>
      );
    }
  }

  validateSymbols() {
    const name = this.state.name.value.trim();
    const err = " Special characters besides [space] and [-] will be removed";
    const symbols = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]/g;
    if (symbols.test(name))
      return (
        <div className="warning">
          <FontAwesomeIcon
            className="warningIcon"
            icon={faExclamationTriangle}
          />
          {err}
        </div>
      );
  }

  removeSpecialChars() {
    const name = this.state.name.value.trim();
    return name.replace(/[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]/g, "");
  }

  //populateOptions; //? <-- I don't know if this was something I did or not, doesn't seem to do anything

  apiAddFolder(e, name) {
    e.preventDefault();
    const folderObj = { name: name };
    fetch(`${config.API_ENDPOINT}/folders/`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(folderObj),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then((resp) => {
        this.context.addFolder(resp);
        this.props.history.push(`/`);
      })
      .catch((error) => {
        console.error({ error });
      });
  }

  render() {
    const nameError = this.validateName();
    const symbolError = this.validateSymbols();

    let folderName = this.state.name.value;
    return (
      <NotefulForm>
        <label htmlFor="form-input-name">Enter a folder name:</label>
        <input
          className="form-input"
          onChange={(e) => {
            this.updateName(e.currentTarget.value);
            folderName = e.currentTarget.value;
          }}
          id="form-input-name"
          placeholder="Enter folder name."
        />
        <button
          disabled={this.validateName()}
          className="submit-btn"
          name="submit-folder"
          id="submit-folder"
          onMouseEnter={(e) => {
            this.updateName(folderName);
          }}
          onClick={(e) => {
            folderName = this.updateName(this.removeSpecialChars(folderName));
            this.apiAddFolder(e, folderName);
          }}
        >
          Add New Folder
        </button>
        <div className="errorMessages">
          {this.state.name.touched && <FormValidator message={nameError} />}
          {this.state.name.touched && <FormValidator message={symbolError} />}
        </div>
      </NotefulForm>
    );
  }
}
