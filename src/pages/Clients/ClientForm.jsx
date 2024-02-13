import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "@mui/joy/Input";
import FormLabel from "@mui/joy/FormLabel";
import Button from "@mui/joy/Button";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import Stack from "@mui/joy/Stack";
import Card from "@mui/joy/Card";
import Textarea from "@mui/joy/Textarea";
import CardOverflow from "@mui/joy/CardOverflow";
import CardActions from "@mui/joy/CardActions";

import { supabaseClient } from "../../supabase-client";

const ClientForm = () => {
  // State to hold client form data, initialized with empty strings for form fields
  const [client, setClient] = useState({
    first_name: "",
    last_name: "",
    address: "",
    email: "",
    phone_number: "",
    notes: "",
    tag: "",
  });
  const { clientId } = useParams(); // Used for edit mode
  console.log("clientId: ", clientId);

  // Hook to programmatically navigate users
  const navigate = useNavigate();

  const supabase = supabaseClient;
  useEffect(() => {
    if (clientId) {
      const fetchClient = async () => {
        let { data, error } = await supabase
          .from("clients")
          .select("*")
          .eq("client_id", clientId)
          .single();

        if (error) {
          console.error("Error fetching client:", error);
        } else {
          setClient({
            first_name: data.first_name,
            last_name: data.last_name,
            address: data.address,
            email: data.email,
            phone_number: data.phone_number,
            notes: data.notes,
            tag: data.tag,
          });
        }
      };

      fetchClient();
    }
  }, [clientId, supabase]); // Dependency array to re-run the effect if clientId changes

  // Updates the client state with form field values on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handles form submission for both adding and editing a client
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updates = {
      first_name: client.first_name,
      last_name: client.last_name,
      address: client.address,
      email: client.email,
      phone_number: client.phone_number,
      notes: client.notes,
      tag: client.tag,
      ...(clientId ? { client_id: clientId } : {}), // Including client_id if in edit mode
    };

    let result = null;

    if (clientId) {
      // Updating an existing client
      result = await supabaseClient
        .from("clients")
        .update(updates)
        .eq("client_id", clientId); // Ensure this uses the correct column name as per your table schema
    } else {
      // Inserting a new client
      result = await supabaseClient.from("clients").insert([updates]);
    }

    if (result.error) {
      console.error("Error adding/editing client:", result.error);
    } else {
      navigate("/clients"); // Navigate back to the clients list after successful operation
      console.log(
        clientId ? "Client updated successfully" : "Client added successfully"
      );
    }
  };
  // The form for adding or editing client details.
  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ flex: 1, width: "100%" }}>
        <Box
          sx={{
            position: "sticky",
            top: { sm: -100, md: -110 },
            bgcolor: "background.body",
            zIndex: 9995,
          }}
        >
          <Box sx={{ px: { xs: 2, md: 6 } }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              //separator={<ChevronRightRoundedIcon fontSize="sm" />}
              sx={{ pl: 0 }}
            >
              <Link underline="none" color="neutral" href="/" aria-label="Home">
                <HomeRoundedIcon />
              </Link>
              <Link
                underline="hover"
                color="neutral"
                href="/clients"
                fontSize={12}
                fontWeight={500}
              >
                Clients
              </Link>
              <Typography color="primary" fontWeight={500} fontSize={12}>
                {clientId ? "Update Client" : "Add Client"}
              </Typography>
            </Breadcrumbs>
            <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
              {clientId ? "Update Client" : "Add Client"}
            </Typography>
          </Box>
        </Box>
        <Stack
          spacing={4}
          sx={{
            display: "flex",
            maxWidth: "900px",
            mx: "auto",
            px: { xs: 2, md: 6 },
            py: { xs: 2, md: 3 },
          }}
        >
          <Card>
            <Box sx={{ mb: 1 }}>
              <Typography level="title-md">Client Information</Typography>
              <Typography level="body-sm">
                Add a client information and other details to your client.
              </Typography>
            </Box>
            <Divider />
            <Stack
              direction="row"
              spacing={3}
              sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
            >
              <Stack direction="column" spacing={1}></Stack>
              <Stack spacing={2} sx={{ flexGrow: 2 }}>
                <Stack direction="row" spacing={2}>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      size="sm"
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={client.first_name}
                      onChange={handleChange} // Pass the event object directly
                      required
                    />
                  </FormControl>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      size="sm"
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={client.last_name}
                      onChange={handleChange} // Pass the event object directly
                      required
                    />
                  </FormControl>
                </Stack>

                <Stack spacing={1.5}>
                  <Box>
                    <FormLabel htmlFor="address">Address</FormLabel>
                    <Input
                      id="address"
                      name="address"
                      value={client.address}
                      onChange={handleChange}
                      required
                    />
                  </Box>
                  <Box>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      id="email"
                      name="email"
                      value={client.email}
                      onChange={handleChange}
                      required
                    />
                  </Box>
                  <Box>
                    <FormLabel htmlFor="phone_number">Phone Number</FormLabel>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      value={client.phone_number}
                      onChange={handleChange}
                      required
                    />
                  </Box>
                  <Box>
                    <FormLabel htmlFor="notes">Notes</FormLabel>
                    <Textarea
                      size="sm"
                      minRows={4}
                      sx={{ flexGrow: 1 }}
                      id="notes"
                      name="notes"
                      value={client.notes}
                      onChange={handleChange}
                      required
                    />
                  </Box>
                  <Box>
                    <FormLabel htmlFor="tag">Tag</FormLabel>
                    <Input
                      id="tag"
                      name="tag"
                      value={client.tag}
                      onChange={handleChange}
                      required
                    />
                  </Box>
                </Stack>
              </Stack>
            </Stack>
            <CardOverflow
              sx={{ borderTop: "1px solid", borderColor: "divider" }}
            >
              <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
                <Button
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button size="sm" variant="solid" type="submit">
                  {clientId ? "Update Client" : "Add Client"}
                </Button>
              </CardActions>
            </CardOverflow>
          </Card>
        </Stack>
      </Box>
    </form>
  );
};

export default ClientForm;

{
  /* <form onSubmit={handleSubmit}>
      <Stack spacing={2} sx={{maxWidth: 600, margin: 'auto'}}> </Stack>
      <Box> 
          <FormLabel htmlFor="first_name">First Name</FormLabel>
          <Input
            id="first_name"
            name="first_name"
            value={client.first_name}
            onChange={handleChange}
            required
          />
        </Box>
        <Box>
          <FormLabel htmlFor="last_name">Last Name</FormLabel>
          <Input
            id="last_name"
            name="last_name"
            value={client.last_name}
            onChange={handleChange}
            required
          />
        </Box>
        <Box>
          <FormLabel htmlFor="address">Address</FormLabel>
          <Input
            id="address"
            name="address"
            value={client.address}
            onChange={handleChange}
            required
          />
        </Box>
        <Box>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            name="email"
            value={client.email}
            onChange={handleChange}
            required
          />
        </Box>
        <Box>
          <FormLabel htmlFor="phone_number">Phone Number</FormLabel>
          <Input
            id="phone_number"
            name="phone_number"
            value={client.phone_number}
            onChange={handleChange}
            required
          />
        </Box>
        <Box>
          <FormLabel htmlFor="notes">Notes</FormLabel>
          <Input
            id="notes"
            name="notes"
            value={client.notes}
            onChange={handleChange}
            required
          />
        </Box>
        <Box>
          <FormLabel htmlFor="tag">Tag</FormLabel>
          <Input
            id="tag"
            name="tag"
            value={client.tag}
            onChange={handleChange}
            required
          />
        </Box>
        <Button type="submit" variant="solid" color="primary" size="lg">
        {" "}
        {clientId ? "Update Client" : "Add Client"}
      </Button>
    </form> */
}
