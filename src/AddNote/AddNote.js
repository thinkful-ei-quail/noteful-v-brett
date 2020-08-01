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
        touched: false,
      },
    };
  }

  updateNote(note) {
    this.setState({
      note: {
        name: note.name,
        content: note.content,
        folderId: note.folderId,
        touched: true,
      },
    });
    return note;
  }

  validateName() {
    console.log(this.state.note);
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
    // const content = this.state.note.content.trim();
    // const err = " content is required";
    // if (content.length === 0) {
    //   return (
    //     <div className="critical">
    //       <FontAwesomeIcon
    //         className="criticalIcon"
    //         icon={faExclamationCircle}
    //       />
    //       {err}
    //     </div>
    //   );
    // }
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
    //console.log(note);
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
    //console.log(note.id);

    const nameError = this.validateName();
    const symbolError = this.validateSymbols();
    const contentError = this.validateContent();
    const folderIdError = this.validateFolderId();

    const errors = [nameError, symbolError, contentError, folderIdError];

    return (
      <NotefulForm>
        <label htmlFor="form-input-name">Enter a note name:</label>
        <input
          className="form-input"
          onChange={(e) => {
            note.name = e.currentTarget.value;
            this.updateNote(note);
            //console.log(note.name);
          }}
          id="form-input-name"
          placeholder="Enter note name."
        />
        <input
          className="form-input"
          onChange={(e) => {
            note.content = e.currentTarget.value;
            this.updateNote(note);
          }}
          id="form-input-content"
          placeholder="Enter content."
        />

        <select
          defaultValue="default"
          onChange={(e) => {
            note.folderId = e.currentTarget.value;
          }}
        >
          <option value="default">Pick a Folder:</option>
          {this.populateOptions()}
        </select>

        <button
          disabled={nameError || contentError} //! - || folderIdError
          className="submit-btn"
          name="submit-note"
          id="submit-note"
          onMouseEnter={(e) => {
            this.updateNote(note); //? - is there a better way?
          }}
          onClick={(e) => {
            console.log("note before ", note);
            this.removeSpecialChars(note.name);
            note.name = this.updateNote(note);
            console.log("note after", note);
            this.apiAddNote(e, note);
          }}
        >
          Add New Note
        </button>
        <div className="errorMessages">
          {this.state.note.touched && <FormValidator message={symbolError} />}
          {this.state.note.touched && <FormValidator message={nameError} />}
          {this.state.note.touched && <FormValidator message={contentError} />}
          {/*this.state.note.touched && <FormValidator message={folderIdError} />*/}
        </div>
      </NotefulForm>
    ); //TODO - Here be where ye left off - Make this an array
  }
}
