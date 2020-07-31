/* eslint-disable no-useless-escape */
import React from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import config from "../config";
import ApiContext from "../ApiContext";
import FormValidator from "../FormValidator/FormValidator";

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
    //name.replace(/[^a-zA-Z0-9"-"]/g, "");
    if (name.length === 0) {
      return "Folder name is required";
    } else if (name.length < 3) {
      return "Folder name must be at least 3 characters";
    }
  }

  validateSymbols() {
    const name = this.state.name.value.trim();

    const regex = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]/g;
    if (regex.test(name))
      return "Special characters besides [space] and [-] will be removed";
  }

  removeSpecialChars() {
    const name = this.state.name.value.trim();
    return name.replace(/[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]/g, "");
  }

  populateOptions;
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
