import "./write.css";
import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import Sidebar from "../../components/write/sidebar/sidebar";

const Font = Quill.import("attributors/style/font");
const fonts = ["Roboto", "Open Sans", "Lato", "Montserrat"];
Font.whitelist = fonts;
Quill.register(Font, true);


const Write = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [theme, setTheme] = useState("light");

  // Use a ref to store the current theme so the Quill handler 
  // can always access the most up-to-date value without re-initializing
  const themeRef = useRef(theme);
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  const toggleTheme = () => {
    // Functional update ensures we always have the latest state
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
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
              // We call toggleTheme directly; React will handle the state update
              theme: toggleTheme,
            },
          },
        },
      });

      quillRef.current.on("text-change", () => {
        setContent(quillRef.current.root.innerHTML);
      });
    }
  }, []);

  // Handle visual updates (DOM classes and Icon changes)
  useEffect(() => {
    const container = document.querySelector(".write-container");
    const toolbar = quillRef.current?.getModule("toolbar");
    const themeButton = toolbar?.container.querySelector(".ql-theme");

    if (theme === "dark") {
      container?.classList.add("dark");
      if (themeButton) themeButton.innerHTML = "🌙";
    } else {
      container?.classList.remove("dark");
      if (themeButton) themeButton.innerHTML = "☀️";
    }
  }, [theme]);

  return (
    <>
      <Sidebar />
      <div className={`write-container ${theme}`}>
        <div className="editor-card">
          <input
            type="text"
            className="category-input"
            placeholder="Enter category..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <div ref={editorRef} className="quill-editor" />

          <div className="actions">
            <button className="draft-btn" onClick={() => localStorage.setItem("draft", content)}>
              Save as Draft
            </button>
            <button className="post-btn" onClick={() => console.log({ content, category })}>
              Post
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Write;