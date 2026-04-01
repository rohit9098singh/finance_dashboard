"use client";

import dynamic from "next/dynamic";

const DashBoard = dynamic(() => import("./DashBoard"), { ssr: false });

const DashBoardHOC = () => {
    return (
        <DashBoard />
    );
};

export default DashBoardHOC;