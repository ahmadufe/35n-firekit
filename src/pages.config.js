import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import Scorecard from './pages/Scorecard';
import UserSettings from './pages/UserSettings';


export const PAGES = {
    "AdminDashboard": AdminDashboard,
    "Dashboard": Dashboard,
    "Scorecard": Scorecard,
    "UserSettings": UserSettings,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
};