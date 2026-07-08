import "./write.css";
import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import Sidebar from "../../components/write/sidebar/sidebar";
import { createPost, uploadImage } from "../../api/posts";
import toast from "react-hot-toast";


const Font = Quill.import("attributors/style/font");
const fonts = ["Roboto", "Open Sans", "Lato", "Montserrat"];
Font.whitelist = fonts;
Quill.register(Font, true);


const Write = () => {
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
      let frontImageUrl = "";
      if (frontImageFile) {
        frontImageUrl = await uploadImage(frontImageFile);
      }

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await createPost({
        title,
        summary,
        category,
        tags,
        content,
        frontImage: frontImageUrl,
        isDraft,
        isPublic: !isDraft,
      });

      toast.success(isDraft ? "Draft saved" : "Post published");
      // reset or navigate away here, e.g. navigate("/")
    } catch (err) {
      toast.error("Something went wrong saving your post");
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
            <button className="draft-btn" disabled={saving} onClick={() => handleSubmit(true)}>
              Save as Draft
            </button>
            <button className="post-btn" disabled={saving} onClick={() => handleSubmit(false)}>
              Post
            </button>
          </div>

        </div>
      </div>
    </>
  );
};


export default Write;