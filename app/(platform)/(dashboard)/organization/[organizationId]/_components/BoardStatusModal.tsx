
'use client'

import { set } from "lodash";

import { useState } from "react";
import { CircleEllipsis } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,

  DropdownMenuSeparator,
 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import AddMembers from "./AddMembers";
import { Organization, User } from "@prisma/client";

interface propsData{
  member? : any,
  boardId: string
}


function Modal({ member, boardId }: propsData) {

  const [checked, setChecked] = useState(false)
  const [showmodal, setShowModel] = useState(false)



  const handleCheckbox = () => {

    setChecked(true)
  }



  const handleCompletedClick = async (boardId: any) => {

    try {
      await fetch("/api/BoardCompleted", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ boardId }),


      });

      window.location.reload();

      // Refetch data after marking notification as read
      // await refetch();
    } catch (error) {
      // console.error("Error marking notification as read:", error);
    }

    setChecked(false)

  };


  const addMembers = () => {
    setShowModel(true)
  }

  return (
    <>

      <div>

        {/* <input style = {{height:'20px'}}  type="checkbox" onChange={handleCheckbox}></input> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <CircleEllipsis style={{ color: "#fff" }} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Board Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleCheckbox}>
                {/* <User className="mr-2 h-4 w-4" /> */}
                <span>Mark as completed</span>

              </DropdownMenuItem>

              <DropdownMenuItem onClick={addMembers}>
                {/* <User className="mr-2 h-4 w-4" /> */}
                <span>Add Members</span>

              </DropdownMenuItem>

            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

      {showmodal?(<AddMembers membersData ={member} boardId={boardId} setShowModel={setShowModel}/>):null}
      
        {checked ? (
          <div className="fixed z-50 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
              <div className="text-center">
                {/* <h3 className="text-2xl font-bold text-gray-900">Modal Title</h3> */}
                <div className="mt-2 px-7 py-3">
                  <p className="text-lg text-black-500">Are you sure you want to mark the board with completed?</p>
                </div>
                <div className="flex justify-center mt-4">

                  {/* Using useRouter to dismiss modal*/}
                  <button
                    onClick={() => handleCompletedClick(boardId)}
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Yes
                  </button>

                </div>
              </div>
            </div>
          </div>
        ) : null}

      </div>

    </>

  )




}


export default Modal;