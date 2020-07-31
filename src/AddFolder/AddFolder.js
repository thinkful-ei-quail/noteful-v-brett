import React from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import config from "../config";
import ApiContext from "../ApiContext";

export default class AddFolder extends React.Component {
  static contextType = ApiContext;

  populateOptions
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
    let { folderName } = { folderName: "" };
    return (
      <NotefulForm>
        <label htmlFor="form-input-name">Enter a folder name:</label>
        <input
          className="form-input"
          onChange={(e) => {
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
      </NotefulForm>
    );
  }
}
