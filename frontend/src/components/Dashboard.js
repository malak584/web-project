import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

function Dashboard() {
    return (
        <div className="dashboard d-flex vh-100">
            {/* Sidebar */}
            <div className="sidebar bg-dark text-white p-3">
                <h2 className="text-center">Dashboard</h2>
                <ul className="nav flex-column">
                    <li className="nav-item"><a className="nav-link text-white" href="#">Home</a></li>
                    <li className="nav-item"><a className="nav-link text-white" href="#">Analytics</a></li>
                    <li className="nav-item"><a className="nav-link text-white" href="#">Reports</a></li>
                    <li className="nav-item"><a className="nav-link text-white" href="#">Settings</a></li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="content flex-grow-1 d-flex flex-column">
                <div className="navbar bg-light d-flex justify-content-between align-items-center p-3 shadow-sm w-100">
                    <h1 className="m-0">Welcome, User</h1>
                    <div className="profile-icon">
                        <img src="profile-icon.png" alt="Profile Icon" className="rounded-circle border border-secondary img-fluid" width="50" height="50" />
                    </div>
                </div>

                <div className="main-content flex-grow-1 p-4">
                    <h2>Main Content</h2>
                    <p>This is the main content area of the dashboard.</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
