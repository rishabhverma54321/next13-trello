import { db } from "@/lib/db";
import { Navbar } from "./_components/navbar";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import { AppWindow, Settings, User2 } from "lucide-react";
import { Board } from "@prisma/client";
import Link from "next/link";
import { NewSideMenu } from "./_components/NewSideMenu";

const DashboardLayout = async ({
  children
}: {
  children: React.ReactNode,
}) => {

  const { orgId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const boards = await db.board.findMany({
    where: {
      orgId: orgId
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  // // console.log(boards)

  return (
    <div className="h-full">

      <div className="h-full">
        <Navbar />
        <div className="h-full flex flex-row">
          {/* <NewSideMenu data={boards}/> */}
          
          {children}
        </div>
      </div>


    </div>


  );
};

export default DashboardLayout;
