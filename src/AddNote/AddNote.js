/* eslint-disable no-useless-escape */
import React from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import config from "../config";
import ApiContext from "../ApiContext";
import { v4 } from "uuid";
import FormValidator from "../FormValidator/FormValidator";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { isThisMinute } from "date-fns"; //? - Unused? Didn't want to delete without checking

export default class AddNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      note: {
        name: "",
        content: "",
        folderId: "",
      },
      nameTouched: false,
      contentTouched: false,
      folderTouched: false,
    };
  }

  updateNote(note) {
    this.setState({
      note: {
        name: note.name,
        content: note.content,
        folderId: note.folderId,
      },
    });
    return note;
  }

  validateName() {
    const name = this.state.note.name.trim();
    const err = " Note name is required";
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
    const name = this.state.note.name.trim();
    const err =
      " Special characters besides [space] and [-] will be removed from note name";
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
    const name = this.state.note.name.trim();
    return name.replace(/[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]/g, "");
  }

  validateContent() {
    const content = this.state.note.content.trim();
    const err = " Content is required";

    if (content.length === 0) {
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

  validateFolderId() {
    const folder = this.state.note.folderId;
    const err = " Please choose a folder";

    if (folder.length === 0 || folder === "default") {
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

  static contextType = ApiContext;
  populateOptions() {
    return this.context.folders.map((folder) => {
      return (
        <option key={folder.id} value={folder.id}>
          {folder.name}
        </option>
      );
    });
  }

  apiAddNote(e, note) {
    e.preventDefault();

    fetch(`${config.API_ENDPOINT}/notes/`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(note),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then((resp) => {
        this.context.addNote(resp);
        this.props.history.push(`/`);
      })
      .catch((error) => {
        console.error({ error });
      });
  }

  render() {
    let note = {
      name: this.state.note.name,
      content: this.state.note.content,
      folderId: this.state.note.folderId,
      modified: new Date(),
      id: v4(),
    };

    const nameErr = this.validateName();
    const symbolErr = this.validateSymbols();
    const contentErr = this.validateContent();
    const folderErr = this.validateFolderId();

    return (
      <NotefulForm>
        <label htmlFor="form-input-name">Enter a note name:</label>
        <input
          value={this.state.note.name}
          className="form-input"
          onChange={(e) => {
            this.setState({ nameTouched: true });
            note.name = e.currentTarget.value;
            this.updateNote(note);
          }}
          id="form-input-name"
          placeholder="Enter note name."
        />
        <input
          className="form-input"
          onChange={(e) => {
            this.setState({ contentTouched: true });
            note.content = e.currentTarget.value;
            this.updateNote(note);
          }}
          id="form-input-content"
          placeholder="Enter content."
        />

        <select
          defaultValue="default"
          onChange={(e) => {
            this.setState({ folderTouched: true });
            note.folderId = e.currentTarget.value;
            this.updateNote(note);
          }}
        >
          <option value="default">Pick a Folder:</option>
          {this.populateOptions()}
        </select>

        <button
          className="submit-btn"
          name="submit-note"
          id="submit-note"
          onClick={(e) => {
            this.setState({ nameTouched: true });
            this.setState({ contentTouched: true });
            this.setState({ folderTouched: true });
            note.name = this.removeSpecialChars(note.name);
            this.updateNote(note);
            if (!nameErr && !contentErr && !folderErr) {
              this.apiAddNote(e, note);
            }
          }}
        >
          Add New Note
        </button>
        <div className="errorMessages">
          {this.state.nameTouched && <FormValidator message={symbolErr} />}
          {this.state.nameTouched && <FormValidator message={nameErr} />}
          {this.state.contentTouched && <FormValidator message={contentErr} />}
          {this.state.folderTouched && <FormValidator message={folderErr} />}
        </div>
      </NotefulForm>
    );
  }
}
