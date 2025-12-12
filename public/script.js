const form = document.getElementById("uploadForm");
const output = document.getElementById("output");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("button clicked");

  const formData = new FormData(form);
  output.innerHTML = "Processing...";

  const response = await fetch("/upload", {
    method: "POST",
    body: formData
  });

  const text = await response.text();
  output.innerHTML = text;
});
