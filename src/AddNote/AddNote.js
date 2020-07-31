import React from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import config from "../config";
import ApiContext from "../ApiContext";
import {v4} from "uuid";


export default class AddNote extends React.Component {
  static contextType = ApiContext;
  populateOptions()
  {
    return this.context.folders.map((folder)=>{
    return <option key={folder.id} value={folder.id}>{folder.name}</option>

    })
  }
  apiAddNote(e, note) {
    e.preventDefault();
    console.log(note);
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
    let note = { name:"", content:"", folderId:"",modified: new Date(), id:v4()} 

    console.log(note.id);

    return (
      <NotefulForm>
        <label htmlFor="form-input-name">Enter a note name:</label>
        <input
          className="form-input"
          onChange={(e) => {
            note.name = e.currentTarget.value;
            console.log(note.name);
          }}
          id="form-input-name"
          placeholder="Enter note name."
        />
        <input
          className="form-input"
          onChange={(e) => {
            note.content = e.currentTarget.value;
          }}
          id="form-input-content"
          placeholder="Enter content."
        />
        
        <select defaultValue="default" onChange={(e)=>{
          note.folderId = e.currentTarget.value;
          
        }}>
          <option value="default">Pick a Folder:</option>
          {this.populateOptions()}
        </select>

        <button
          className="submit-btn"
          name="submit-note"
          id="submit-note"
          onClick={(e) => {
            this.apiAddNote(e, note);
          }}
        >
          Add New Note
        </button>
      </NotefulForm>
    );
  }
}
