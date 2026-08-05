import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
// NOTE: Data will reset whenever the server restarts.
// For production, use MongoDB, Firestore, PostgreSQL, etc.
let todos = [];

// =====================
// Home Route
// =====================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Todo Backend Running 🚀",
  });
});

// =====================
// Test Route
// =====================
app.get("/test", (req, res) => {
  res.json({
    success: true,
    routes: [
      "GET /",
      "GET /test",
      "GET /gettodos",
      "GET /gettodo/:id",
      "POST /addtodo",
      "PUT /updatetodo/:id",
      "DELETE /deletetodo/:id",
    ],
  });
});

// =====================
// Get All Todos
// =====================
app.get("/gettodos", (req, res) => {
  res.status(200).json({
    success: true,
    todos,
  });
});

// =====================
// Get Single Todo
// =====================
app.get("/gettodo/:id", (req, res) => {
  const id = Number(req.params.id);

  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  res.json({
    success: true,
    todo,
  });
});

// =====================
// Add Todo
// =====================
app.post("/addtodo", (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Title and Description are required.",
    });
  }

  const newTodo = {
    id: Date.now(),
    title,
    description,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.push(newTodo);

  res.status(201).json({
    success: true,
    message: "Todo added successfully.",
    todo: newTodo,
    todos,
  });
});

// =====================
// Update Todo
// =====================
app.put("/updatetodo/:id", (req, res) => {
  const id = Number(req.params.id);

  const { title, description } = req.body;

  const index = todos.findIndex((todo) => todo.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  if (title !== undefined) {
    todos[index].title = title;
  }

  if (description !== undefined) {
    todos[index].description = description;
  }

  res.json({
    success: true,
    message: "Todo updated successfully.",
    todo: todos[index],
    todos,
  });
});

// =====================
// Delete Todo
// =====================
app.delete("/deletetodo/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = todos.findIndex((todo) => todo.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  todos.splice(index, 1);

  res.json({
    success: true,
    message: "Todo deleted successfully.",
    todos,
  });
});

// =====================
// Start Server
// =====================
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});