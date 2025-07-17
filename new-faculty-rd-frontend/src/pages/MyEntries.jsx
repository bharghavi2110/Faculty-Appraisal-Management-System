import React, { useEffect, useState } from "react";
import "../styles/MyEntries.css";
export default function MyEntries() {
  const [entries, setEntries] = useState([]);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [editedFile, setEditedFile] = useState(null);
  const facultyId = localStorage.getItem("facultyId");
  useEffect(() => {
    if (!facultyId) return;
    fetch(`http://localhost:5000/api/research/faculty/${facultyId}`)
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch((err) => console.error(err));
  }, [facultyId]);
  const handleEditClick = (entry) => {
    setEditingEntryId(entry._id);
    setEditedData({
      title: entry.title,
      type: entry.type,
      score: entry.score,
      date: new Date(entry.date).toISOString().split("T")[0],
      impactFactor: entry.impactFactor || "",
      journalQuality: entry.journalQuality || "",
      isbn: entry.isbn || "",
    });
    setEditedFile(null);
  };
  const handleSaveClick = async (id) => {
    try {
      const formData = new FormData();
      formData.append("title", editedData.title);
      formData.append("type", editedData.type);
      formData.append("score", editedData.score);
      formData.append("date", editedData.date);
      formData.append("impactFactor", editedData.impactFactor);
      formData.append("journalQuality", editedData.journalQuality);
      formData.append("isbn", editedData.isbn);
      if (editedFile) {
        formData.append("file", editedFile);
      }
      const res = await fetch(`http://localhost:5000/api/research/update/${id}`, {
        method: "PUT",
        body: formData,
      });
      if (res.ok) {
        alert("Entry updated successfully!");
        window.location.reload();
      } else {
        alert("Failed to update entry");
      }
    } catch (error) {
      console.error(error);
      alert("Server error while updating");
    }
  };
  const handleCancelClick = () => {
    setEditingEntryId(null);
    setEditedData({});
    setEditedFile(null);
  };
  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(`http://localhost:5000/api/research/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Entry deleted successfully!");
        setEntries(entries.filter((entry) => entry._id !== id));
      } else {
        alert("Failed to delete entry");
      }
    } catch (error) {
      console.error(error);
      alert("Server error while deleting");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e) => {
    setEditedFile(e.target.files[0]);
  };
  return (
    <div className="my-entries-container">
      <h2>My Research Entries</h2>
      {entries.length === 0 ? (
        <p className="no-entries">No research entries found.</p>
      ) : (
        <table className="entries-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Score</th>
              <th>Date</th>
              <th>Impact Factor</th>
              <th>Journal Quality</th>
              <th>ISBN</th>
              <th>File</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id}>
                <td>
                  {editingEntryId === entry._id ? (
                    <input
                      type="text"
                      name="title"
                      value={editedData.title}
                      onChange={handleChange}
                    />
                  ) : (
                    entry.title
                  )}
                </td>
                <td>
                  {editingEntryId === entry._id ? (
                    <input
                      type="text"
                      name="type"
                      value={editedData.type}
                      onChange={handleChange}
                    />
                  ) : (
                    entry.type
                  )}
                </td>
                <td>
                  {editingEntryId === entry._id ? (
                    <input
                      type="number"
                      name="score"
                      value={editedData.score}
                      onChange={handleChange}
                    />
                  ) : (
                    entry.score
                  )}
                </td>
                <td>
                  {editingEntryId === entry._id ? (
                    <input
                      type="date"
                      name="date"
                      value={editedData.date}
                      onChange={handleChange}
                    />
                  ) : (
                    new Date(entry.date).toLocaleDateString()
                  )}
                </td>
                <td>
                  {editingEntryId === entry._id ? (
                    <input
                      type="text"
                      name="impactFactor"
                      value={editedData.impactFactor}
                      onChange={handleChange}
                    />
                  ) : (
                    entry.impactFactor || "-"
                  )}
                </td>
                <td>
                  {editingEntryId === entry._id ? (
                    <input
                      type="text"
                      name="journalQuality"
                      value={editedData.journalQuality}
                      onChange={handleChange}
                    />
                  ) : (
                    entry.journalQuality || "-"
                  )}
                </td>
                <td>
                  {editingEntryId === entry._id ? (
                    <input
                      type="text"
                      name="isbn"
                      value={editedData.isbn}
                      onChange={handleChange}
                    />
                  ) : (
                    entry.isbn || "-"
                  )}
                </td>
                <td>
                  {editingEntryId === entry._id ? (
                    <>
                      <input
                        type="file"
                        name="file"
                        accept="application/pdf, image/*"
                        onChange={handleFileChange}
                      />
                      {entry.fileUrl && (
                        <a
                          href={`http://localhost:5000${entry.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="view-file-link"
                        >
                          (Current File)
                        </a>
                      )}
                    </>
                  ) : (
                    <div className="view-file-cell">
                      <a
                        href={`http://localhost:5000${entry.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="view-file-link"
                      >View File
                      </a>
                    </div>
                  )}
                </td>
                <td>
                  {editingEntryId === entry._id ? (
                    <>
                      <button onClick={() => handleSaveClick(entry._id)} className="save-btn">
                        Save
                      </button>
                      <button onClick={handleCancelClick} className="cancel-btn">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <div className="actions-buttons">
                      <button onClick={() => handleEditClick(entry)} className="edit-btn">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteClick(entry._id)} className="delete-btn">
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}