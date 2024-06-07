import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  // State to hold cookies
  const [cookies, setCookies] = useState<any[]>([]);

  useEffect(() => {
    // Get the current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab && currentTab.url) {
        // Send a message to the background script to get cookies
        chrome.runtime.sendMessage(
          { action: 'getCookies', url: currentTab.url },
          (response) => {
            if (response && response.cookies) {
              setCookies(response.cookies);
            }
          }
        );
      }
    });
  }, []);

  return (
    <div>
      <h1>Cookies</h1>
      <ul>
        {cookies.map((cookie, index) => (
          <li key={index}>{cookie.name}: {cookie.value}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
