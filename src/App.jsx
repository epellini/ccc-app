import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar"; // Import the Sidebar component
import Header from "./components/Header";
import Home from "./pages/Home.jsx";
import Clients from "./pages/Clients/Clients.jsx";
import NotFound from "./pages/NotFound.jsx";
import Projects from "./pages/Projects/Projects.jsx";
import ProjectDetailsComp from "./components/project/ProjectDetailsComp.jsx"; // Import the project details component
// import ProjectForm from "./pages/Projects/ProjectForm.jsx"; // Import the project form component
import BetterProjectForm from "./components/project/BetterProjectForm.jsx";

// Auth Pages:
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import CreateUserPage from "./pages/Auth/CreateUserPage.jsx";
// Protected Route:
import Protected from './components/Protected';
import ClientDetails from './pages/Clients/ClientDetails.jsx';
import ClientForm from './pages/Clients/ClientForm.jsx';
import ForgotPassword from './pages/Auth/ForgotPassword.jsx';
import TasksPage from './pages/Tasks/TasksPage.jsx';
import TaskForm from './components/tasks/TaskForm.jsx';


function App() {
  return (
    <div style={{ display: "flex" }}>
      <main style={{ flexGrow: 1 }}>
        <Routes>
          {/* AUTH ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* END OF AUTH ROUTES */}
          {/* PROTECTED ROUTE */}
          <Route path="/" element={<Protected />}>
            {/* HOME ROUTE */}
            <Route index element={<Home/>} />

            {/* PROJECTS ROUTES */}
            <Route path="/projects">
              <Route index element={<Projects />} />
              <Route path=":id" element={<ProjectDetailsComp />} />
              <Route path="new" element={<BetterProjectForm />} />
              <Route path="edit/:projectid" element={<BetterProjectForm />} />
            </Route>

            {/* CLIENTS ROUTES */}
            <Route path="/clients" element={<Protected isAdminRoute={true} />}>
              <Route index element={<Clients />} />
              <Route path=":id" element={<ClientDetails />} />
              <Route path="new" element={<ClientForm />} />
              <Route path="edit/:clientId" element={<ClientForm />} />
            </Route>

             {/* TASKS ROUTES */}

             <Route path="/tasks">
              <Route index element={<TasksPage/>}/>
              <Route path="new" element={<TaskForm/>}/>
             

             </Route>




          </Route> {/* END OF PROTECTED ROUTE */}
          
            <Route path="/create-user" element={<CreateUserPage/>} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
          {/* NOT FOUND ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
