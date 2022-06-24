import { lazy } from "react";
import { styled, alpha } from "@mui/material/styles";
import useProfileFeatures from "../../hooks/useProfileFeatures";

const SearchIcon = lazy(() => import("@mui/icons-material/Search"));
const MenuIcon = lazy(() => import("@mui/icons-material/Menu"));
const Drawer = lazy(() => import("@mui/material/Drawer"));
const InputBase = lazy(() => import("@mui/material/InputBase"));
const IconButton = lazy(() => import("@mui/material/IconButton"));
const Toolbar = lazy(() => import("@mui/material/Toolbar"));
const AppBar = lazy(() => import("@mui/material/AppBar"));
const Box = lazy(() => import("@mui/material/Box"));

const Profile = lazy(() => import("../Profile/Profile.component"));

export const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),

  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "gray",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    color: "black",
  },
}));

export default function ChatSearchBar() {
  const { toggleDrawer, state, focusSearchBar, focused } = useProfileFeatures();

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: "transparent" }}>
        <Toolbar>
          <Drawer
            anchor={"left"}
            open={state["left"]}
            onClose={toggleDrawer(false)}
          >
            <Profile />
          </Drawer>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon sx={{ fill: "grey" }} />
          </IconButton>

          <Search
            onClick={focusSearchBar}
            sx={{
              flexGrow: 1,
              backgroundColor: "transparent",
              border: "none",
            }}
          >
            <SearchIconWrapper>
              <SearchIcon sx={{ fill: "grey" }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
