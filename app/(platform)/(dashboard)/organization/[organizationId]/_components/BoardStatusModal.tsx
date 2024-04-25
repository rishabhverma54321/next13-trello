
'use client'

import { set } from "lodash";

import { useState } from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import { CircleEllipsis } from "lucide-react";
import { useRouter } from "next/router";
function Modal({boardId}:any) {
  
const [checked, setChecked] = useState(false)

  

  const handleCheckbox = ()=>{
    
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

return(
    <>

    <div>

    {/* <input style = {{height:'20px'}}  type="checkbox" onChange={handleCheckbox}></input> */}

    <Dropdown  showArrow
      radius="sm"
      classNames={{
        base: "before:bg-default-200", // change arrow background
        content: "p-0 border-small border-divider bg-background",
      }}>
      <DropdownTrigger>
        <Button 
          variant="bordered" 
          style={{ color: "#fff" }}
        >
          <CircleEllipsis/>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        
        <DropdownItem key="edit" onClick={handleCheckbox}>Mark As completed</DropdownItem>
        
      </DropdownMenu>
    </Dropdown>

    {checked ?(    
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
              onClick={()=>handleCompletedClick(boardId)}
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
             Yes
            </button>

          </div>
        </div>
      </div>
    </div>
  ): null}

</div>
    
    </>
    
)




}


export default Modal;