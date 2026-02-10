async function submitComplaint() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("desc").value;
    const priority = document.getElementById("priority").value;

    if (!title || !description) {
        alert("Please fill all fields");
        return;
    }

    await fetch("/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority })
    });

    alert("Complaint submitted successfully!");
    document.getElementById("title").value = "";
    document.getElementById("desc").value = "";
}

function goToAdmin() {
    window.location.href = "/admin.html";
}

async function loadComplaints() {
    const res = await fetch("/complaints");
    const complaints = await res.json();

    const list = document.getElementById("list");
    const counter = document.getElementById("counter");

    if (!list) return;

    list.innerHTML = "";

    let pendingCount = 0;

    complaints.forEach(c => {
        if (c.status === "pending") pendingCount++;

        const card = document.createElement("div");
        card.className = "complaint-card";

        card.innerHTML = `
      <div class="card-header">
        <div class="card-title">
          <span class="card-id">#${c.id}</span>
          ${c.title}
        </div>
        <span class="status status-${c.status}">
          ${c.status}
        </span>
      </div>

      <div class="card-desc">
        ${c.description}
      </div>

      <div class="card-actions">
        <button onclick="updateStatus(${c.id}, 'resolved')">Resolve</button>
        <button onclick="updateStatus(${c.id}, 'rejected')">Reject</button>
      </div>
    `;

        list.appendChild(card);
    });

    counter.textContent = `Total: ${complaints.length} | Pending: ${pendingCount}`;
}

// Update status
async function updateStatus(id, status) {
    await fetch(`/complaints/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-admin": "true"
        },
        body: JSON.stringify({ status })
    });

    loadComplaints();
}

loadComplaints();
