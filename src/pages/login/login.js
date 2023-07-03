// import React, { useState } from "react";
// import "./css/main.css";
// import "./css/util.css";

// const LoginForm = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleEmailChange = (event) => {
//     setEmail(event.target.value);
//   };

//   const handlePasswordChange = (event) => {
//     setPassword(event.target.value);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     // Create an object with the user credentials
//     const credentials = {
//       username: email,
//       password: password,
//     };

//     // Send the login request to the backend
//     fetch("http://localhost/api/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(credentials),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);

//         // Handle the response from the backend
//         if (data.status === 200) {
//           // Login successful, redirect to the dashboard page
//           window.location.href = "../dashboard";
//         } else {
//           // Login failed, display an error message to the user
//           alert("Login failed. Please try again.");
//         }
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         alert("An error occurred. Please try again later.");
//       });
//   };

//   return (
//     <div className="limiter">
//       <div className="container-login100">
//         <div className="wrap-login100">
//           <form className="login100-form validate-form" onSubmit={handleSubmit}>
//             <span className="login100-form-title p-b-26">{/* Welcome */}</span>
//             <span className="login100-form-title p-b-48">
//               {/* <i className="zmdi zmdi-font"></i> */}
//               <img src="https://www.finqy.ai/images/logo.svg" alt="Logo" />
//             </span>

//             <div
//               className="wrap-input100 validate-input"
//               data-validate="Valid email is: a@b.c"
//             >
//               <input
//                 className="input100"
//                 type="text"
//                 name="email"
//                 id="email"
//                 value={email}
//                 onChange={handleEmailChange}
//               />
//               <span className="focus-input100" data-placeholder="Email"></span>
//             </div>

//             <div
//               className="wrap-input100 validate-input"
//               data-validate="Enter password"
//             >
//               <span className="btn-show-pass">
//                 <i className="zmdi zmdi-eye"></i>
//               </span>
//               <input
//                 className="input100"
//                 type="password"
//                 name="pass"
//                 id="password"
//                 value={password}
//                 onChange={handlePasswordChange}
//               />
//               <span
//                 className="focus-input100"
//                 data-placeholder="Password"
//               ></span>
//             </div>

//             <div className="container-login100-form-btn">
//               <div className="wrap-login100-form-btn">
//                 <div className="login100-form-bgbtn"></div>
//                 <button className="login100-form-btn" type="submit">
//                   Login
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;

import React, { useState } from "react";
import "./css/main.css";
import "./css/util.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create an object with the user credentials
    const credentials = {
      username: email,
      password: password,
    };

    // Send the login request to the backend
    fetch(`http://${process.env.REACT_APP_BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log("data.role", data.role);

        // Handle the response from the backend
        if (data.status === 200) {
          // Login successful, store the token in a cookie
          document.cookie = `jwt=${data.jwt}; expires=${new Date(
            data.expiresAt
          )}`;
          document.cookie = `role=${data.role}; expires=${new Date(
            data.expiresAt
          )}`;

          // Redirect to the dashboard page
          window.location.href = "../dashboard";
        } else {
          // Login failed, display an error message to the user
          alert("Login failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      });
  };

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <form className="login100-form validate-form" onSubmit={handleSubmit}>
            <span className="login100-form-title p-b-26">{/* Welcome */}</span>
            <span className="login100-form-title p-b-48">
              {/* <i className="zmdi zmdi-font"></i> */}
              <img src="https://www.finqy.ai/images/logo.svg" alt="Logo" />
            </span>

            <div
              className="wrap-input100 validate-input"
              data-validate="Valid email is: a@b.c"
            >
              <input
                className="input100"
                type="text"
                name="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
              />
              <span className="focus-input100" data-placeholder="Email"></span>
            </div>

            <div
              className="wrap-input100 validate-input"
              data-validate="Enter password"
            >
              <span className="btn-show-pass">
                <i className="zmdi zmdi-eye"></i>
              </span>
              <input
                className="input100"
                type="password"
                name="pass"
                id="password"
                value={password}
                onChange={handlePasswordChange}
              />
              <span
                className="focus-input100"
                data-placeholder="Password"
              ></span>
            </div>

            <div className="container-login100-form-btn">
              <div className="wrap-login100-form-btn">
                <div className="login100-form-bgbtn"></div>
                <button className="login100-form-btn" type="submit">
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
