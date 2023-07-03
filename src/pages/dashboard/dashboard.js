import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar";
// import Dropdown from "../../components/dropdown";

const Dashboard = ({setActivePage}) => {


  useEffect(()=>{
    setActivePage('dashboard')
  },[])

  return (
    <div>
      {/* dashboard */}
      {/* <Sidebar /> */}
      {/* <Dropdown /> */}
    </div>
  );
};

export default Dashboard;
