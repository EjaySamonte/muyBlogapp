import { Navigate } from "react-router-dom";
import React from "react";


// export default function Home() {
//     return (
//         <div className="homeDashboard">
//             <h2>Welcome to Home Page</h2>
//         </div>
//     )
// }

export default function Home() {
    const isAuthenticated = localStorage.getItem('token');

    if (!isAuthenticated) {
        return <Navigate to="/dashboard" />
    }
    // return (
    //     <div className="homeDashboard">
    //         <h2>Welcome to Home Page</h2>
    //     </div>
    // )
}