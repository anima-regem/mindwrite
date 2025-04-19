package main

import (
	"context" // Import encoding/json for metadata
	"fmt"     // Import path/filepath for joining paths
	"os"
	"path/filepath" // Import path/filepath
	"time"          // Import time for date handling
	// Re-import uuid
)

// App struct
type App struct {
	ctx           context.Context
	mindwritePath string // Add field to store mindwrite directory path
}

// Metadata struct to hold file metadata
type Metadata struct {
	OriginalFilename string    `json:"originalFilename"`
	Timestamp        time.Time `json:"timestamp"`
	UUID             string    `json:"uuid"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// Get user's home directory
	homeDir, err := os.UserHomeDir()
	if err != nil {
		// Handle error appropriately, maybe log it or return an error
		// For now, we'll just print it and potentially fallback or exit
		fmt.Fprintf(os.Stderr, "Error getting home directory: %v\n", err)
		// Decide on fallback behavior if needed
		a.mindwritePath = "./mindwrite" // Fallback to current directory
	} else {
		a.mindwritePath = filepath.Join(homeDir, "mindwrite")
	}

	// Create the mindwrite directory if it doesn't exist
	err = os.MkdirAll(a.mindwritePath, 0755) // Use 0755 permissions
	if err != nil {
		// Handle error appropriately
		fmt.Fprintf(os.Stderr, "Error creating mindwrite directory: %v\n", err)
		// Application might not function correctly if directory creation fails
		// Consider returning an error or exiting if the directory is crucial
		return // Exit startup if directory creation fails
	}
	fmt.Printf("Using mindwrite directory: %s\n", a.mindwritePath)

	// Check for and create today's entry if it doesn't exist
	today := time.Now().Format("2006-01-02") // YYYY-MM-DD format
	todaysFilename := today + ".md"
	fullPathToTodaysFile := filepath.Join(a.mindwritePath, todaysFilename)

	// Check if the file already exists
	if _, err := os.Stat(fullPathToTodaysFile); os.IsNotExist(err) {
		fmt.Printf("Creating today's entry: %s\n", todaysFilename)
		// File does not exist, create it with empty content
		_, writeErr := a.WriteToFile(todaysFilename, "")
		if writeErr != nil {
			fmt.Fprintf(os.Stderr, "Error creating today's entry file %s: %v\n", todaysFilename, writeErr)
			// Handle error, maybe log it. The app can likely continue without this specific file initially.
		}
	} else if err != nil {
		// Another error occurred during stat check
		fmt.Fprintf(os.Stderr, "Error checking for today's entry file %s: %v\n", todaysFilename, err)
	} else {
		fmt.Printf("Today's entry already exists: %s\n", todaysFilename)
	}
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// WriteToFile writes content to a file inside the mindwrite directory
func (a *App) WriteToFile(fileName, content string) (string, error) {
	// Construct the full path within the mindwrite directory
	fullPath := filepath.Join(a.mindwritePath, fileName)
	fmt.Printf("Writing to file: %s\n", fullPath) // Log the full path being written to

	err := os.WriteFile(fullPath, []byte(content), 0644)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file %s: %v\n", fullPath, err)
		return "", err
	}
	return fullPath, nil // Return the full path
}

// ReadFromFile reads content from a file inside the mindwrite directory
func (a *App) ReadFromFile(fileName string) (string, error) {
	// Construct the full path within the mindwrite directory
	fullPath := filepath.Join(a.mindwritePath, fileName)
	fmt.Printf("Reading from file: %s\n", fullPath) // Log the full path being read from

	content, err := os.ReadFile(fullPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading file %s: %v\n", fullPath, err)
		return "", err
	}
	return string(content), nil
}

// ListEntries lists all files in the mindwrite directory
func (a *App) ListEntries() ([]string, error) {
	files, err := os.ReadDir(a.mindwritePath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading mindwrite directory: %v\n", err)
		return nil, err
	}

	var entryNames []string
	for _, file := range files {
		if !file.IsDir() { // Only include files, not directories
			entryNames = append(entryNames, file.Name())
		}
	}
	fmt.Printf("Found entries: %v\n", entryNames)
	return entryNames, nil
}
