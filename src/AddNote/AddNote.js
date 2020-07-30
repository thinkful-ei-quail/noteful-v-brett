import React from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import config from "../config";
import ApiContext from "../ApiContext";

export default class AddNote extends React.Component {
  static contextType = ApiContext;

  apiAddNote(e, name) {
    e.preventDefault();
    const noteObj = {
      name: name,
      folderId: "",
      content: "",
    };

    fetch(`${config.API_ENDPOINT}/notes/`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(noteObj),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then((resp) => {
        this.context.addNote(resp);
        //console.log(this.context);
        // allow parent to perform extra behaviour
        this.props.history.push(`/`);
      })
      .catch((error) => {
        console.error({ error });
      });
  }

  render() {
    let noteObj = {
      noteName: "",
      content: "",
      folderId: "",
    };

    let { noteName, content, folderId } = noteObj;

    return (
      <NotefulForm>
        <label htmlFor="form-input-name">Enter a note name:</label>
        <input
          className="form-input"
          onChange={(e) => {
            noteName = e.currentTarget.value;
          }}
          id="form-input-name"
          placeholder="Enter note name."
        />
        <input
          className="form-input"
          onChange={(e) => {
            content = e.currentTarget.value;
          }}
          id="form-input-content"
          placeholder="Enter content."
        />
        <select />
        <button
          className="submit-btn"
          name="submit-note"
          id="submit-note"
          onClick={(e) => {
            this.apiAddNote(e, noteName);
          }}
        >
          Add New Note
        </button>
      </NotefulForm>
    );
  }
}
