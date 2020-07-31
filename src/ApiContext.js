import React from 'react'

const ApiContext = React.createContext({
  notes: [],
  folders: [],
  index:0,
  addFolder: () => {},
  addNote: () => {},
  deleteNote: () => {}

});
export default ApiContext;
