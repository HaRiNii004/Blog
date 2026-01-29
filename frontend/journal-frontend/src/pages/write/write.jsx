import "./write.css";
import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

// Add fonts to whitelist
const Font = Quill.import("attributors/style/font");
const fonts = ["Arial", "Courier New", "Georgia", "Times New Roman", "Verdana"];
Font.whitelist = fonts;
Quill.register(Font, true);

const Write = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write something...",
        modules: {
          toolbar: [
            [{ font: fonts }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["image", "video"],
            ["clean"],
          ],
        },
      });

      quillRef.current.on("text-change", () => {
        setContent(quillRef.current.root.innerHTML);
      });
    }
  }, []);

  return (
    <div className="write-container">
      <div className="editor-card">

        {/* Quill Editor */}
        <div ref={editorRef} className="quill-editor" />

        {/* Actions */}
        <div className="actions">
          <button
            className="draft-btn"
            onClick={() => localStorage.setItem("draft", content)}
          >
            Save as Draft
          </button>

          <button
            className="post-btn"
            onClick={() => console.log(content)}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Write;
