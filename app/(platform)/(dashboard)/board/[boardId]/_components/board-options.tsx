"use client";

import { toast } from "sonner";
import { MoreHorizontal, X } from "lucide-react";

import { deleteBoard } from "@/actions/delete-board";
import { useAction } from "@/hooks/use-action";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import AddMembers from "../../../organization/[organizationId]/_components/AddMembers";
import { useState } from "react";
import { Boardusers } from "@prisma/client";

import { ShowMember } from "./show-member";

interface BoardOptionsProps {
  id: string;
  memberData: Boardusers
};

export const BoardOptions = ({ id, memberData}: BoardOptionsProps) => {

  const { execute, isLoading } = useAction(deleteBoard, {
    onError: (error) => {
      toast.error(error);
    }
  });

  const [showmodal, setShowModel] = useState(false);
  const [button, setbutton] = useState(false);


  const onDelete = () => {
    execute({ id });
  };

  const addMember = ()=>{
    setShowModel(true)
    setbutton(true)
  }

  return (
    <>
    <div>
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="px-0 pt-3 pb-3" 
        side="bottom" 
        align="start"
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Board actions
        </div>
        <PopoverClose asChild>
          <Button 
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          variant="ghost"
          onClick={onDelete}
          disabled={isLoading}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
        >
          Delete this board
        </Button>
        <Button
          variant="ghost"
          onClick={addMember}
          disabled={isLoading}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
        >
          Show Members
        </Button>
      </PopoverContent>
    </Popover>
   
    {showmodal?(<ShowMember  membersData ={memberData} boardId={id} setShowModel={setShowModel} />):null}
    </div>
    </>
  );
};
