import Bottombar from "@/components/Bottombar/Bottombar";
import Sidebar from "@/components/Sidebar/Sidebar";
import React from "react";

const MainLayout = ({ children }) => {
  return (
    <>
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="lg:pl-64 md:pl-20 h-full pb-20">
        <div className="h-full max-w-[1056px] mx-auto pt-6">{children}</div>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 w-full">
        <Bottombar />
      </div>
    </>
  );
};

export default MainLayout;
