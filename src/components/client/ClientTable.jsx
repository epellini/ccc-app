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
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import Autocomplete from "@mui/joy/Autocomplete";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-client"; // Import the supabase client
import { Skeleton } from "@mui/joy";
import { convertToCSV, downloadCSV } from "../../utils/CsvUtils";
function RowMenu({ clientId }) {
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
        <MenuItem onClick={() => navigate(`/clients/edit/${clientId}`)}>
          Edit
        </MenuItem>

        <Divider />
        <MenuItem onClick={() => navigate(`/clients/${clientId}`)}>
          Details
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function ClientTable() {
  const [clients, setClients] = useState([]);
  //const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(true);

  // const [searchQuery, setSearchQuery] = useState("");
  // const [filteredClients, setFilteredClients] = useState([]);

  const [selectedClient, setSelectedClient] = useState(null);
  useEffect(() => {
    async function getClients() {
      setLoading(true); // Begin loading state

      try {
        const { data: clientsData, error } = await supabaseClient
          .from("clients")
          .select("*");

        if (error) {
          throw error;
        }

        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching data: ", error.message);
      } finally {
        setLoading(false); // End loading state
      }
    }

    getClients();
  }, []);

  const filteredClients = selectedClient
    ? clients.filter((client) => client.client_id === selectedClient.client_id)
    : clients;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate total pages
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  // Determine the clients for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Previous and Next page handlers
  const handlePrevious = () =>
    setCurrentPage((currentPage) => Math.max(1, currentPage - 1));
  const handleNext = () =>
    setCurrentPage((currentPage) => Math.min(totalPages, currentPage + 1));

  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // Select all clients
      const newSelected = clients.map((client) => client.client_id.toString());
      setSelected(newSelected);
    } else {
      // Clear selection if the main checkbox is unchecked
      setSelected([]);
    }
  };

  // This function copies the email of the client in clipboard and also redirects to email
  function handleEmailClick(emailAddress) {
    navigator.clipboard
      .writeText(emailAddress)
      .then(() => {
        console.log("Email address copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy email address: ", err);
      });

    // Open default email client with the email address in the "To" field
    window.location.href = `mailto:${emailAddress}`;
  }

  const handleExportSelected = () => {
    // Filter the clients to only those selected
    const selectedClientsData = clients.filter((client) =>
      selected.includes(client.client_id.toString())
    );

    // Convert the selected clients' data to CSV
    const csvData = convertToCSV(selectedClientsData);

    // Trigger the CSV file download
    downloadCSV(csvData, "SelectedClients.csv");
  };

  // useEffect(() => {
  //   //Fliter(find) client based on a search query
  //   if (typeof searchQuery === 'string') {
  //     const lowercasedQuery = searchQuery.toLowerCase();
  //     const filteredData = clients.filter(
  //       client =>
  //         client.first_name.toLowerCase().includes(lowercasedQuery) ||
  //         client.last_name.toLowerCase().includes(lowercasedQuery) ||
  //         client.email.toLowerCase().includes(lowercasedQuery)
  //     );
  //     setFilteredClients(filteredData);
  //   }

  // }, [searchQuery, clients]);

  // const filteredClients = selectedClient
  //   ? clients.filter((client) =>
  //       `${client.first_name} ${client.last_name}`.toLowerCase().includes(selectedClient)
  //     )
  //   : clients;

  // FILTERS
  // const renderFilters = () => (
  //   <React.Fragment>
  //     <FormControl size="sm">
  //       {/* WILL NEED TO POPULATE THIS WITH DB DATA */}
  //       <FormLabel>Status</FormLabel>
  //       <Select
  //         size="sm"
  //         placeholder="Filter by status"
  //         slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
  //       >
  //         <Option value="completed">Completed</Option>
  //         <Option value="in-progress">In Progress</Option>
  //         <Option value="pending-approval">Pending Approval</Option>
  //         <Option value="cancelled">Cancelled</Option>
  //         <Option value="refunded">Refunded</Option>
  //       </Select>
  //     </FormControl>
  //     <FormControl size="sm">
  //       {/* WILL NEED TO POPULATE THIS WITH DB DATA */}
  //       <FormLabel>Category</FormLabel>
  //       <Select size="sm" placeholder="All">
  //         <Option value="all">All</Option>
  //         <Option value="refund">General Home</Option>
  //         <Option value="purchase">Tiny Homes</Option>
  //         <Option value="debit">Additions</Option>
  //         <Option value="debit">Basements</Option>
  //         <Option value="debit">Bathrooms</Option>
  //       </Select>
  //     </FormControl>
  //     <FormControl size="sm">
  //       {/* WILL NEED TO POPULATE THIS WITH DB DATA - ALSO NEED TO KNOW WHAT TO ADD HERE */}
  //       <FormLabel>Customer</FormLabel>
  //       <Select size="sm" placeholder="All">
  //         <Option value="all">All</Option>
  //         <Option value="olivia">Olivia Rhye</Option>
  //         <Option value="steve">Steve Hampton</Option>
  //         <Option value="ciaran">Ciaran Murray</Option>
  //         <Option value="marina">Marina Macdonald</Option>
  //         <Option value="charles">Charles Fulton</Option>
  //         <Option value="jay">Jay Hoper</Option>
  //       </Select>
  //     </FormControl>
  //   </React.Fragment>
  // );
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
              {/* {renderFilters()} */}
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
          <FormLabel>Search for client</FormLabel>
          <Autocomplete
            size="sm"
            placeholder="Search"
            options={clients}
            getOptionLabel={(option) =>
              `${option.first_name} ${option.last_name}`
            }
            // startDecorator={<SearchIcon />}
            value={selectedClient}
            onChange={(event, newValue) => {
              setSelectedClient(newValue);
              console.log("Selected client:", newValue);
            }}
            renderInput={(params) => <Input {...params} />}
          />
        </FormControl>
        {/* {renderFilters()} */}
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
          <thead>
            <tr>
              <th
                style={{ width: 48, textAlign: "center", padding: "12px 6px" }}
              >
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== clients.length
                  }
                  checked={
                    clients.length > 0 && selected.length === clients.length
                  }
                  onChange={handleSelectAllClick}
                  color={
                    selected.length > 0 || selected.length === clients.length
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
                  Name
                </Link>
              </th>
              <th
                style={{ width: 180, padding: "12px 6px", textAlign: "left" }}
              >
                Contact
              </th>{" "}
              {/* the width used to be 140*/}
              <th
                style={{ width: 140, padding: "12px 6px", textAlign: "left" }}
              >
                Address
              </th>
              <th
                style={{ width: 140, padding: "12px 6px", textAlign: "left" }}
              >
                Tags
              </th>
              <th style={{ width: 40, padding: "12px 6px", textAlign: "left" }}>
                Utilities
              </th>
              <th
                style={{ width: 40, padding: "12px 6px", textAlign: "left" }}
              ></th>
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
              currentClients.map((client) => {
                // filteredClients.map((client) => {
                //console.log("Clients:", client);
                return (
                  <tr key={client.client_id}>
                    <td
                      style={{
                        textAlign: "center",
                        width: 120,
                      }}
                    >
                      <Checkbox
                        size="sm"
                        checked={selected.includes(client.client_id.toString())}
                        color={
                          selected.includes(client.client_id.toString())
                            ? "primary"
                            : undefined
                        }
                        onChange={(event) => {
                          setSelected((prevSelected) =>
                            event.target.checked
                              ? prevSelected.concat(client.client_id.toString())
                              : prevSelected.filter(
                                  (id) => id !== client.client_id.toString()
                                )
                          );
                        }}
                        slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                        sx={{ verticalAlign: "text-bottom" }}
                      />
                    </td>
                    {/* Displaying client's first and last names information if available */}
                    <td style={{ textAlign: "left" }}>
                      <Typography level="body-xs">{`${client.first_name} ${client.last_name}`}</Typography>
                    </td>
                    {/* Displaying client's contact information if available */}
                    <td>
                      {/* This is working version with out icons */}
                      {/* {client ? (
                      <Typography level="body-xs">
                        {`${client.phone_number} ${client.email}`}
                        </Typography>
                    ) : (
                      <Typography level="body-xs">N/A</Typography>
                    )} */}
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-start"
                        gap={0.5}
                      >
                        <Box display="flex" alignItems="left" gap={1}>
                          <Typography variant="body-xs" component="span">
                            <LocalPhoneIcon fontSize="small" sx={{ mr: 1 }} />
                            {client.phone_number}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="left" gap={1}>
                          <Typography variant="body-xs" component="span">
                            <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                            {client.email}
                          </Typography>
                        </Box>
                      </Box>
                    </td>
                    <td style={{ textAlign: "left" }}>
                      <Typography level="body-xs">{`${client.address}`}</Typography>
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

                        {/* {project.client ? (
                        <Typography level="body-xs">{`${project.end_date}`}</Typography>
                      ) : (
                        <Typography level="body-xs">N/A</Typography>
                      )} */}
                      </Box>
                    </td>
                    <td>
                      <Box sx={{ display: "flex", gap: 2, alignItems: "left" }}>
                        <Link
                          level="body-xs"
                          component="button"
                          onClick={() => handleEmailClick(client.email)}
                        >
                          Email
                        </Link>
                        <RowMenu clientId={client.client_id} />
                      </Box>
                    </td>
                    <td></td>
                  </tr>
                );
              })
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
        {/* <Button
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
        </Button> */}
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeftIcon />}
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        {/* <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          {pageNumbers.map((page) => (
            <IconButton
              key={page}
              size="sm"
              variant={currentPage === page ? "contained" : "outlined"}
              color="neutral"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </IconButton>
          ))}
        </Box> */}

        {/* This is working version, the UI is not what we want  */}
        {/* {[...Array(totalPages).keys()].map(number => (
          <Button
            key={number + 1}
            onClick={() => handlePageChange(number + 1)}
            disabled={currentPage === number + 1}
          >
            {number + 1}
          </Button>
        ))} */}

        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          {[...Array(totalPages).keys()].map((number) => (
            <IconButton
              key={number + 1}
              size="sm"
              color="neutral"
              variant="outlined"
              onClick={() => handlePageChange(number + 1)}
              sx={{
                backgroundColor:
                  currentPage === number + 1 ? "primary.main" : "transparent",
                color:
                  currentPage === number + 1 ? "primary.contrastText" : "inherit",
                "&:hover": {
                  backgroundColor:
                    currentPage === number + 1 ? "primary.dark" : "action.hover",
                },
                mx: 0.5, // Add some margin for spacing
                border: currentPage === number + 1 ? '2px solid primary.dark' : '1px solid rgba(0, 0, 0, 0.23)', // Adjust for your theme
                boxShadow: currentPage === number + 1 ? 'palette.primary.main' : 'none', // Optional: adds a glow effect for the current page
              }}
            >
              {number + 1}
            </IconButton>
          ))}
        </Box>

        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRightIcon />}
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Box>

      {/* Import to CSV button. Shows up when at least one client is selected  */}
      {selected.length > 0 && (
        <Button onClick={handleExportSelected} style={{ margin: "10px 0" }}>
          Export selected to CSV
        </Button>
      )}
    </React.Fragment>
  );
}
