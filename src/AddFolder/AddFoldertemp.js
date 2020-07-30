import React from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import config from "../config";
import ApiContext from "../ApiContext";
import FormValidator from "../FormValidator/FormValidator";

export default class AddFolder extends React.Component {
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
  }

  validateName() {
    const name = this.state.name.value.trim();
    if (name.length === 0) {
      return "Name is required";
    } else if (name.length < 3) {
      return "Name must be at least 3 characters long";
    }
  }

  static contextType = ApiContext;
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
        //console.log(this.context);
        // allow parent to perform extra behaviour
        this.props.history.push(`/`);
      })
      .catch((error) => {
        console.error({ error });
      });
  }

  render() {
    let { folderName } = { folderName: "" };
    return (
      <NotefulForm>
        <FormValidator>
          <label htmlFor="form-input-name">Enter a folder name:</label>
          <input
            className="form-input"
            onChange={(e) => {
              this.updateName(e.target.value);
              folderName = e.currentTarget.value;
            }}
            id="form-input-name"
            placeholder="Enter folder name."
          />

          <button
            className="submit-btn"
            name="submit-folder"
            id="submit-folder"
            onClick={(e) => {
              this.apiAddFolder(e, folderName);
            }}
          >
            Add New Folder
          </button>
        </FormValidator>
      </NotefulForm>
    );
  }
}
