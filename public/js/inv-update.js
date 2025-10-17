// public/js/inv-update.js
const form = document.querySelector("#updateInventoryForm");
form.addEventListener("change", function () {
  const updateBtn = document.querySelector("button");
  updateBtn.removeAttribute("disabled");
});