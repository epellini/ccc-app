/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Checkbox from "@mui/joy/Checkbox";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import BlockIcon from "@mui/icons-material/Block";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { supabaseClient } from "../supabase-client"; // Import the supabase client
import { Skeleton } from "@mui/joy";

function RowMenu({ projectId }) {
  const navigate = useNavigate();

  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem onClick={() => navigate(`/projects/edit/${projectId}`)}>
          Edit
        </MenuItem>

        <Divider />
        <MenuItem onClick={() => navigate(`/projects/${projectId}`)}>
          Details
        </MenuItem>
        <Divider />
        <MenuItem color="danger">Delete</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function ProjectTable() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProjects() {
      setLoading(true); // Start loading
      const { data, error } = await supabaseClient
        .from("projects")
        .select("*")
        .order("project_id", { ascending: true });
      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        // Fetch clients and status for each project
        const projectInfo = await Promise.all(
          data.map(async (project) => {
            const { data: clientData, error: clientError } =
              await supabaseClient
                .from("clients")
                .select("*")
                .eq("client_id", project.client_id)
                .single();
            if (clientError) {
              console.error("Error getting client:", clientError);
              return project;
            }

            const { data: statusData, error: statusError } =
              await supabaseClient
                .from("status")
                .select("*")
                .eq("status_id", project.status_id)
                .single();
            if (statusError || !statusData) {
              console.error("Error getting status:", statusError);
              // Set default status object with placeholder "N/A" if status is not found
              return {
                ...project,
                client: clientData,
                status: { name: "N/A" },
              };
            }

            return { ...project, client: clientData, status: statusData };
          })
        );
        setProjects(projectInfo);
      }
      setLoading(false); // End loading
    }
    getProjects();
  }, []);

  // FILTERS
  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        {/* WILL NEED TO POPULATE THIS WITH DB DATA */}
        <FormLabel>Status</FormLabel>
        <Select
          size="sm"
          placeholder="Filter by status"
          slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
        >
          <Option value="completed">Completed</Option>
          <Option value="in-progress">In Progress</Option>
          <Option value="pending-approval">Pending Approval</Option>
          <Option value="cancelled">Cancelled</Option>
          <Option value="refunded">Refunded</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        {/* WILL NEED TO POPULATE THIS WITH DB DATA */}
        <FormLabel>Category</FormLabel>
        <Select size="sm" placeholder="All">
          <Option value="all">All</Option>
          <Option value="refund">General Home</Option>
          <Option value="purchase">Tiny Homes</Option>
          <Option value="debit">Additions</Option>
          <Option value="debit">Basements</Option>
          <Option value="debit">Bathrooms</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        {/* WILL NEED TO POPULATE THIS WITH DB DATA - ALSO NEED TO KNOW WHAT TO ADD HERE */}
        <FormLabel>Customer</FormLabel>
        <Select size="sm" placeholder="All">
          <Option value="all">All</Option>
          <Option value="olivia">Olivia Rhye</Option>
          <Option value="steve">Steve Hampton</Option>
          <Option value="ciaran">Ciaran Murray</Option>
          <Option value="marina">Marina Macdonald</Option>
          <Option value="charles">Charles Fulton</Option>
          <Option value="jay">Jay Hoper</Option>
        </Select>
      </FormControl>
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: { xs: "flex", sm: "none" },
          my: 1,
          gap: 1,
        }}
      >
        <Input
          size="sm"
          placeholder="Search"
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          py: 2,
          display: { xs: "none", sm: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: { xs: "120px", md: "160px" },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search for project</FormLabel>
          <Input
            size="sm"
            placeholder="Search"
            startDecorator={<SearchIcon />}
          />
        </FormControl>
        {renderFilters()}
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "initial" },
          width: "100%", // if you want to make the table full width <----- HERE
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
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
          }}
        >
          {/* ADD CHANGES HERE MY BOY  */}
          <thead>
            <tr >
              <th
                style={{ width: 48, textAlign: "center", padding: "12px 6px" }}
              >
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== projects.length
                  }
                  checked={selected.length === projects.length}
                  onChange={(event) => {
                    // setSelected(
                    //   event.target.checked ? projects.map((project) => projects.project_id) : [],
                    // );
                  }}
                  color={
                    selected.length > 0 || selected.length === projects.length
                      ? "primary"
                      : undefined
                  }
                  sx={{ verticalAlign: "text-bottom" }}
                />
              </th>
              <th style={{ width: 120, padding: "12px 6px" }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  // onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                  fontWeight="lg"
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    "& svg": {
                      transition: "0.2s",
                      // transform:
                      //     order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                    },
                  }}
                >
                  Project
                </Link>
              </th>
              <th style={{ width: 140, padding: "12px 6px" }}>Client Name</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Status</th>
              <th style={{ width: 240, padding: "12px 6px" }}>End Date</th>
              <th style={{ width: 140, padding: "12px 6px" }}> </th>
            </tr>
          </thead>

          {/*  */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">
                  {" "}
                  <Skeleton variant="text" width="100%" height={50} />
                  <Skeleton variant="text" width="100%" height={50} />
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.project_id} >
                  <td
                    style={{
                      textAlign: "center",
                      width: 120,
                    }}
                  >
                    <Checkbox
                      size="sm"
                      checked={selected.includes(project.project_id.toString())}
                      color={
                        selected.includes(project.project_id.toString())
                          ? "primary"
                          : undefined
                      }
                      onChange={(event) => {
                        setSelected((prevSelected) =>
                          event.target.checked
                            ? prevSelected.concat(project.project_id.toString())
                            : prevSelected.filter(
                                (id) => id !== project.project_id.toString()
                              )
                        );
                      }}
                      slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                      sx={{ verticalAlign: "text-bottom" }}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {project.client ? (
                      <Typography level="body-xs">{`${project.project_name}`}</Typography>
                    ) : (
                      <Typography level="body-xs">N/A</Typography>
                    )}
                  </td>
                  <td>
                    {/* Displaying client's first name and last name if available */}
                    {project.client ? (
                      <Typography level="body-xs">{`${project.client.first_name} ${project.client.last_name}`}</Typography>
                    ) : (
                      <Typography level="body-xs">N/A</Typography>
                    )}
                  </td>
                  {/* <td>
                  <Typography level="body-xs">{project.project_id}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{project.client_id ? `${project.client_id.first_name} ${project.client_id.last_name}` : 'N/A' }</Typography>
                </td>*/}
                  <td>
                    <Chip
                      variant="soft"
                      size="sm"
                      startDecorator={
                        project.status.name == "Completed" ? (
                          <CheckRoundedIcon />
                        ) : project.status.name == "Cancelled" ? (
                          <BlockIcon />
                        ) : project.status.name == "Active" ? (
                          <AutorenewRoundedIcon />
                        ) : undefined // No icon for "N/A" or other statuses
                      }
                      color={
                        project.status.name =="Completed"
                          ? "success"
                          : project.status.name == "Active"
                          ? "neutral"
                          : project.status.name == "Cancelled"
                          ? "danger"
                          : "default" // Use default color for "N/A" or other statuses
                      }
                    >
                      {project.status.name}
                    </Chip>
                  </td>
                  <td>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                      }}
                    >
                      {/* <Avatar size="sm">{project.client.first_name}</Avatar> */}
                      <div>
                        {/* <Typography level="body-xs">{project.client_id }</Typography> */}

                        <Typography level="body-xs">{status.name}</Typography>
                      </div>

                      {project.client ? (
                        <Typography level="body-xs">{`${project.end_date}`}</Typography>
                      ) : (
                        <Typography level="body-xs">N/A</Typography>
                      )}
                    </Box>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Link level="body-xs" component="button">
                        Download
                      </Link>
                      <RowMenu projectId={project.project_id} />
                    </Box>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Sheet>
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
          display: {
            xs: "none",
            md: "flex",
          },
        }}
      >
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeftIcon />}
        >
          Previous
        </Button>

        <Box sx={{ flex: 1 }} />
        {["1", "2", "3", "…", "8", "9", "10"].map((page) => (
          <IconButton
            key={page}
            size="sm"
            variant={Number(page) ? "outlined" : "plain"}
            color="neutral"
          >
            {page}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />

        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRightIcon />}
        >
          Next
        </Button>
      </Box>
    </React.Fragment>
  );
}
