function getTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}
function timeRenderer() {
  const timeContainer = document.getElementById("timeContainer");
  timeContainer.innerHTML = "";
  const timeElement = document.createElement("h1");
  timeElement.innerHTML = getTime();
  timeContainer.appendChild(timeElement);
}
setInterval(timeRenderer, 1000);
