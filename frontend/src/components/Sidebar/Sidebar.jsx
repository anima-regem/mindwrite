import React, { useState, useEffect } from 'react';
import ActivityCalendar from 'react-activity-calendar'; // Import the calendar component
import './Sidebar.css';
import { ListEntries, ReadFromFile } from '../../../wailsjs/go/main/App'; // Import Go functions

// Function to generate calendar data based on character count per day
const generateCalendarData = async (entries) => {
  const dailyCharCounts = {};

  // Use Promise.all to fetch content for all entries concurrently
  await Promise.all(entries.map(async (entry) => {
    const dateMatch = entry.match(/^(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      const date = dateMatch[1];
      try {
        const content = await ReadFromFile(entry);
        const charCount = content ? content.length : 0;
        dailyCharCounts[date] = (dailyCharCounts[date] || 0) + charCount;
      } catch (err) {
        console.error(`Error reading file ${entry}:`, err);
        // Decide how to handle read errors, e.g., count as 0 or skip
      }
    } else {
      console.warn(`Entry filename "${entry}" does not start with YYYY-MM-DD format.`);
    }
  }));

  // Convert daily character counts to the format required by ActivityCalendar
  return Object.entries(dailyCharCounts).map(([date, count]) => {
    let level = 0;
    // Define levels based on character count thresholds (adjust as needed)
    if (count > 0 && count <= 100) {
      level = 1;
    } else if (count > 100 && count <= 500) {
      level = 2;
    } else if (count > 500 && count <= 1000) {
      level = 3;
    } else if (count > 1000) {
      level = 4;
    }

    return {
      date: date,
      count: count, // Store the actual character count
      level: level,
    };
  });
};

function Sidebar({ onEntrySelect }) { // Add onEntrySelect prop
  const [entries, setEntries] = useState([]);
  const [calendarData, setCalendarData] = useState([]); // State for calendar data
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntriesAndGenerateData = async () => {
      try {
        const entryList = await ListEntries();
        const validEntries = entryList || []; // Ensure entryList is an array
        // Sort entries in descending order (newest first based on filename)
        validEntries.sort((a, b) => b.localeCompare(a));
        setEntries(validEntries);

        // Generate and set calendar data based on character counts
        const processedData = await generateCalendarData(validEntries); // Now async
        setCalendarData(processedData);
        setError(null); // Clear any previous error
      } catch (err) {
        console.error("Error fetching entries or generating calendar data:", err);
        setError("Failed to load entries or activity data.");
        setEntries([]); // Clear entries on error
        setCalendarData([]); // Clear calendar data on error
      }
    };

    fetchEntriesAndGenerateData();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleEntryClick = async (entryName) => {
    console.log(`Entry clicked: ${entryName}`);
    if (onEntrySelect) {
      onEntrySelect(entryName); // Pass the selected entry name to the parent
    }
    // Optional: Directly load content here if needed, or handle in parent
    // try {
    //   const content = await ReadFromFile(entryName);
    //   console.log(`Content for ${entryName}:`, content);
    //   // Update state or pass content up as needed
    // } catch (err) {
    //   console.error(`Error reading file ${entryName}:`, err);
    // }
  };

  return (
    <div className="sidebar flex flex-col h-full"> {/* Ensure sidebar takes full height */}
      {/* Existing list rendering */}
      <div className="flex-grow overflow-y-auto"> {/* Make list scrollable */}
        {error && <p className="error-message">{error}</p>}
        {entries.length === 0 && !error && <p className="p-2">No entries yet.</p>}
        <ul>
          {entries.map((entry, index) => (
            <li
              key={index}
              onClick={() => handleEntryClick(entry)}
              className='entry-item p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer'
            >
              <span className='entry-name'>
                {
                  // entry with extension removed
                  entry.split('.').slice(0, -1).join('.')
                }
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Contribution Chart */}
      <div className="contribution-chart p-2 border-t border-gray-200 mt-auto"> {/* Added padding and border */}
        {calendarData.length > 0 ? ( // Conditionally render the calendar
          <ActivityCalendar
            data={calendarData} // Use processed data from state
            blockSize={8} // Adjust size as needed
            blockMargin={3}
            fontSize={8}
            theme={{ // Optional: customize theme colors
              light: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'], // Example GitHub-like light theme
              dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'], // Example GitHub-like dark theme
            }}
            // showWeekdayLabels
          />
        ) : (
          <p className="text-xs text-gray-500">No activity data to display.</p> // Show a message if data is empty
        )}
      </div>
    </div> // Add missing closing div tag
  );
}

export default Sidebar;
