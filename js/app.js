/* X12 Books - reservation list, estimator, validation, Local Storage */
(function () {
  "use strict";

  var KEY = "x12books_list_v1";
  var GIFT_FEE = 30;

  // ---------- Local Storage helpers (wrapped: storage can be blocked) ----------
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }
  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
  }

  var list = load();

  var navCount = document.getElementById("navCount");
  var listEl = document.getElementById("reserveList");
  var emptyMsg = document.getElementById("emptyMsg");
  var totalEl = document.getElementById("totalPrice");

  function currentCopies() {
    var c = document.getElementById("copies");
    var n = c ? parseInt(c.value, 10) : 1;
    return n >= 1 && n <= 5 ? n : 1;
  }
  function giftOn() {
    var g = document.getElementById("giftYes");
    return !!(g && g.checked);
  }

  // ---------- Render (DOM updates) ----------
  function render() {
    if (navCount) navCount.textContent = list.length;
    if (!listEl) return; // home page has only the counter

    listEl.textContent = "";
    var total = 0;
    var copies = currentCopies();

    list.forEach(function (item, index) {
      var li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";

      var label = document.createElement("span");
      label.textContent = item.title + " - Rs. " + item.price;
      li.appendChild(label);

      var rm = document.createElement("button");
      rm.type = "button";
      rm.className = "btn btn-sm btn-outline-secondary";
      rm.textContent = "Remove";
      rm.setAttribute("aria-label", "Remove " + item.title + " from list");
      rm.addEventListener("click", function () {
        list.splice(index, 1);
        save(list);
        render();
      });
      li.appendChild(rm);
      listEl.appendChild(li);

      total += item.price * copies + (giftOn() ? GIFT_FEE * copies : 0);
    });

    emptyMsg.classList.toggle("d-none", list.length > 0);
    totalEl.textContent = total;
  }

  // ---------- Add buttons ----------
  document.querySelectorAll(".add-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = btn.closest("tr");
      var id = row.dataset.id;
      var exists = list.some(function (b) { return b.id === id; });
      if (exists) {
        btn.textContent = "Already added";
        return;
      }
      list.push({ id: id, title: row.dataset.title, price: Number(row.dataset.price) });
      save(list);
      btn.textContent = "Added";
      render();
    });
  });

  var clearBtn = document.getElementById("clearBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      list = [];
      save(list);
      document.querySelectorAll(".add-btn").forEach(function (b) { b.textContent = "Add to list"; });
      render();
    });
  }

  // ---------- Form: estimator inputs + validation ----------
  var form = document.getElementById("pickupForm");
  if (form) {
    var dateInput = document.getElementById("pickupDate");
    var today = new Date();
    var iso = today.getFullYear() + "-" +
      String(today.getMonth() + 1).padStart(2, "0") + "-" +
      String(today.getDate()).padStart(2, "0");
    dateInput.min = iso;

    var budget = document.getElementById("budget");
    var budgetOut = document.getElementById("budgetOut");
    budget.addEventListener("input", function () { budgetOut.textContent = budget.value; });

    document.getElementById("copies").addEventListener("input", render);
    form.querySelectorAll("input[name='gift']").forEach(function (r) {
      r.addEventListener("change", render);
    });

    // Mark books already in the saved list on page load
    document.querySelectorAll("#bookTable tr[data-id]").forEach(function (row) {
      if (list.some(function (b) { return b.id === row.dataset.id; })) {
        row.querySelector(".add-btn").textContent = "Added";
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = document.getElementById("formStatus");
      status.classList.add("d-none");
      status.classList.remove("alert-danger");
      status.classList.add("alert-success");

      var valid = form.checkValidity();
      form.classList.add("was-validated");

      // Custom check: the list must not be empty
      if (valid && list.length === 0) {
        status.textContent = "Please add at least one book to your list first.";
        status.classList.remove("alert-success");
        status.classList.add("alert-danger");
        status.classList.remove("d-none");
        return;
      }
      if (!valid) return;

      // Custom check: warn when the total exceeds the chosen budget
      var total = Number(totalEl.textContent);
      var limit = Number(budget.value);
      var note = total > limit ? " Note: your total is above your chosen budget of Rs. " + limit + "." : "";

      var name = document.getElementById("fullName").value.trim();
      status.textContent = "Thank you, " + name + ". Request received for " + list.length +
        " title(s), estimated Rs. " + total + "." + note + " (Demo only: nothing is sent to a server.)";
      status.classList.remove("d-none");

      list = [];
      save(list);
      form.reset();
      form.classList.remove("was-validated");
      budgetOut.textContent = budget.value;
      document.querySelectorAll(".add-btn").forEach(function (b) { b.textContent = "Add to list"; });
      render();
    });
  }

  render();
})();
