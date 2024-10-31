import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  styled,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const StyledAppBar = styled(AppBar)({
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(8px)",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
});

const StyledIconButton = styled(IconButton)({
  color: "#666",
  marginRight: "8px",
  "&:hover": {
    color: "#333",
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
});

const pageTitles: { [key: string]: string } = {
  "/": "Home",
  "/application": "Application",
  "/privacy-policy": "Privacy Policy",
  "/terms-of-service": "Terms of Service",
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useContext(AuthContext);

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  if (!auth) {
    throw new Error("Navbar must be used within an AuthProvider");
  }

  const { logout } = auth;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  // Only show navbar when not on login, register, privacy policy or terms of service pages
  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/privacy-policy" ||
    location.pathname === "/terms-of-service"
  ) {
    return null;
  }

  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <StyledIconButton onClick={() => navigate(-1)} aria-label="back">
          <ArrowBackIcon />
        </StyledIconButton>

        <StyledIconButton onClick={() => navigate("/")} aria-label="home">
          <HomeIcon />
        </StyledIconButton>

        <Typography
          variant="h6"
          sx={{
            marginLeft: 2,
            color: "#333",
            fontWeight: 500,
            fontSize: "1.1rem",
          }}
        >
          {pageTitles[location.pathname] || ""}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* Application Button */}
        <StyledIconButton
          onClick={() => navigate("/application")}
          aria-label="application"
        >
          <AssignmentIcon />
        </StyledIconButton>

        {/* Dashboard Button */}
        <StyledIconButton
          onClick={() => navigate("/dashboard")}
          aria-label="dashboard"
        >
          <DashboardIcon />
        </StyledIconButton>

        {/* More Options Menu */}
        <StyledIconButton
          onClick={handleMenuOpen}
          aria-label="more"
          aria-controls="menu-appbar"
          aria-haspopup="true"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#666">
            <circle cx="12" cy="6" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="18" r="2" />
          </svg>
        </StyledIconButton>

        <Menu
          id="menu-appbar"
          anchorEl={menuAnchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
