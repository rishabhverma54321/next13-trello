"use client";
import { useEffect, useState } from "react";

import { ListContainer } from "./_components/list-container";
import { useAction } from "@/hooks/use-action";
import { getList } from "@/actions/get-list";
import { useCardModal } from "@/hooks/use-card-modal";

interface BoardIdPageProps {
  params: {
    boardId: string;
  };
}

const BoardIdPage = ({ params }: BoardIdPageProps) => {
  const isOpen = useCardModal((state) => state.isOpen);

  const { execute, data } = useAction(getList);

  const boardUpdate = () => {
    execute({
      boardId: params.boardId,
    });
  };

  useEffect(() => {
    if (!isOpen) {
      boardUpdate();
    }
  }, [isOpen]);

  if (data) {
    return (
      <div className="p-4 h-full overflow-x-auto">
        <ListContainer boardId={params.boardId} data={data} boardUpdate={boardUpdate} />
      </div>
    );
  }

  return <></>;
};

export default BoardIdPage;

BoardIdPage.Skeleton = function ActivitySkeleton() {
  return (
    <div className="flex flex-wrap min-h-52 ms-2 gap-8 mt-7 justify-start">
      <div className="card bg-white shadow rounded-lg p-28 animate-pulse">
        <div className="h-8 bg-gray-200 w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-200 w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 w-2/3"></div>
      </div>

      <div className="card bg-white shadow rounded-lg p-28 animate-pulse">
        <div className="h-8 bg-gray-200 w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-200 w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 w-2/3"></div>
      </div>
      <div className="card bg-white shadow rounded-lg p-28 animate-pulse">
        <div className="h-8 bg-gray-200 w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-200 w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 w-2/3"></div>
      </div>
      <div className="card bg-white shadow rounded-lg p-28 animate-pulse">
        <div className="h-8 bg-gray-200 w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-200 w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 w-2/3"></div>
      </div>
    </div>
  );
};
