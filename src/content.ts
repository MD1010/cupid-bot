console.log("Content script loaded");

// Function to inject a button into the page
const injectButton = () => {
  const button = document.createElement("button");
  button.textContent = "Click Me";
  button.style.position = "fixed";
  button.style.bottom = "10px";
  button.style.right = "10px";
  button.style.zIndex = "1000";
  button.onclick = () => alert("Button clicked!");
  document.body.appendChild(button);
};

// Run the injectButton function
injectButton();
