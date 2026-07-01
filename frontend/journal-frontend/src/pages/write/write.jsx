import "./write.css";
import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import Sidebar from "../../components/write/sidebar/sidebar";
import { createPost } from "../../api/postposts";


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

  // Use a ref to store the current theme so the Quill handler 
  // can always access the most up-to-date value without re-initializing
 

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
           
          },
        },
      });

      quillRef.current.on("text-change", () => {
        setContent(quillRef.current.root.innerHTML);
      });
    }
  }, []);

  const handlePost = async () => {
    try {
      const postData = {
        title,
        summary,
        category,
        content,
        isDraft: false,
        isPublic: true,
      };

      await createPost(postData);
      alert("Post Published Successfully!");
    } catch (err) {
      alert("Error publishing post");
    }
  };

  const handleDraft = async () => {
    try {
      const postData = {
        title,
        summary,
        category,
        content,
        isDraft: true,   // ✅ Draft
        isPublic: false, // ✅ Not public
      };

      await createPost(postData);
      alert("Draft Saved Successfully!");
    } catch (err) {
      alert("Error saving draft");
    }
  };



 return (
  <>
    <Sidebar />
    <div className="write-container">
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

        {/* EDITOR */}
        <div className="editor-wrapper">
          <div ref={editorRef} className="quill-editor" />
        </div>

        {/* BUTTONS */}
        <div className="actions">
          <button className="post-btn" onClick={handlePost}>
            SAVE AS A POST
          </button>

          <button className="draft-btn" onClick={handleDraft}>
            SAVE AS A DRAFT
          </button>
        </div>

      </div>
    </div>
  </>
);
};


export default Write;