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
} from "@mui/joy";
import Checkbox, { checkboxClasses } from "@mui/joy/Checkbox";
import Dropdown from '@mui/joy/Dropdown';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Menu from '@mui/joy/Menu';
import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-client"; // Import the supabase client
// ICONS:
import Add from "@mui/icons-material/Add";

//task form
import TaskForm from "./TaskForm";

export default function TasksLayoutMain() {
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
    if (typeof index === 'number') {
      setSelectedIndex(index);
      setDays(value);
      
    }
  }

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
  
    console.log('Task Date Created:', new Date(task.date_created).getTime());
    console.log('Thirty Days Ago:', thirtyDaysAgoTimeStamp);
  
    // Check if the task is completed and its creation date is within the last 30 days
    if (task.is_completed && new Date(task.date_created).getTime() >= thirtyDaysAgoTimeStamp) {
      return true; // Keep the task in the filtered array
    }
    return false; // Exclude the task from the filtered array
  });

  const activeTasks = tasks.filter((task) => {
    if (task.is_completed == false) {
      return task;
    }
  })



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
        <Tabs
          aria-label="Pipeline"
          value={index}
          onChange={(event, value) => setIndex(value)}
        >

          <TabList
            sx={{
              pt: 1,
              justifyContent: "center",
              [`&& .${tabClasses.root}`]: {
                flex: "initial",
                bgcolor: "transparent",
                "&:hover": {
                  bgcolor: "transparent",
                },
                [`&.${tabClasses.selected}`]: {
                  color: "primary.plainColor",
                  "&::after": {
                    height: 2,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                    bgcolor: "primary.500",
                  },
                },
              },
            }}
          >
              <Dropdown>
                <MenuButton>
                  Select Number of Days
                </MenuButton>
                <Menu>
                  <MenuItem
                    {...(selectedIndex === 0 && { selected: true, variant: 'soft' })}
                    onClick={createHandleClose(0, 30)}
                  >30
                  </MenuItem>
                  <MenuItem selected={selectedIndex === 1} onClick={createHandleClose(1, 60)}>
                    60
                  </MenuItem>

                </Menu>
              </Dropdown>
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
          <Box
            sx={(theme) => ({
              "--bg": theme.vars.palette.background.surface,
              background: "var(--bg)",
              boxShadow: "0 0 0 100vmax var(--bg)",
              clipPath: "inset(0 -100vmax)",
            })}
          >
            <TabPanel value={0}>
              <Box sx={{ flex: 1, width: "100%" }}>
                {/* <Divider /> */}

                <Stack
                  direction="column"
                  spacing={1}
                  sx={{ display: { xs: "flex", md: "flex" }, my: 1 }}
                >
                  {Object.values(activeTasks).map((task) => (
                    <Stack
                      justifyContent={"center"}
                      alignItems={"center"}
                      key={task.task_id}
                      direction="row"
                      spacing={1}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "90%",
                        borderRadius: "sm",
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.body",
                        boxShadow: "sm",
                      }}
                    >
                      <List
                        sx={{
                          "--ListItem-gap": "0.05rem",
                          [`& .${checkboxClasses.root}`]: {
                            mr: "auto",
                            flexGrow: 1,
                            alignItems: "center",
                            flexDirection: "row",
                          },
                        }}
                      >
                        <ListItem>
                          <FormControl>
                            <ListItem>


                              <Checkbox
                                label={
                                  <div style={{ textAlign: "left" }}>
                                    {task.task_name}
                                  </div>
                                }
                                overlay
                                checked={members[0]}
                                onChange={toggleMember(0)}
                              />
                              <Typography sx={{ ml: "auto" }}>
                                {task.projects ? (
                                  <>Project: {task.projects.project_name}</>
                                ) : (
                                  <>Project: No Project</>
                                )}
                              </Typography>
                            </ListItem>
                          </FormControl>
                        </ListItem>
                      </List>

                      {/* We might not need this here for now, but leaving it for reference */}

                      {/* <Typography level="body-md">
                        Task ID: {task.task_id}
                      </Typography> 

                     <Typography level="body-sm">
                        Status: {task.is_completed ? "Yes" : "No"}
                      </Typography>  */}
                    </Stack>
                  ))}
                </Stack>

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
                {/* <CardOverflow
              sx={{ borderTop: "1px solid", borderColor: "divider" }}
            >
              <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
                <Button size="sm" variant="outlined" color="neutral">
                  Cancel
                </Button>
                <Button size="sm" variant="solid">
                  Save
                </Button>
              </CardActions>
            </CardOverflow> */}
              </Box>
            </TabPanel>
            <TabPanel value={1}>
              {Object.values(completedTasks).map((task, days) => (

                <Stack
                  justifyContent={"center"}
                  alignItems={"center"}
                  key={task.task_id}
                  direction="row"
                  spacing={1}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "90%",
                    borderRadius: "sm",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.body",
                    boxShadow: "sm",
                  }}
                >

                  <List
                    sx={{
                      "--ListItem-gap": "0.05rem",
                      [`& .${checkboxClasses.root}`]: {
                        mr: "auto",
                        flexGrow: 1,
                        alignItems: "center",
                        flexDirection: "row",
                      },
                    }}
                  >
                    <ListItem>
                      <FormControl>
                        <ListItem>
                          <Typography sx={{ ml: "auto" }}>
                            {task.projects ? (
                              <>Project: {task.projects.project_name}</>
                            ) : (
                              <>Project: No Project</>
                            )}
                          </Typography>
                          <Typography sx={{ ml: "auto" }}>
                            <>Task Name: {task.task_name}</>
                          </Typography>
                        </ListItem>
                      </FormControl>
                    </ListItem>
                  </List>

                  {/* We might not need this here for now, but leaving it for reference */}

                  {/* <Typography level="body-md">
                        Task ID: {task.task_id}
                      </Typography> 

                     <Typography level="body-sm">
                        Status: {task.is_completed ? "Yes" : "No"}
                      </Typography>  */}
                </Stack>
              ))}

            </TabPanel>
            <TabPanel value={2}>Products</TabPanel>
          </Box>
        </Tabs>
      </Sheet>
    </React.Fragment>
  );
}
