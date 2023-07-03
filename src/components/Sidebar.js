import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faBars } from "@fortawesome/free-solid-svg-icons";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiTarget, FiUsers } from "react-icons/fi";
import { RiUserSearchFill } from "react-icons/ri";
import { BsPlusCircleFill } from "react-icons/bs";
import { TbReportMoney, TbHierarchy3 } from "react-icons/tb";
import { FaHistory, FaBoxOpen } from "react-icons/fa";
import { useCookies } from "react-cookie";
import "./Sidebar.css";

import { Link } from "react-router-dom";
// import ActualHistory from "../pages/actualhistory/actualHistory";
// import AddBNumbers from "../pages/addbnumbers/AddBNumbers";
// import AddBusinessTargets from "../pages/addbusinesstargets/Addbusinesstargets";
// import AddNumbers from "../pages/addbnumbers/AddBNumbers";
// import Dashboard from "../pages/dashboard/dashboard";
// import Hierarchy from "../pages/hierarchy/HierarchyCreation";
// import productmasters from "../pages/productmasters/ProductMasters";
// import RoleMaster from "../pages/rolemaster/RoleMaster";
// import TargetHistory from "../pages/target/TargetHistory";
// import UserMaster from "../pages/usermasters/UserMaster";
const Sidebar = ({ activePage }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [isHoverable, setIsHoverable] = useState(false);
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 800);
  const [cookies] = useCookies(["role"]);

  const role = cookies.role;

  useEffect(() => {
    const boxiconsLink = document.createElement("link");
    boxiconsLink.rel = "stylesheet";
    boxiconsLink.href = "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css";
    document.head.appendChild(boxiconsLink);

    const fontAwesomeLink = document.createElement("link");
    fontAwesomeLink.rel = "stylesheet";
    fontAwesomeLink.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    document.head.appendChild(fontAwesomeLink);

    const playfairDisplayLink = document.createElement("link");
    playfairDisplayLink.rel = "stylesheet";
    playfairDisplayLink.href =
      "https://fonts.googleapis.com/css?family=Playfair+Display";
    document.head.appendChild(playfairDisplayLink);
    if (!isOpen) {
      setIsLocked(false);
      setIsHoverable(false);
    }
  }, [isOpen]);

  const toggleLock = () => {
    setIsLocked(!isLocked);
    setIsHoverable(!isLocked);
  };

  const hideSidebar = () => {
    if (isHoverable) {
      setIsOpen(false);
    }
  };

  const showSidebar = () => {
    if (isHoverable) {
      setIsOpen(true);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  // const [activePage, setActivePage] = useState("");
  // const [activePage, setActivePage] = useState(() => {
  //   console.log(
  //     "window.location.pathname",
  //     window.location.pathname.split("/")[1]
  //   );
  //   return window.location.pathname.split("/")[1];
  // });

  // useEffect(() => {
  //   console.log(activePage);
  // }, [activePage]);
  // const [activePage, setActivePage] = useState(""); // Added state for active page
  // useEffect(() => {
  //   // Add the active class to the current active page
  //   const activeLink = document.querySelector(`.link.${activePage}`);
  //   if (activeLink) {
  //     activeLink.classList.add("active");
  //   }
  // }, [activePage]);

  return (
    activePage && <nav className="sidebar locked">
      <div className="logo_items flex">
        <span className="nav_image">
          <img src="https://finqy.ai/images/logo-white.svg" alt="logo_img" />
        </span>
        {/* <i className="bx bx-lock-alt" id="lock-icon" title="Unlock Sidebar"></i>
      <i className="bx bx-x" id="sidebar-close"></i> */}
      </div>

      <div className="menu_container">
        <div className="menu_items">
          <ul className="menu_item">
            <li className="item">
              <Link
                to="/dashboard"
                className={`link flex ${activePage === "dashboard" ? "active" : ""
                  }`}
              // onClick={() => setActivePage("dashboard")}
              >
                <span className="">
                  <GiHamburgerMenu
                    style={{
                      marginRight: "3%",
                      paddingTop: "4px",
                    }}
                  />{" "}
                  Dashboard
                </span>
              </Link>
            </li>

            {(role === "finance_admin" || role === "finance_user") && (
              <li className="item">
                <Link
                  to="/addbusinesstargets"
                  className={`link flex ${activePage === "addbusinesstargets" ? "active" : ""
                    }`}
                // onClick={() => setActivePage("addbusinesstargets")}
                // setActivePage("addbusinesstargets")
                >
                  <span >
                    {" "}
                    <FiTarget
                      style={{
                        marginRight: "3%",
                        paddingTop: "4px",
                      }}
                    />
                    Add Business Targets FY
                  </span>
                </Link>
              </li>
            )}
            {(role === "business_user" ||
              role === "finance_user" ||
              role === "finance_admin") && (
                <li className="item">
                  <Link
                    to="/addnumbers"
                    className={`link flex ${activePage === "addnumbers" ? "active" : ""}`}
                  // onClick={() => setActivePage("addnumbers")}
                  >
                    <span>
                      <BsPlusCircleFill
                        style={{
                          marginRight: "3%",
                          paddingTop: "4px",
                        }}
                      />
                      Add Number
                    </span>
                  </Link>
                </li>
              )}

            {(role === "business_user" ||
              role === "finance_user" ||
              role === "finance_admin") && (
                <li className="item">
                  <Link
                    to="/actualhistory"
                    className={`link flex ${activePage === "actualhistory" ? "active" : ""
                      }`}
                  // onClick={() => setActivePage("addnumbers")}
                  >
                    <span>
                      <BsPlusCircleFill
                        style={{
                          marginRight: "3%",
                          paddingTop: "4px",
                        }}
                      />
                      Actual History
                    </span>
                  </Link>
                </li>
              )}


            {(role === "finance_user" || role === "finance_admin") && (
              <li className="item">
                <Link
                  to="/targethistory"
                  className={`link flex ${activePage === "targethistory" ? "active" : ""
                    }`}
                // onClick={() => setActivePage("targethistory")}
                >
                  <span id="financeadmin">
                    <FaHistory
                      style={{
                        marginRight: "3%",
                        paddingTop: "4px",
                      }}
                    />
                    Target History
                  </span>
                </Link>
              </li>
            )}
            {/* {(role === "business_user" ||
              role === "finance_user" ||
              role === "finance_admin") && (
                <li className="item">
                  <Link
                    to="/reports"
                    className={`link flex ${activePage === "reports" ? "active" : ""
                      }`}
                  // onClick={() => setActivePage("reports")}
                  >
                    <span>
                      <TbReportMoney
                        style={{
                          marginRight: "3%",
                          paddingTop: "4px",
                        }}
                      />
                      Reports
                    </span>
                  </Link>
                </li>
              )} */}
            {/* {role === "finance_admin" && (
              <li className="item">
                <Link
                  to="/usermaster"
                  className={`link flex ${activePage === "um" ? "active" : ""}`}
                  onClick={() => {
                    console.log("Clicked on User Master link");
                    // setActivePage("um");
                  }}
                >
                  <span id="">
                    <FiUsers
                      style={{
                        marginRight: "3%",
                        paddingTop: "4px",
                      }}
                    />
                    User Master
                  </span>
                </Link>
              </li>
            )} */}
            {/* {role === "finance_admin" && (
              <li className="item">
                <Link
                  to="/hierarchy"
                  className={`link flex ${activePage === "hierarchy" ? "active" : ""
                    }`}
                // onClick={() => setActivePage("prodmaster")}
                >
                  <span id="">
                    <TbHierarchy3
                      style={{
                        marginRight: "3%",
                        paddingTop: "4px",
                      }}
                    />
                    Hierarchy Operation
                  </span>
                </Link>
              </li>
            )} */}
            {/* {role === "finance_admin" && (
              <li className="item">
                <Link
                  to="/productmaster"
                  className={`link flex ${activePage === "productmaster" ? "active" : ""
                    }`}
                // onClick={() => setActivePage("productmaster")}
                >
                  <span id="">
                    <FaBoxOpen
                      style={{
                        marginRight: "3%",
                        paddingTop: "4px",
                      }}
                    />
                    Product Master
                  </span>
                </Link>
              </li>
            )} */}
            {/* {role === "finance_admin" && (
              <li className="item">
                <Link
                  to="/rolemaster"
                  className={`link flex ${activePage === "rolemaster" ? "active" : ""
                    }`}
                // onClick={() => setActivePage("rolemaster")}
                >
                  <span id="">
                    <RiUserSearchFill
                      style={{
                        marginRight: "3%",
                        paddingTop: "4px",
                      }}
                    />
                    Role Master
                  </span>
                </Link>
              </li>
            )} */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
