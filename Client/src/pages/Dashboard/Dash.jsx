import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import NoteSharpIcon from "@mui/icons-material/NoteSharp";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import GroupsIcon from '@mui/icons-material/Groups';
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../Dashboard";
import CreateNotes from "../CreateNotes";
import MyNotes from "../MyNotes";
import ViewNotes from "../ViewNotes";
import Collaborate from "../Collaborate";

const NAVIGATION = [
  { kind: "header", title: "Main items", id: "header-main" },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "newNote",
    title: "Create New",
    icon: <AddIcon />,
  },
  {
    segment: "allNotes",
    title: "My Notes",
    icon: <NoteSharpIcon />,
  },
  { kind: "divider", id: "divider-1" },
  { kind: "header", title: "Exclusive", id: "header-exclusive" },
  {
    segment: "collab",
    title: "Collaborate",
    icon: <GroupsIcon />,
  },
  { kind: "divider", id: "divider-1" },
  { kind: "header", title: "Analytics", id: "header-analytics" },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    id: "nav-reports",
    children: [
      {
        segment: "sales",
        title: "Sales",
        icon: <DescriptionIcon />,
        id: "nav-sales",
      },
      {
        segment: "traffic",
        title: "Traffic",
        icon: <DescriptionIcon />,
        id: "nav-traffic",
      },
    ],
  },
  {
    segment: "integrations",
    title: "Integrations",
    icon: <LayersIcon />,
    id: "nav-integrations",
  },
];

const demoTheme = createTheme({
  cssVariables: { colorSchemeSelector: "data-toolpad-color-scheme" },
  colorSchemes: { light: true, dark: true },
  breakpoints: { values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 } },
});

function DemoPageContent() {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="newNote" element={<CreateNotes />} />
      <Route path="allNotes" element={<MyNotes />} />
      <Route path="allNotes/:title" element={<ViewNotes />} />
      <Route path="collab/*" element={<Collaborate />} />
      <Route path="*" element={<Box>Page Not Found</Box>} />
    </Routes>
  );
}

function DashboardLayoutBasic(props) {
  const { window } = props;
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
        title: "Everwrite - Notes Saver",
      }}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <Box>
          <DemoPageContent />
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutBasic.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutBasic;
