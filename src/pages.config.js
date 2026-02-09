/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AICodingToolsComparison from './pages/AICodingToolsComparison';
import AdminDashboard from './pages/AdminDashboard';
import Bookmarks from './pages/Bookmarks';
import BuildVSBuyMatrix from './pages/BuildVSBuyMatrix';
import CloudRegulationsMap from './pages/CloudRegulationsMap';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Scorecard from './pages/Scorecard';
import UserSettings from './pages/UserSettings';
import ExecutiveDecisionTool from './pages/ExecutiveDecisionTool';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AICodingToolsComparison": AICodingToolsComparison,
    "AdminDashboard": AdminDashboard,
    "Bookmarks": Bookmarks,
    "BuildVSBuyMatrix": BuildVSBuyMatrix,
    "CloudRegulationsMap": CloudRegulationsMap,
    "Dashboard": Dashboard,
    "Home": Home,
    "Scorecard": Scorecard,
    "UserSettings": UserSettings,
    "ExecutiveDecisionTool": ExecutiveDecisionTool,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};