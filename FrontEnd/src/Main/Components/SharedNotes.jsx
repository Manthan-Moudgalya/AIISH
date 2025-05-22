import { useState } from 'react';
import './SharedNotes.css';

function SharedNotes() {
  const [notes, setNotes] = useState([]);

    function clearInputs() {
        document.getElementById("noteTitle").value = "";
        document.getElementById("noteContent").value = "";
        document.getElementById("imageInput").value = "";
    }

    async function saveNoteToBackend(note) {
        try {
        const response = await fetch('/api/save_note', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        });
        const result = await response.json();
        console.log("Saved to backend:", result);
        } catch (err) {
        console.error("Error saving note:", err);
        }
    }

    const handleSave = async () => {
        const title = document.getElementById("noteTitle").value.trim();
        const content = document.getElementById("noteContent").value.trim();
        const fileInput = document.getElementById("imageInput");

        if (!title || !content) {
            alert("Please fill in both title and content.");
            return;
        }

        const note = { title, content, image: "" };

        const file = fileInput.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = async function(e) {
            note.image = e.target.result;
            setNotes(prevNotes => {
            const updatedNotes = [...prevNotes, note];
            saveNoteToBackend(note);
            return updatedNotes;
            });
            clearInputs();
        };
        reader.readAsDataURL(file);
        } else {
        setNotes(prevNotes => {
            const updatedNotes = [...prevNotes, note];
            saveNoteToBackend(note);
            return updatedNotes;
        });
        clearInputs();
        }
    };

  const editNote = (index) => {
    const note = notes[index];
    document.getElementById("noteTitle").value = note.title;
    document.getElementById("noteContent").value = note.content;
    setNotes(prevNotes => {
      const updatedNotes = [...prevNotes];
      updatedNotes.splice(index, 1);
      return updatedNotes;
    });
  };

  const deleteNote = (index) => {
    const shouldDelete = window.prompt("Type YES to confirm deletion of this note.") === "YES";
    if (shouldDelete) {
      setNotes(prevNotes => {
        const updatedNotes = [...prevNotes];
        updatedNotes.splice(index, 1);
        return updatedNotes;
      });
    }
  };

  return (
    <div>
      <div className="shared-container">
        <span className='font-semibold text-[2em]'>📝 Shared Notes</span>
        
        <input type="text" id="noteTitle" className="form-control" placeholder="Title"/>

        <textarea id="noteContent" className="form-control" placeholder="Content" rows="4"></textarea>
    
        <input type="file" id="imageInput" className="form-control"/>
    

        <button className="btn btn-primary mb-4" onClick={handleSave}>💾 Save Note</button>

        <h4>📜 Note History</h4>
        <div>
          {notes.map((note, index) => (
            <div className="note-card" key={index}>
              <span className='text-[1.5em] font-semibold'>{note.title}</span>
              <p>{note.content}</p>
              {note.image && <img src={note.image} alt="Note" />}
              <div className="note-actions">
                <button className="btn btn-sm btn-outline-primary" onClick={() => editNote(index)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteNote(index)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SharedNotes;
