import React from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import config from "../config";
import ApiContext from "../ApiContext";
import FormValidator from "../FormValidator/FormValidator";

export default class AddFolder extends React.Component {
  static contextType = ApiContext;

  constructor(props) {
    super(props);
    this.state = {
      name: {
        value: "",
        touched: true,
      },
    };
  }

  updateName(name) {
    this.setState({ name: { value: name, touched: true } });
    return name;
  }

  validateName() {
    const name = this.state.name.value.trim();
    if (name.length === 0) {
      return "Name is required";
    } else if (name.length < 3) {
      return "Name must be at least 3 characters long";
    }
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
    //let { folderName } = { folderName: "hmm" };
    let folderName = this.state.name.value;
    return (
      <NotefulForm>
        <label htmlFor="form-input-name">Enter a folder name:</label>
        <input
          className="form-input"
          onChange={(e) => {
            console.log("updateName: ", this.updateName(e.currentTarget.value));
            folderName = e.currentTarget.value;
            console.log("folderName first: ", folderName);
          }}
          id="form-input-name"
          placeholder="Enter folder name."
        />
        <button
          className="submit-btn"
          name="submit-folder"
          id="submit-folder"
          onClick={(e) => {
            // this.updateName(folderName);
            console.log("folderName: ", folderName);
            this.apiAddFolder(e, folderName);
          }}
        >
          Add New Folder
        </button>
        {this.state.name.touched && <FormValidator message={nameError} />}
      </NotefulForm>
    );
  }
}
