import useSWR from "swr";
import { useState } from "react";

import { useTheme } from "@mui/material/styles";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

import Layout from "../components/layout/Layout";
import { GetResourcesResponse } from "../entities/resource";
import { RequestError } from "../entities/error";
import fetcher from "../utils/fetcher";

function IndexPage() {
  const [limit, setLimit] = useState<number>(3);
  const theme = useTheme();
  const { data: resourceData, error: resourceError } = useSWR<
    GetResourcesResponse,
    RequestError
  >(`/api/resources?limit=${limit}`, fetcher);

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Yipii, du hast es geschaft das ***STRING_REMOVED***  Template zum laufen zu bringen.
            Wie du dieses Template verwendest kannst du in der Readme.md
            nachlesen.
          </Typography>

          <Box sx={{ width: "100%", my: 4 }}>
            <Divider variant="middle" />
          </Box>

          <Typography variant="h3">
            Hier ist ein Beispiel für einen API request
          </Typography>
          <TextField
            variant="outlined"
            label="Limit"
            type="number"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
          />
          <Typography variant="h5">Antwort:</Typography>

          {!resourceData && !resourceError && <CircularProgress />}
          {resourceData && !resourceError && (
            <Typography variant="caption">
              {JSON.stringify(resourceData, null, 2)}
            </Typography>
          )}
          {resourceError && (
            <Typography
              sx={{ color: theme.palette.error.main }}
              variant="caption"
            >
              {`Error: ${resourceError.info} | Status: ${resourceError.status}`}
            </Typography>
          )}
        </Box>
      </Container>
    </Layout>
  );
}

export default IndexPage;
