import React from "react";
import DashboardBox from "./_components/DashboardBox";

function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar / Dashboard Menu */}
      <div className="md:w-64 flex-shrink-0">
        <DashboardBox />
      </div>

      {/* Main Content */}
      <div className="flex-1 mx-5 md:mx-10 lg:mx-20 py-5">
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
