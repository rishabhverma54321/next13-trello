"use client";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import { useEffect, useState } from "react";

import { db } from "@/lib/db";

import { BoardNavbar } from "./_components/board-navbar";
import { useAction } from "@/hooks/use-action";
import { getBoard } from "@/actions/get-board";
import Image from "next/image";

// export async function generateMetadata({
//   params,
// }: {
//   params: { boardId: string };
// }) {
//   const { orgId } = auth();

//   if (!orgId) {
//     return {
//       title: "Board",
//     };
//   }

//   const board = await db.board.findUnique({
//     where: {
//       id: params.boardId,
//       orgId,
//     },
//   });

//   return {
//     title: board?.title || "Board",
//   };
// }

const BoardIdLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) => {

  const { execute, data, isLoading } = useAction(getBoard, {
    onError: () => {
      if (!data) {
        notFound();
      }
    },
  });

  useEffect(() => {
    execute({ boardId: params.boardId });
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white min-h-full flex justify-center items-center">
        <Image
          src="/loader.svg"
          alt="Hero"
          className=""
          width={200}
          height={200}
        />
      </div>
    );
  }

  if (data) {
    return (
      <div
        className="relative h-full bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${data.imageFullUrl})` }}
      >
        <BoardNavbar data={data} />
        <div className="absolute inset-0 bg-black/10" />
        <main className="relative pt-28 h-full">{children}</main>
      </div>
    );
  }

  return <></>;
};

export default BoardIdLayout;
