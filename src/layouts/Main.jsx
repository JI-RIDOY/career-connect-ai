import React from 'react';
import Navbar from '../shared/Navbar';
import { Outlet } from 'react-router';

const Main = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    );
};

export default Main;