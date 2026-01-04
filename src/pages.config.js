import Dashboard from './pages/Dashboard';
import UserSettings from './pages/UserSettings';
import Scorecard from './pages/Scorecard';
import AdminDashboard from './pages/AdminDashboard';


export const PAGES = {
    "Dashboard": Dashboard,
    "UserSettings": UserSettings,
    "Scorecard": Scorecard,
    "AdminDashboard": AdminDashboard,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
};