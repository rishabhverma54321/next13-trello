"use client"
import { useAction } from '@/hooks/use-action';
import { db } from '@/lib/db';
import { user } from '@nextui-org/react';
import { Organization, User } from '@prisma/client';

import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useQueryClient } from "@tanstack/react-query";
import { RemoveMember } from '@/actions/remove-member/schema';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { removeMember } from '@/actions/remove-member';

interface Memberdata {
    membersData: any,
    boardId: string,
    setShowModel: Function
}

export const ShowMember =  ({ membersData, boardId, setShowModel }: Memberdata) => {

    const queryClient = useQueryClient();

    const disableAdding = () => {
        setShowModel(false)
    }



    const { execute, fieldErrors } = useAction(removeMember, {
        onSuccess: (result) => {
            // queryClient.invalidateQueries({
            //     queryKey: ["board", result.boardId],
            // });
            // queryClient.invalidateQueries({
            //     queryKey: ["users", result.userId]
            // });
            toast.success(`User removed`);
            disableAdding();
        },
        onError: (error) => {
            toast.error(error);
        },

        

    });



    const handleAddToProject = (userId: string) => {
        console.log("selected userID", userId)
        console.log("Selected board Id", boardId)

        execute({
            userID: userId,
            id: boardId

        })

        console.log("User removed")

    }


    return (
        <div className="fixed z-50 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="p-8 border w-1/3 shadow-lg rounded-md bg-white divide-y-2 ">

                <div className='flex flex-row justify-between'>
                <div className="text-left ">
                    <h3 className="text-2xl font-bold text-gray-900">Members</h3>
                    {/* <p className="text-lg text-black-500">View members and manage project</p> */}
                </div>

                <div >
                    <X onClick={disableAdding}/>
                </div>
                </div>
            

                <div>
                    <ol className='mt-6 space-y-4 ps-4'>
                        {membersData.map((users: any) => (
                            <li key={users.id} className="flex-column items-center  gap-x-2">
                                <div className="flex items-center justify-between gap-x-2">



                                    <div className="flex gap-x-2">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage className="rounded-full" src={users.image} />
                                        </Avatar>

                                        <div className=" flex flex-col gap-y-1 ">

                                            <span style={{ fontSize: 16 }} className="font-xl font-bold text-black">{users.name}</span>
                                            <span style={{ fontSize: 12 }} className="font-xl  text-black">{users.email}</span>

                                        </div>
                                    </div>


                                    <div className='justify-end'> {/* Moved the button here */}

                                        <button onClick={() => handleAddToProject(users.id)} className="bg-rose-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                            Remove from Project
                                        </button>

                                    </div>

                                </div>


                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    )
}

