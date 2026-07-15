import React, { useState, useEffect } from "react";
import "./ReadingManage.css";
import Sidebar from "../../../components/write/sidebar/sidebar";
import { getReadingItems, createOrUpdateReadingItem, deleteReadingItem, uploadImage } from "../../../api/posts";
import toast from "react-hot-toast";
import { BookOpen, Upload, Trash2, CheckCircle } from "lucide-react";

const ReadingManage = () => {
  const [readingItems, setReadingItems] = useState([]);
  const [currentRead, setCurrentRead] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms state
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentAuthor, setCurrentAuthor] = useState("");
  const [currentImageFile, setCurrentImageFile] = useState(null);
  const [currentImagePreview, setCurrentImagePreview] = useState(null);
  const [currentSaving, setCurrentSaving] = useState(false);

  const [recTitle, setRecTitle] = useState("");
  const [recAuthor, setRecAuthor] = useState("");
  const [recQuote, setRecQuote] = useState("");
  const [recImageFile, setRecImageFile] = useState(null);
  const [recImagePreview, setRecImagePreview] = useState(null);
  const [recSaving, setRecSaving] = useState(false);

  useEffect(() => {
    loadReadingShelf();
  }, []);

  const loadReadingShelf = async () => {
    setLoading(true);
    try {
      const data = await getReadingItems();
      setReadingItems(data);
      const current = data.find(item => item.type === "current");
      const recs = data.filter(item => item.type === "recommendation");

      setCurrentRead(current || null);
      setRecommendations(recs);

      // Populate current read form if there is one
      if (current) {
        setCurrentTitle(current.title);
        setCurrentAuthor(current.author || "");
        setCurrentImagePreview(current.coverUrl);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reading shelf items");
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentImageFile(file);
      setCurrentImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRecCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRecImageFile(file);
      setRecImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCurrentSubmit = async (e) => {
    e.preventDefault();
    if (!currentTitle.trim()) {
      toast.error("Book title is required");
      return;
    }
    if (!currentImagePreview) {
      toast.error("Book cover image is required");
      return;
    }

    setCurrentSaving(true);
    try {
      let coverUrl = currentImagePreview;
      if (currentImageFile) {
        coverUrl = await uploadImage(currentImageFile);
      }

      await createOrUpdateReadingItem({
        title: currentTitle,
        author: currentAuthor,
        coverUrl,
        type: "current"
      });

      toast.success("Current read updated successfully!");
      setCurrentTitle("");
      setCurrentAuthor("");
      setCurrentImageFile(null);
      setCurrentImagePreview(null);

      loadReadingShelf();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update current read");
    } finally {
      setCurrentSaving(false);
    }
  };

  const handleRecSubmit = async (e) => {
    e.preventDefault();
    if (!recTitle.trim()) {
      toast.error("Book title is required");
      return;
    }
    if (!recImageFile) {
      toast.error("Book cover image is required");
      return;
    }

    setRecSaving(true);
    try {
      const coverUrl = await uploadImage(recImageFile);

      await createOrUpdateReadingItem({
        title: recTitle,
        author: recAuthor,
        coverUrl,
        type: "recommendation",
        quote: recQuote
      });

      toast.success("Recommendation added successfully!");
      setRecTitle("");
      setRecAuthor("");
      setRecQuote("");
      setRecImageFile(null);
      setRecImagePreview(null);
      loadReadingShelf();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add recommendation");
    } finally {
      setRecSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recommendation?")) return;
    try {
      await deleteReadingItem(id);
      toast.success("Recommendation deleted");
      loadReadingShelf();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete recommendation");
    }
  };

  return (
    <>
      <Sidebar />
      <div className="reading-manage-container">
        <div className="manage-content-box">
          <div className="manage-header">
            <h1 className="page-title">
              <BookOpen className="header-icon" /> Reading Shelf Management
            </h1>
            <p className="page-subtitle">
              Manage your current read and the slideshow of book recommendations displayed on the reading page.
            </p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading reading shelf...</p>
            </div>
          ) : (
            <div className="manage-layout">
              {/* CURRENT READ FORM */}
              <div className="manage-card">
                <h2>Currently Reading</h2>
                <form onSubmit={handleCurrentSubmit} className="manage-form">
                  <div className="form-row-item">
                    <label className="form-lbl">Book Title</label>
                    <input
                      type="text"
                      className="form-in"
                      placeholder="Title of the book"
                      value={currentTitle}
                      onChange={(e) => setCurrentTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-row-item">
                    <label className="form-lbl">Author</label>
                    <input
                      type="text"
                      className="form-in"
                      placeholder="Author name"
                      value={currentAuthor}
                      onChange={(e) => setCurrentAuthor(e.target.value)}
                    />
                  </div>

                  <div className="cover-upload-area">
                    <label className="cover-picker">
                      {currentImagePreview ? (
                        <img src={currentImagePreview} alt="Current cover" className="cover-preview" />
                      ) : (
                        <div className="picker-placeholder">
                          <Upload size={24} />
                          <span>Click to upload book cover</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" hidden onChange={handleCurrentCoverChange} />
                    </label>
                  </div>

                  <button type="submit" className="save-btn" disabled={currentSaving}>
                    {currentSaving ? "Saving..." : "Update Current Read"}
                  </button>
                </form>
              </div>

              {/* ADD RECOMMENDATION FORM */}
              <div className="manage-card">
                <h2>Add Book Recommendation</h2>
                <form onSubmit={handleRecSubmit} className="manage-form">
                  <div className="form-row-item">
                    <label className="form-lbl">Book Title</label>
                    <input
                      type="text"
                      className="form-in"
                      placeholder="Title of the book"
                      value={recTitle}
                      onChange={(e) => setRecTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-row-item">
                    <label className="form-lbl">Author</label>
                    <input
                      type="text"
                      className="form-in"
                      placeholder="Author name"
                      value={recAuthor}
                      onChange={(e) => setRecAuthor(e.target.value)}
                    />
                  </div>

                  <div className="form-row-item">
                    <label className="form-lbl">Favourite Quote</label>
                    <textarea
                      className="form-in"
                      placeholder="Enter your favorite quote from this book..."
                      value={recQuote}
                      onChange={(e) => setRecQuote(e.target.value)}
                      rows={3}
                      style={{ resize: "vertical", fontFamily: "inherit" }}
                    />
                  </div>

                  <div className="cover-upload-area">
                    <label className="cover-picker">
                      {recImagePreview ? (
                        <img src={recImagePreview} alt="Rec cover" className="cover-preview" />
                      ) : (
                        <div className="picker-placeholder">
                          <Upload size={24} />
                          <span>Click to upload book cover</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" hidden onChange={handleRecCoverChange} />
                    </label>
                  </div>

                  <button type="submit" className="save-btn rec-btn" disabled={recSaving}>
                    {recSaving ? "Adding..." : "Add to Recommendations"}
                  </button>
                </form>
              </div>

              {/* LIST OF RECOMMENDATIONS */}
              <div className="manage-card full-width">
                <h2>Current Recommendations Slideshow ({recommendations.length})</h2>
                {recommendations.length === 0 ? (
                  <p className="no-items-msg">No book recommendations uploaded yet.</p>
                ) : (
                  <div className="recommendations-list-grid">
                    {recommendations.map((rec) => (
                      <div className="rec-item-card" key={rec._id}>
                        <img src={rec.coverUrl} alt={rec.title} className="rec-item-cover" />
                        <div className="rec-item-details">
                          <h3>{rec.title}</h3>
                          <p>by {rec.author || "Unknown"}</p>
                          {rec.quote && (
                            <p className="rec-item-quote">
                              "{rec.quote}"
                            </p>
                          )}
                          <button
                            className="delete-item-btn"
                            onClick={() => handleDelete(rec._id)}
                            title="Delete Recommendation"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReadingManage;
