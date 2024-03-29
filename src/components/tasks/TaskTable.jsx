import * as React from "react";
import {
  Autocomplete,
  Box,
  Button,
  AspectRatio,
  Divider,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  IconButton,
  Textarea,
  Stack,
  Select,
  Option,
  Typography,
  Tabs,
  TabList,
  List,
  ListItem,
  Breadcrumbs,
  Link,
  Card,
  CardActions,
  CardOverflow,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Sheet,
  Chip,
  TabPanel,
  Tab,
  tabClasses,
  Table,
} from "@mui/joy";
import Checkbox, { checkboxClasses } from "@mui/joy/Checkbox";
import Dropdown from "@mui/joy/Dropdown";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Menu from "@mui/joy/Menu";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-client"; // Import the supabase client
// ICONS:
import Add from "@mui/icons-material/Add";

//task form
import TaskForm from "./TaskFormAdd";

export default function TaskTable() {
  const [open, setOpen] = React.useState(false);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const options = ["The Godfather", "Pulp Fiction"];
  const [index, setIndex] = React.useState(0);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  let [days, setDays] = useState(30);

  const createHandleClose = (index, value) => () => {
    if (typeof index === "number") {
      setSelectedIndex(index);
      setDays(value);
    }
  };

  const [members, setMembers] = React.useState([false, true, false]);
  const toggleMember = (index) => (event) => {
    const newMembers = [...members];
    newMembers[index] = event.target.checked;
    setMembers(newMembers);
  };
  async function getTasks() {
    const { data, error } = await supabaseClient.from("tasks").select(`
  *,
  projects(*)
`);

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks(data);
      setProjects(data.map((task) => task.projects)); //get the projects for the specified task
    }
  }
  useEffect(() => {
    getTasks();
  }, []);

  const completedTasks = tasks.filter((task) => {
    const dayLength = days * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const thirtyDaysAgoTimeStamp = Date.now() - dayLength;

    console.log("Task Date Created:", new Date(task.date_created).getTime());
    console.log("Thirty Days Ago:", thirtyDaysAgoTimeStamp);

    // Check if the task is completed and its creation date is within the last 30 days
    if (
      task.is_completed &&
      new Date(task.date_created).getTime() >= thirtyDaysAgoTimeStamp
    ) {
      return true; // Keep the task in the filtered array
    }
    return false; // Exclude the task from the filtered array
  });

  const activeTasks = tasks.filter((task) => {
    if (task.is_completed == false) {
      return task;
    }
  });

  const onHandleSubmit = () => {
    setOpen(false);
    //reload the tasks
    getTasks();
  };

  return (
    <React.Fragment>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: {
            xs: "none",
            sm: "block", 
            md: "block",
            lg: "block",
            xl: "block",
            maxWidth: "1600px",
            mx: "auto",
            borderRadius: "sm",
            px: { xs: 2, md: 6 },
            py: { xs: 2, md: 3 },
          },
          width: "100%", // if you want to make the table full width <----- HERE
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Dropdown>
          <MenuButton>Select Number of Days</MenuButton>
          <Menu>
            <MenuItem
              {...(selectedIndex === 0 && { selected: true, variant: "soft" })}
              onClick={createHandleClose(0, 30)}
            >
              30
            </MenuItem>
            <MenuItem
              selected={selectedIndex === 1}
              onClick={createHandleClose(1, 60)}
            >
              60
            </MenuItem>
          </Menu>
        </Dropdown>

        {/* Add New Task */}

        <React.Fragment>
          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<Add />}
            onClick={() => setOpen(true)}
          >
            New Task
          </Button>
          <Modal
            className="formWindow"
            open={open}
            onClose={() => setOpen(false)}
          >
            <ModalDialog>
              <TaskForm
                open={open}
                setOpen={setOpen}
                onHandleSubmit={onHandleSubmit}
              />
            </ModalDialog>
          </Modal>
        </React.Fragment>

{/* Complete Task*/}

        <React.Fragment>
          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<Add />}
            onClick={() => setOpen(true)}
          >
            New Task
          </Button>
          <Modal
            className="formWindow"
            open={open}
            onClose={() => setOpen(false)}
          >
            <ModalDialog>
              <TaskForm
                open={open}
                setOpen={setOpen}
                onHandleSubmit={onHandleSubmit}
              />
            </ModalDialog>
          </Modal>
        </React.Fragment>

        <Tabs
          aria-label="Pipeline"
          value={index}
          onChange={(event, value) => setIndex(value)}
        >
          <TabList>
            <Tab indicatorInset>
              Active Tasks{" "}
              <Chip
                size="sm"
                variant="soft"
                color={index === 0 ? "primary" : "neutral"}
              >
                {activeTasks.length}
              </Chip>
            </Tab>

            <Tab indicatorInset>
              Completed Tasks{" "}
              <Chip
                size="sm"
                variant="soft"
                color={index === 1 ? "primary" : "neutral"}
              >
                {completedTasks.length}
              </Chip>
            </Tab>
          </TabList>

          <TabPanel value={0}>
            <Table
              stickyHeader
              hoverRow
              sx={{
                "--TableCell-headBackground":
                  "var(--joy-palette-background-level1)",
                "--Table-headerUnderlineThickness": "1px",
                "--TableRow-hoverBackground":
                  "var(--joy-palette-background-level1)",
                "--TableCell-paddingY": "4px",
                "--TableCell-paddingX": "8px",
                border: "1px solid #CDD7E1", // Add border here
                borderRadius: "5px",
              }}
            >
              {/* TABLE HEAD BEGINS HERE */}
              <thead>
                <tr>
                  <th style={{ width: 120, padding: "12px 6px" }}>Task Name</th>
                  <th style={{ width: 60, padding: "12px 6px" }}>Created</th>
                </tr>
              </thead>

              <tbody>
                {Object.values(activeTasks).map((task) => (
                  <tr key={task.task_id}>
                    <td
                      onClick={() => console.log("Task Clicked")}
                      style={{ textAlign: "left", cursor: "pointer" }}
                    >
                      {`${task.task_name}`}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {task.date_created
                        ? new Intl.DateTimeFormat("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }).format(new Date(task.date_created))
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TabPanel>

          <TabPanel value={1}>
            <Table
              stickyHeader
              hoverRow
              sx={{
                "--TableCell-headBackground":
                  "var(--joy-palette-background-level1)",
                "--Table-headerUnderlineThickness": "1px",
                "--TableRow-hoverBackground":
                  "var(--joy-palette-background-level1)",
                "--TableCell-paddingY": "4px",
                "--TableCell-paddingX": "8px",
                border: "1px solid #CDD7E1", // Add border here
                borderRadius: "5px",
              }}
            >
              {/* TABLE HEAD BEGINS HERE */}
              <thead>
                <tr>
                  <th style={{ width: {xl: 70, md: 70}, padding: "12px 6px" }}>Name</th>
                  <th style={{ width: {xl: 40, md: 40}, padding: "12px 6px" }}>Project</th>
                  <th style={{ width: {xl: 20, md: 10}, padding: "12px 6px" }}>
                     By
                  </th>
                  <th style={{ width: {xl: 20, md: 15}, padding: "12px 6px" }}>Assigned</th>
                  <th style={{ width: {xl: 20, md: 15}, padding: "12px 6px" }}>Completed</th>
                </tr>
              </thead>

              <tbody>
                {Object.values(completedTasks).map((task, days) => (
                  <tr key={task.task_id}>
                    <td
                      onClick={() => console.log("Task Clicked")}
                      style={{ textAlign: "left", cursor: "pointer" }}
                    >
                      {`${task.task_name}`}
                    </td>

                    <td style={{ textAlign: "left" }}>
                      {task.projects ? (
                        <>{task.projects.project_name}</>
                      ) : (
                        <>No Project</>
                      )}
                    </td>

                    <td style={{ textAlign: "left" }}>
                      {task.completed_by ? task.completed_by : "N/A"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {task.date_created
                        ? new Date(task.date_created)
                            .toISOString()
                            .split("T")[0]
                        : "N/A"}
                    </td>

                    <td style={{ textAlign: "left" }}>
                      {task.date_created
                        ? new Date(task.date_completed)
                            .toISOString()
                            .split("T")[0]
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TabPanel>
        </Tabs>
      </Sheet>

 {/* Mobile View Table goes here? */}

 <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: {
            sm: "none", 
            md: "none",
            xl: "none",
            lg: "none",
            mx: "auto",
            borderRadius: "sm",
            px: { xs: 2, md: 6 },
            py: { xs: 2, md: 3 },
          },
          width: "100%", // if you want to make the table full width <----- HERE
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Dropdown>
          <MenuButton>Select Number of Days</MenuButton>
          <Menu>
            <MenuItem
              {...(selectedIndex === 0 && { selected: true, variant: "soft" })}
              onClick={createHandleClose(0, 30)}
            >
              30
            </MenuItem>
            <MenuItem
              selected={selectedIndex === 1}
              onClick={createHandleClose(1, 60)}
            >
              60
            </MenuItem>
          </Menu>
        </Dropdown>

        <React.Fragment>
          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<Add />}
            onClick={() => setOpen(true)}
          >
            New Task
          </Button>
          <Modal
            className="formWindow"
            open={open}
            onClose={() => setOpen(false)}
          >
            <ModalDialog>
              <TaskForm
                open={open}
                setOpen={setOpen}
                onHandleSubmit={onHandleSubmit}
              />
            </ModalDialog>
          </Modal>
        </React.Fragment>

        <Tabs
          aria-label="Pipeline"
          value={index}
          onChange={(event, value) => setIndex(value)}
        >
          <TabList>
            <Tab indicatorInset>
              Active Tasks{" "}
              <Chip
                size="sm"
                variant="soft"
                color={index === 0 ? "primary" : "neutral"}
              >
                {activeTasks.length}
              </Chip>
            </Tab>

            <Tab indicatorInset>
              Completed Tasks{" "}
              <Chip
                size="sm"
                variant="soft"
                color={index === 1 ? "primary" : "neutral"}
              >
                {completedTasks.length}
              </Chip>
            </Tab>
          </TabList>

          <TabPanel value={0}>
            <Table
              stickyHeader
              hoverRow
              sx={{
                "--TableCell-headBackground":
                  "var(--joy-palette-background-level1)",
                "--Table-headerUnderlineThickness": "1px",
                "--TableRow-hoverBackground":
                  "var(--joy-palette-background-level1)",
                "--TableCell-paddingY": "4px",
                "--TableCell-paddingX": "8px",
                border: "1px solid #CDD7E1", // Add border here
                borderRadius: "5px",
              }}
            >
              {/* TABLE HEAD BEGINS HERE */}
              <thead>
                <tr>
                  <th style={{ width: 120, padding: "12px 6px" }}>Task Name</th>
                  <th style={{ width: 60, padding: "12px 6px" }}>Created</th>
                </tr>
              </thead>

              <tbody>
                {Object.values(activeTasks).map((task) => (
                  <tr key={task.task_id}>
                    <td
                      onClick={() => console.log("Task Clicked")}
                      style={{ textAlign: "left", cursor: "pointer" }}
                    >
                      {`${task.task_name}`}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {task.date_created
                        ? new Intl.DateTimeFormat("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }).format(new Date(task.date_created))
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TabPanel>

          <TabPanel value={1}>
            <Table
              stickyHeader
              hoverRow
              sx={{
                "--TableCell-headBackground":
                  "var(--joy-palette-background-level1)",
                "--Table-headerUnderlineThickness": "1px",
                "--TableRow-hoverBackground":
                  "var(--joy-palette-background-level1)",
                "--TableCell-paddingY": "4px",
                "--TableCell-paddingX": "8px",
                border: "1px solid #CDD7E1", // Add border here
                borderRadius: "5px",
              }}
            >
              {/* TABLE HEAD BEGINS HERE */}
              <thead>
                <tr>
                  <th style={{ width: 20, padding: "12px 6px" }}>Task</th>
                  <th style={{ width: 20, padding: "12px 6px" }}>Project</th>
                  <th style={{ width: 10, padding: "12px px" }}>
                  <Typography >By</Typography>
                  </th>
                </tr>
              </thead>

              <tbody>
                {Object.values(completedTasks).map((task, days) => (
                  <tr key={task.task_id}>
                    <td
                      onClick={() => console.log("Task Clicked")}
                      style={{ textAlign: "left", cursor: "pointer" }}
                    >
                      <Typography level="body-xs">{`${task.task_name}`}</Typography>
                    </td>

                    <td style={{ textAlign: "left" }}>
                      {task.projects ? (
                        <><Typography level="body-xs">{task.projects.project_name}</Typography></>
                      ) : (
                        <>No Project</>
                      )}
                    </td>

                    <td style={{ textAlign: "left" }}>
                    <Typography level="body-xs">
                      {task.completed_by ? task.completed_by : "N/A"}
                      </Typography>
                    </td>

                  </tr>
                ))}
              </tbody>
            </Table>
          </TabPanel>
        </Tabs>
      </Sheet>



    </React.Fragment>
  );
}
