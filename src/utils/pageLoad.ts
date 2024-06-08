export const checkInitialLoaded = () => {
  if (
    window.location.href.includes("doubletake") ||
    window.location.href.includes("home") ||
    window.location.href.includes("discover")
  ) {
    return true;
  }
  return false;
};
