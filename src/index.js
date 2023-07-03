import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import ActualHistory from "./pages/actualhistory/actualHistory";
// import AddBNumbers from "./pages/addbnumbers/AddBNumbers";
import Addbusinesstargets from "./pages/addbusinesstargets/Addbusinesstargets";
import AddNumbers from "./pages/addnumbers/AddNumbers";
import Dashboard from "./pages/dashboard/dashboard";
import Hierarchy from "./pages/hierarchy/HierarchyCreation";
import Login from "./pages/login/login";
import ProductMaster from "./pages/productmaster/productmaster";
// import RoleMaster from "./pages/rolemaster/RoleMaster";
import TargetHistory from "./pages/target/TargetHistory";
// import UserMasters from "./pages/usermasters/UserMaster";
import Sidebar from "./components/Sidebar";
import { PrivateRoute } from "./utils/private-route.utils";
// import UM from "./pages/um/UM";

const Layout = ({ activePage }) => {
  return (
    <>
      <Sidebar activePage={activePage} />
      <Outlet />
    </>
  );
};



function App() {

  const [activePage, setActivePage] = useState("");

  useEffect(()=>{
    console.log('ac',activePage)
  },[activePage])

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout activePage={activePage} />}>
          <Route path="/" element={<PrivateRoute />} >
            <Route path="/actualhistory" element={<ActualHistory setActivePage={setActivePage} />} />
            {/* <Route path="/addbnumbers" element={<AddBNumbers setActivePage={setActivePage} /> }/> */}
            <Route path="/addbusinesstargets" element={<Addbusinesstargets setActivePage={setActivePage} />} />
            <Route path="/addnumbers" element={<AddNumbers status="actual" setActivePage={setActivePage} />} />
            <Route path="/dashboard" element={<Dashboard setActivePage={setActivePage} />} />
            <Route path="/hierarchy" element={<Hierarchy setActivePage={setActivePage} />} />
            {/* <Route path="/productmaster" element={<ProductMaster setActivePage={setActivePage} />} /> */}
            {/* <Route path="/rolemaster" element={<RoleMaster setActivePage={setActivePage} />} /> */}
            <Route path="/targethistory" element={<TargetHistory status="target" setActivePage={setActivePage} />} />
            {/* <Route path="/usermaster" element={<UserMasters setActivePage={setActivePage} />} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);