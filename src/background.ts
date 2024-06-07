chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.action === "getCookies") {
    chrome.cookies.getAll({ url: message.url }, (cookies) => {
        console.log('these are the cookies', cookies);
        
      sendResponse({ cookies });
    });
    return true; // Keeps the message channel open for sendResponse
  }
});
