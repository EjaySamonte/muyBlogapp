import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { clearUser } from "../features/auth/authSlice";
import { logoutUser } from "../features/auth/authService";
import '../pages/HomeDashboard.css';

export default function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const dropdown = React.useRef<HTMLDivElement>(null);

    const user = useSelector((state: RootState) => state.auth.user);

    const isLogout = async () => {
            const success = await logoutUser();
            if(success) {
                console.log("Logged out successfully");
                navigate('/')
            } else {
                console.error("Logout failed")
            }
        };

    React.useEffect(() => {
        const click = (event: MouseEvent) => {
            if (dropdown.current && !dropdown.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", click);
        return () => {
            document.removeEventListener("mousedown", click);
        };
    }, []);
    return (
        <div className="thisbody">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
            <header className="header">
                <i className='bxr bx-menu' id="menu-icon"></i>
                <nav className="navbar">
                    <a onClick={() => navigate('/dashboard')} className="dashboardhome">Home</a>
                    {/* <a href="about">About</a> */}
                    <div className="profileMenu" ref={dropdown}><i className="fas fa-user-circle profileIcon" onClick={() => setOpen(!open)}></i>
                    {open && (
                        <ul className="dropdown">
                            <li onClick={() => navigate('/createblog')}>Create new blog</li>
                            <li onClick={() => navigate('my-blogs')}>View your blog</li>
                            <li onClick={isLogout}>Logout</li>
                        </ul>
                    )}
                    </div>
                </nav>
            </header>
            <Outlet />
        </div>
    )
}