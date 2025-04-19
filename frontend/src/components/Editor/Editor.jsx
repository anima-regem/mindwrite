import React, { useState, useEffect, useRef } from "react";
import "./Editor.css";
import { ReadFromFile, WriteToFile } from "../../../wailsjs/go/main/App"; // Import Go functions

const EditorComp = ({ font, fontSize, selectedEntry, onContentChange }) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevSelectedEntryRef = useRef(selectedEntry);
  // Ref to store the latest text content for reliable saving on unmount/cleanup
  const textRef = useRef(text);
  const saveIntervalRef = useRef(null); // Ref to hold the interval ID

  // Update textRef and call onContentChange whenever text state changes
  useEffect(() => {
    textRef.current = text;
    if (onContentChange) {
      onContentChange(text);
    }
  }, [text, onContentChange]);

  const listOfPlaceholders = [
    "start writing here...",
    "what's on your mind?",
    "how are you feeling today?",
    "Select an entry from the sidebar or start typing for today's entry.",
  ];

  // Effect to load content when selectedEntry changes and save previous entry
  useEffect(() => {
    // Capture the state/refs *before* any async operations
    const previousEntry = prevSelectedEntryRef.current;
    const textToSaveForPrevious = textRef.current; // Use ref for latest text

    const loadAndSave = async () => {
      // Clear any existing auto-save interval before potentially saving/loading
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
        console.log("Cleared auto-save interval for previous entry.");
      }

      // Save the content of the *previous* entry before loading the new one
      if (previousEntry && previousEntry !== selectedEntry && textToSaveForPrevious !== null) {
        try {
          console.log(`Saving previous entry before load: ${previousEntry}`);
          await WriteToFile(previousEntry, textToSaveForPrevious);
        } catch (saveErr) {
          console.error(`Error saving file ${previousEntry} before load:`, saveErr);
          setError(`Failed to save changes to ${previousEntry}.`);
          // Decide if loading the new entry should proceed despite save error
        }
      }

      // Now load the new entry
      if (selectedEntry) {
        console.log(`Loading entry: ${selectedEntry}`);
        setIsLoading(true);
        setError(null); // Clear previous errors before loading
        try {
          const content = await ReadFromFile(selectedEntry);
          setText(content); // Update the editor state
        } catch (err) {
          console.error(`Error reading file ${selectedEntry}:`, err);
          setError(`Failed to load entry: ${selectedEntry}.`);
          setText(""); // Clear text on load error
        } finally {
          setIsLoading(false);
        }
      } else {
        // No entry selected (e.g., initial load or after deleting all entries)
        setText("");
        setError(null);
      }

      // Update the ref *after* all operations for this effect cycle are done
      prevSelectedEntryRef.current = selectedEntry;

      // Setup auto-save interval for the *newly* selected entry
      if (selectedEntry) {
        console.log(`Setting up auto-save interval for: ${selectedEntry}`);
        saveIntervalRef.current = setInterval(async () => {
          const currentTextToSave = textRef.current; // Get latest text from ref
          if (selectedEntry && currentTextToSave !== null) { // Double check selectedEntry hasn't become null
            try {
              console.log(`Auto-saving entry: ${selectedEntry}`);
              await WriteToFile(selectedEntry, currentTextToSave);
            } catch (err) {
              console.error(`Error auto-saving file ${selectedEntry}:`, err);
              // Optionally set an error state specific to auto-save
            }
          }
        }, 5000); // Save every 5 seconds
      }
    };

    loadAndSave();

    // Cleanup function for the effect
    return () => {
      // Clear the interval when the component unmounts or selectedEntry changes
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        console.log("Cleared auto-save interval on cleanup.");
      }

      // Save the *current* entry's latest content on unmount or before next effect run
      // This acts as a final save when switching entries or closing the app
      const entryToSaveOnCleanup = prevSelectedEntryRef.current;
      const latestText = textRef.current;

      if (entryToSaveOnCleanup && latestText !== null) {
        // Use async immediately invoked function expression (IIFE) for cleanup save
        (async () => {
          try {
            console.log(`Final save on cleanup: ${entryToSaveOnCleanup}`);
            await WriteToFile(entryToSaveOnCleanup, latestText);
          } catch (err) {
            console.error(`Error final saving file ${entryToSaveOnCleanup} on cleanup:`, err);
          }
        })();
      }
    };
    // Re-run this effect ONLY if selectedEntry changes
  }, [selectedEntry]);


  const handleTextChange = (e) => {
    setText(e.target.value);
    // textRef and onContentChange are handled by the effect listening to `text`
  };

  return (
    <section className="editor-container flex flex-col items-center justify-center w-full h-full bg-[#f0f0f0]">
      {isLoading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <textarea
        value={text}
        onChange={handleTextChange}
        className="editor w-full h-full flex-grow text-base leading-relaxed outline-none resize-none border-none"
        style={{
          fontFamily: font,
          fontSize: `${fontSize}px`,
          background: "#f0f0f0",
          color: "black",
        }}
        spellCheck={false}
        autoFocus
        placeholder={
          isLoading ? "Loading..." :
          error ? "Error loading content." :
          listOfPlaceholders[
            Math.floor(Math.random() * listOfPlaceholders.length)
          ]
        }
        disabled={isLoading} // Disable textarea while loading
      />
    </section>
  );
};

export default EditorComp;
