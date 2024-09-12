"use client"
import { AppWindow, Menu, Settings, User2 } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Board } from "@prisma/client";
import { OrganizationSwitcher } from "@clerk/nextjs";

// Define interface for board object
interface LocalBoard {
  data: Board[];
}

export const NewSideMenu = ({ data }: LocalBoard) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle the state of isOpen
  };

  return (
    <div className="flex items-end">
      <Button
        onClick={toggleMenu}
        className="z-50 fixed top-10 mt-7 ml-1 bg-transparent"
        
        size="sm"
       >
        <Menu className="h-4 w-4" color="#e5e7eb"/>
      </Button>

      {isOpen && ( // Render the side menu only if isOpen is true
        <div
          style={{ height: "88vh", width: "300px", backgroundColor: "white"}}
        >
          {/* Your side menu content */}
          <nav className="z-50 top-0 p-4 w-full border-b shadow-sm bg-white">
            {/* OrganizationSwitcher component */}
            <div className="flex-column items-center gap-x-4">
              <OrganizationSwitcher
                hidePersonal
                afterCreateOrganizationUrl="/organization/:id"
                afterLeaveOrganizationUrl="/select-org"
                afterSelectOrganizationUrl="/organization/:id"
                appearance={{
                  elements: {
                    rootBox: {
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "5px",
                      fontSize: "40px",
                    },
                  },
                }}
              />
            </div>
            

          </nav>

          <div
            className="flex items-start"
            style={{
              flexDirection: "column",
              gap: "15px",
              marginTop: "20px",
              paddingLeft: "20px",
              paddingTop: "20px",
            }}
          >
            {/* Menu buttons */}
            <button style={{ display: "flex", gap: "15px" }}>
              <AppWindow /> Board
            </button>

            <button style={{ display: "flex", gap: "15px" }}>
              <User2 /> Member
            </button>

            <button style={{ display: "flex", gap: "15px" }}>
              <Settings /> Workspace Setting
            </button>
            
          </div>

          <div
            className="flex items-start"
            style={{
              flexDirection: "column",
              gap: "15px",
              marginTop: "40px",
              paddingLeft: "20px",
            }}
          >
            <h3 className="text-xl font-semibold">Your Projects</h3>
            {/* Board list */}
            {data.map((board, i) => (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    fontSize: "20px",
                    fontWeight: "normal",
                  }}
                >
                  <div className="w-7 h-7 relative">
                    <Image
                      fill
                      src={board.imageThumbUrl}
                      alt="Organization"
                      className="rounded-sm object-cover"
                    />
                  </div>
                  <Link href={`/board/${board.id}`}>{board.title}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
