const form = document.getElementById("uploadForm");
const output = document.getElementById("output");
const rolesCheckbox = document.querySelector('input[name="rolesMain"]');
const subRoleCheckboxes = document.querySelectorAll('.role-types input[type="checkbox"]');
const permissionsCheckbox = document.querySelector('input[name="permissionsMain"]');
const subPermissionCheckboxes = document.querySelectorAll('.permission-types input[type="checkbox"]');

// Tab switching
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabName = button.getAttribute('data-tab');
    
    // Remove active class from all buttons and hide all tab contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.style.display = 'none');
    
    // Add active class to clicked button and show corresponding tab content
    button.classList.add('active');
    document.getElementById(tabName + '-tab').style.display = 'block';
  });
});

// Auto-select main checkbox when any sub-checkbox is selected
function autoSelectMainCheckbox(mainCheckbox, subCheckboxes) {
  subCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      const anySubCheckboxSelected = Array.from(subCheckboxes).some(cb => cb.checked);
      mainCheckbox.checked = anySubCheckboxSelected;
    });
  });
}

// When main checkbox is toggled, check/uncheck all sub-checkboxes
function toggleSubCheckboxes(mainCheckbox, subCheckboxes) {
  mainCheckbox.addEventListener("change", () => {
    subCheckboxes.forEach(checkbox => {
      checkbox.checked = mainCheckbox.checked;
    });
  });
}

autoSelectMainCheckbox(rolesCheckbox, subRoleCheckboxes);
autoSelectMainCheckbox(permissionsCheckbox, subPermissionCheckboxes);
toggleSubCheckboxes(rolesCheckbox, subRoleCheckboxes);
toggleSubCheckboxes(permissionsCheckbox, subPermissionCheckboxes);

function formatResults(result, tableName) {
  let resultHtml = `<h2>Results for ${tableName}</h2>`;
  
  if (result.length === 0) {
    resultHtml += `<p>No objects were processed.</p>`;
  } else {
    resultHtml += `<ul class="results-list">`;
    for (const item of result) {
      const icon = item.status === "success" ? "✅" : "❌";
      const details = item.error ? ` - ${item.error}` : "";
      resultHtml += `<li class="results-item">${icon} ${item.type}: ${item.name}${details}</li>`;
    }
    resultHtml += `</ul>`;
  }
  
  return resultHtml;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  output.innerHTML = "Processing...";

  const response = await fetch("/upload", {
    method: "POST",
    body: formData
  });

  const result = await response.json();
  const filename = formData.get("csvfile").name;
  const tableName = filename.replace(/\.csv$/, "");
  
  output.innerHTML = formatResults(result, tableName);
});
