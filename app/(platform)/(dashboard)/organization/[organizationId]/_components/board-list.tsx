import Link from "next/link";
import { auth, useOrganizationList, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { HelpCircle, User2, CheckCircle} from "lucide-react";

import { db } from "@/lib/db";
import { Hint } from "@/components/hint";
import { Skeleton } from "@/components/ui/skeleton";
import { FormPopover } from "@/components/form/form-popover";
import { MAX_FREE_BOARDS } from "@/constants/boards";
import { getAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";
import Modal from "./BoardStatusModal";


import { useEffect, useState } from "react";
import { Board } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";

export const BoardList = async () => {
  const { orgId, orgRole } = auth();
  if (!orgId) {
    return redirect("/select-org");
  }


  const boards = await db.board.findMany({
    where: {
      orgId,
      completed: false
    },
    orderBy: {
      createdAt: "desc"
    }
  });


  const Completedboards = await db.board.findMany({
    where: {
      orgId,
      completed: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });



  // const { data } = useQuery<Board[]>({
  //   queryKey: ["Notification-logs"],
  //   queryFn: () => fetcher(`/api/BoardCompleted/AllBoards`),
  //   refetchInterval: 2000

  // });


  // const { data:completedProjects } = useQuery<Board[]>({
  //   queryKey: ["Notification-logs"],
  //   queryFn: () => fetcher(`/api/BoardCompleted/CompletedBoards`),
  //   refetchInterval: 2000

  // });




  const availableCount = await getAvailableCount();
  const isPro = await checkSubscription();



  return (

    <div style={{ display: "flex", flexDirection: "column", gap: '30px' }}>
      <div className="space-y-4">


        <div className="flex items-center font-semibold text-lg text-neutral-700">
          <User2 className="h-6 w-6 mr-2" />
          Your Project
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {boards.map((board) => (
            <div className="group relative aspect-video bg-no-repeat bg-center bg-cover rounded-sm h-full w-full p-2 overflow-hidden" style={{ backgroundImage: `url(${board.imageThumbUrl})`, display: "flex", flexDirection: "column", alignItems: "start" }}>
              {/* {(orgRole === 'org:admin') ? <input style = {{height:'20px'}}  type="checkbox" onChange={HandleCheckbox}></input> : null} */}



              <div className="absolute pointer-events-none inset-0 bg-black/30 group-hover:bg-black/40 transition" />

              {/* <div className="flex flex-row "> */}

              <Link
                key={board.id}
                href={`/board/${board.id}`}
                className=""
                style={{ height: "100%", width: "100%" }}
              >

              </Link>
              <div className="flex flex-row justify-between absolute top-1 w-full">
                <p className="relative font-semibold text-white">
                  {board.title}
                </p>

                <p className="mr-3">

                  {(orgRole === 'org:admin') ? (<p><Modal boardId={board.id} /></p>) : null}

                </p>

              </div>
              {/* 
                <p className="">

                  {(orgRole === 'org:admin') ? (<p><Modal boardId={board.id} /></p>) : null}

                </p> */}

              {/* </div> */}
            </div>
          ))}

          <FormPopover sideOffset={10} side="right">
            <div
              role="button"
              className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
            >
              <p className="text-sm">Create new board</p>
              {/* <span className="text-xs">
              {isPro ? "Unlimited" : `${MAX_FREE_BOARDS - availableCount} remaining`}
            </span> */}
              <Hint
                sideOffset={40}
                description={`
                Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace.
              `}
              >
                <HelpCircle
                  className="absolute bottom-2 right-2 h-[14px] w-[14px]"
                />
              </Hint>
              <></>
            </div>
          </FormPopover>


        </div>
      </div>

      {Completedboards ? (


        <>



          <div className="flex items-center font-semibold text-lg text-neutral-700">
            <CheckCircle className="h-6 w-6 mr-2" />
            Completed Project
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Completedboards.map((board) => (

              <div className="group relative aspect-video bg-no-repeat bg-center bg-cover rounded-sm h-full w-full p-2 overflow-hidden" style={{ backgroundImage: `url(${board.imageThumbUrl})`, display: "flex", flexDirection: "column", alignItems: "start" }}>
                {/* {(orgRole === 'org:admin') ? <input style = {{height:'20px'}}  type="checkbox" onChange={HandleCheckbox}></input> : null} */}

                {/* {(orgRole === 'org:admin') ? <Modal boardId={board.id} /> : null} */}

                <div className="absolute pointer-events-none inset-0 bg-black/30 group-hover:bg-black/40 transition" />
                <Link
                  key={board.id}
                  href={`/board/${board.id}`}
                  className=""
                  style={{ height: "100%", width: "100%" }}
                >
                  <p className="relative font-semibold text-white">
                    {board.title}
                  </p>
                </Link>
              </div>
            ))}
          </div>

        </>

      ) : null}

    </div>
  );
};

BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="grid gird-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
    </div>
  );
};
