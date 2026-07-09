import "./write.css";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Quill from "quill";
import "quill/dist/quill.snow.css";
import Sidebar from "../../components/write/sidebar/sidebar";
import { createPost, uploadImage, getPostById, updatePost, deletePost } from "../../api/posts";
import toast from "react-hot-toast";


const Font = Quill.import("attributors/style/font");
const fonts = ["Roboto", "Open Sans", "Lato", "Montserrat"];
Font.whitelist = fonts;
Quill.register(Font, true);


const Write = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [tagsInput, setTagsInput] = useState(""); // raw text, e.g. "travel, food"
  const [theme, setTheme] = useState("light");
  const [saving, setSaving] = useState(false);
  const [frontImageFile, setFrontImageFile] = useState(null);
  const [frontImagePreview, setFrontImagePreview] = useState(null);

  // Use a ref to store the current theme so the Quill handler 
  // can always access the most up-to-date value without re-initializing
  const themeRef = useRef(theme);
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Fetch post data if in edit mode
  useEffect(() => {
    if (!id) {
      setTitle("");
      setSummary("");
      setCategory("");
      setTagsInput("");
      setFrontImagePreview(null);
      setFrontImageFile(null);
      setContent("");
      if (quillRef.current) {
        quillRef.current.root.innerHTML = "";
      }
      return;
    }

    const loadPostData = async () => {
      try {
        const post = await getPostById(id);
        setTitle(post.title || "");
        setSummary(post.summary || "");
        setCategory(post.category || "");
        setTagsInput(post.tags ? post.tags.join(", ") : "");
        setFrontImagePreview(post.frontImage || null);
        setContent(post.content || "");
      } catch (err) {
        toast.error("Failed to load post data");
        console.error(err);
      }
    };

    loadPostData();
  }, [id]);

  // Set Quill content when it is fetched
  useEffect(() => {
    if (quillRef.current && content && (quillRef.current.root.innerHTML === "<p><br></p>" || quillRef.current.root.innerHTML === "")) {
      quillRef.current.root.innerHTML = content;
    }
  }, [content]);

  // Handles the built-in Quill image button: pick file -> upload -> insert URL
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      try {
        const url = await uploadImage(file);
        const range = quillRef.current.getSelection(true);
        quillRef.current.insertEmbed(range.index, "image", url);
      } catch {
        toast.error("Image upload failed");
      }
    };
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write something...",
        modules: {
          toolbar: {
            container: [
              [{ font: fonts }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["image", "video"],
              ["clean"],
              ["theme"] // Custom button name
            ],
            handlers: {
              theme: toggleTheme,
              image: imageHandler, // <- override default base64 behavior
            },

          },
        },
      });

      quillRef.current.on("text-change", () => {
        setContent(quillRef.current.root.innerHTML);
      });
    }
  }, []);

  const handleFrontImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFrontImageFile(file);
    setFrontImagePreview(URL.createObjectURL(file)); // instant preview, no upload yet
  };

  const handleSubmit = async (isDraft) => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      let frontImageUrl = frontImagePreview || "";
      if (frontImageFile) {
        frontImageUrl = await uploadImage(frontImageFile);
      }

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const postData = {
        title,
        summary,
        category,
        tags,
        content,
        frontImage: frontImageUrl,
        isDraft,
        isPublic: !isDraft,
      };

      if (id) {
        await updatePost(id, postData);
        toast.success(isDraft ? "Draft updated" : "Post updated");
      } else {
        await createPost(postData);
        toast.success(isDraft ? "Draft saved" : "Post published");
      }

      navigate("/");
    } catch (err) {
      toast.error("Something went wrong saving your post");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this journal entry?")) return;
    setSaving(true);
    try {
      await deletePost(id);
      toast.success("Post deleted successfully");
      navigate("/");
    } catch (err) {
      toast.error("Failed to delete post");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Sidebar />
      <div className={`write-container ${theme}`}>
        <div className="editor-card">
          <div className="editor-header">
            <h2>{id ? "Edit Journal Entry" : "Create New Entry"}</h2>
          </div>

          {/* TITLE ROW */}
          <div className="form-row">
            <label className="form-label">TITLE</label>
            <input
              type="text"
              className="form-input"
              placeholder="ENTER THE TITLE HERE"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* SUMMARY ROW */}
          <div className="form-row">
            <label className="form-label">SUMMARY :</label>
            <textarea
              className="form-input"
              placeholder="ENTER YOUR SUMMARY OF THE POST"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          {/* CATEGORY ROW */}
          <div className="form-row">
            <label className="form-label">
              CHOOSE THE CATEGORY FROM THIS DROPDOWN
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="form-row">
            <label className="form-label">
              ADD TAGS
            </label>
            <input
              type="text"
              className="tags-input"
              placeholder="Tags (comma separated)"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          <label className="front-image-picker">
            {frontImagePreview ? (
              <img src={frontImagePreview} alt="front" className="front-image-preview" />
            ) : (
              <span>Click to add a front page image</span>
            )}
            <input type="file" accept="image/*" hidden onChange={handleFrontImageChange} />
          </label>


          {/* EDITOR */}
          <div className="editor-wrapper">
            <div ref={editorRef} className="quill-editor" />
          </div>

          {/* BUTTONS */}
          <div className="actions">
            {id && (
              <button className="delete-btn" disabled={saving} onClick={handleDelete}>
                Delete Entry
              </button>
            )}
            <button className="draft-btn" disabled={saving} onClick={() => handleSubmit(true)}>
              {id ? "Update Draft" : "Save as Draft"}
            </button>
            <button className="post-btn" disabled={saving} onClick={() => handleSubmit(false)}>
              {id ? "Update Post" : "Post"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};


export default Write;