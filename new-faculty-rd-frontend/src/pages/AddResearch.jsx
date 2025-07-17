import React, { useState, useEffect } from "react";
import "../styles/AddResearch.css";
export default function AddResearch() {
  const [mainType, setMainType] = useState("");
  const [subType, setSubType] = useState("");
  const [score, setScore] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [impactFactor, setImpactFactor] = useState("");
  const [journalQuality, setJournalQuality] = useState("");
  const [isbn, setIsbn] = useState("");
  const facultyId = localStorage.getItem("facultyId");
  useEffect(() => {
    // Reset relevant fields when mainType changes
    if (mainType === "Journal Publication") {
      setImpactFactor("");
      setJournalQuality("");
      setIsbn("");
    } else if (mainType === "Conference") {
      setImpactFactor("");
      setJournalQuality("");
      setIsbn("");
    } else {
      setImpactFactor("");
      setJournalQuality("");
      setIsbn("");
    }
    setSubType(""); // Reset subType when mainType changes
  }, [mainType]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title required");
    if (!mainType || !subType) return alert("Select research type and sub-type");
    if (!score || isNaN(score) || Number(score) <= 0) return alert("Valid positive score required");
    if (!date) return alert("Select date");
    if (!file) return alert("Upload file");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", `${mainType} - ${subType}`);
    formData.append("score", score);
    formData.append("date", date);
    formData.append("file", file);
    formData.append("facultyId", facultyId);
    if (mainType === "Journal Publication") {
      formData.append("impactFactor", impactFactor);
      formData.append("journalQuality", journalQuality);
    } else if (
      mainType === "Conference" &&
      (subType === "Conference Presentation - National" ||
        subType === "Conference Presentation - Inter-national")
    ) {
      formData.append("isbn", isbn);
    }
    try {
      const res = await fetch("http://localhost:5000/api/research/add", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("Research added!");
        setTitle("");
        setMainType("");
        setSubType("");
        setScore("");
        setDate("");
        setFile(null);
        document.getElementById("fileInput").value = null;
        setImpactFactor("");
        setJournalQuality("");
        setIsbn("");
      } else {
        alert("Failed to add research");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };
  const subTypeOptions = {
    Patent: [
      "Patent Published (Request for Examination)",
      "Patent Granted",
      "Patent Filed",
      "Industrial Design Granted",
    ],
    "Journal Publication": [
      "Journal Paper - WoS/SCIE Indexed",
      "Journal Paper - Scopus Indexed",
    ],
    "Book/Book Chapter": [
      "Book/Book Chapter - Scopus/ISBN Indexed",
    ],
    CopyRight: [
      "CopyRight - Filed",
      "CopyRight - Granted",
    ],
    Conference: [
      "Conference Presentation - Scopus Indexed",
      "Conference Presentation - National",
      "Conference Presentation - Inter-national",
    ],
    Citation: [
      "Scopus Citation",
    ],
    Awards: [
      "Awards",
    ],
  };
  return (
    <div className="add-research-container">
      <h2>Add Research</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Main Category Dropdown */}
        <select
          value={mainType}
          onChange={(e) => {
            setMainType(e.target.value);
          }}
        >
          <option value="">--Select Main Type--</option>
          {Object.keys(subTypeOptions).map((main) => (
            <option key={main} value={main}>
              {main}
            </option>
          ))}
        </select>
        {/* Sub-Category Dropdown */}
        {mainType && (
          <select value={subType} onChange={(e) => setSubType(e.target.value)}>
            <option value="">--Select Sub Type--</option>
            {subTypeOptions[mainType]?.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        )}
        {/* Impact Factor Field (Conditional Rendering for Journal Publication) */}
        {mainType === "Journal Publication" && (
          <input
            type="text"
            placeholder="Impact Factor (if applicable)"
            value={impactFactor}
            onChange={(e) => setImpactFactor(e.target.value)}
          />
        )}
        {/* Journal Quality Radio Buttons (Conditional Rendering for Journal Publication) */}
        {mainType === "Journal Publication" && (
          <div className="radio-group">
            <label>Journal Quality:</label>
            <div>
              <input
                type="radio"
                id="q1"
                value="Q1"
                checked={journalQuality === "Q1"}
                onChange={(e) => setJournalQuality(e.target.value)}
              />
              <label htmlFor="q1">Q1</label>
            </div>
            <div>
              <input
                type="radio"
                id="q2"
                value="Q2"
                checked={journalQuality === "Q2"}
                onChange={(e) => setJournalQuality(e.target.value)}
              />
              <label htmlFor="q2">Q2</label>
            </div>
            <div>
              <input
                type="radio"
                id="q3"
                value="Q3"
                checked={journalQuality === "Q3"}
                onChange={(e) => setJournalQuality(e.target.value)}
              />
              <label htmlFor="q3">Q3</label>
            </div>
            <div>
              <input
                type="radio"
                id="q4"
                value="Q4"
                checked={journalQuality === "Q4"}
                onChange={(e) => setJournalQuality(e.target.value)}
              />
              <label htmlFor="q4">Q4</label>
            </div>
            <div>
              <input
                type="radio"
                id="none"
                value="None"
                checked={journalQuality === "None"}
                onChange={(e) => setJournalQuality(e.target.value)}
              />
              <label htmlFor="none">None</label>
            </div>
          </div>
        )}
        {/* ISBN Number Field (Conditional Rendering for specific Conference sub-types) */}
        {mainType === "Conference" &&
          (subType === "Conference Presentation - National" ||
            subType === "Conference Presentation - Inter-national") && (
            <input
              type="text"
              placeholder="ISBN Number "
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
          )}
        <input
          type="number"
          placeholder="Score"
          min="1"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          id="fileInput"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}