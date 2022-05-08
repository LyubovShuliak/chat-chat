import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import "./spiner.css";

export default function Spinner() {
  return (
    <div className="spinerOverlay">
      {" "}
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    </div>
  );
}
