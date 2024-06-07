import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  // State to hold remaining likes
  const [likes, setLikes] = useState<number | null>(null);

  useEffect(() => {
    // Fetch initial likes from chrome.storage.sync
    chrome.storage.sync.get(['badge'], (result) => {
      if (result.badge !== undefined) {
        setLikes(result.badge);
      }
    });

    // Listen for messages from the content script
    const messageListener = (message: any) => {
      if (message.type === 'LIKES_UPDATE') {
        setLikes(message.likes);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Clean up the listener on component unmount
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  return (
    <div>
      <h1>Remaining Likes</h1>
      <p>{likes !== null ? likes : 'Loading...'}</p>
    </div>
  );
};

export default App;
