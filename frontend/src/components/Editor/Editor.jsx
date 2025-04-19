import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // syntax highlighting

const EditorComp = () => {
  const [raw, setRaw] = useState("");

  const handleInput = (e) => {
    setRaw(e.target.innerText);
  };

  return (
    <div className="min-h-screen">
      <div className="relative w-full border rounded-lg prose dark:prose-invert max-w-none">
        {/* Invisible input layer */}
        <div
          contentEditable
          onInput={handleInput}
          className="absolute top-0 left-0 w-full h-full text-transparent caret-white outline-none whitespace-pre-wrap break-words"
          style={{ zIndex: 2 }}
          spellCheck={false}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none select-none whitespace-pre-wrap break-words"
          style={{ zIndex: 1 }}
        >
          <ReactMarkdown
            children={raw}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorComp;
