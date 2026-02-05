let complaints = [];
let nextId = 1;

export const getAllComplaints = (req, res) => {
  res.json(complaints);
};

export const createComplaint = (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Title and description required" });
  }

  const newComplaint = {
    id: nextId++,
    title,
    description,
    status: "open"
  };

  complaints.push(newComplaint);
  res.status(201).json(newComplaint);
};

export const resolveComplaint = (req, res) => {
  const id = Number(req.params.id);
  const complaint = complaints.find(c => c.id === id);

  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  complaint.status = "resolved";
  res.json(complaint);
};

export const deleteComplaint = (req, res) => {
  const id = Number(req.params.id);
  const index = complaints.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  const deleted = complaints.splice(index, 1);
  res.json(deleted[0]);
};
