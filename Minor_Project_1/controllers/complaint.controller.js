let complaints = [];
let counter = 1;

export const getAllComplaints = (req, res) => {
    res.json(complaints);
};

export const getComplaintById = (req, res) => {
    const complaint = complaints.find(c => c.id === Number(req.params.id));
    if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
    }
    res.json(complaint);
};

export const createComplaint = (req, res) => {
    const { title, description, priority } = req.body;

    const newComplaint = {
        id: counter++,
        title,
        description,
        priority: priority || "normal", // ⭐ uniqueness
        status: "pending",
        createdAt: new Date().toISOString()
    };

    complaints.push(newComplaint);
    res.status(201).json(newComplaint);
};

export const updateStatus = (req, res) => {
    const complaint = complaints.find(c => c.id === Number(req.params.id));
    if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = req.body.status;
    res.json(complaint);
};

export const deleteComplaint = (req, res) => {
    complaints = complaints.filter(c => c.id !== Number(req.params.id));
    res.json({ message: "Complaint deleted" });
};
