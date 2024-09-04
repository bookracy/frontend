export const saveAs = (url?: string, openInNewTab = false) => {
  if (!url) return;
  const link = document.createElement("a");
  link.href = url;
  if (openInNewTab) {
    link.target = "_blank";
  } else {
    link.download = "";
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
