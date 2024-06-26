import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ClientsPage from "./pages/Clients/ClientsPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProjectPage from "./pages/Projects/ProjectPage.jsx";
import ProjectDetailsPage from "./pages/Projects/ProjectDetailsPage.jsx";
import ProjectForm from "./components/project/ProjectForm.jsx";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import CreateUserPage from "./pages/Auth/CreateUserPage.jsx";
import ConfirmationPage from "./pages/Auth/ConfirmationPage.jsx";
import PasswordPage from "./pages/Auth/PasswordPage.jsx";
import Protected from './components/Protected';
import ClientDetailsPage from "./pages/Clients/ClientDetailsPage.jsx";
import ClientForm from "./components/client/ClientForm.jsx";
import ForgotPassword from './pages/Auth/ForgotPassword.jsx';
import TasksPage from './pages/Tasks/TasksPage.jsx';
import TaskForm from './components/tasks/TaskForm.jsx';
import AdminPanel from './pages/AdminPanel/AdminPanel.jsx';
import { useAuth } from "./pages/Auth/Auth.jsx";

function App() {
  const { isAdmin, loading } = useAuth();

  // Render loading indicator while authentication data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("admin stats: " + isAdmin);

  // Render routes once authentication data is available
  return (
    <div style={{ display: "flex" }}>
      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Protected />}>
            <Route index element={<Home />} />
            <Route path="/projects">
              <Route index element={<ProjectPage />} />
              <Route path=":id" element={<ProjectDetailsPage />} />
              <Route path="new" element={<ProjectForm />} />
              <Route path="edit/:projectid" element={<ProjectForm />} />
            </Route>
            {isAdmin && (
              <Route path="/clients">
                <Route index element={<ClientsPage />} />
                <Route path=":id" element={<ClientDetailsPage />} />
                <Route path="new" element={<ClientForm />} />
                <Route path="edit/:clientId" element={<ClientForm />} />
              </Route>
            )}
            <Route path="/tasks">
              <Route index element={<TasksPage />} />
              <Route path="new" element={<TaskForm />} />
              <Route path="edit/:taskid" element={<TaskForm />} />
            </Route>
          </Route>
          <Route path="/confirm-signup" element={<ConfirmationPage />} />
          <Route path="/set-password" element={<PasswordPage />} />
          <Route path="/create-user" element={<CreateUserPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
