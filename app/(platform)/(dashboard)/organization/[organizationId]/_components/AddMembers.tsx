"use client"
import { useAction } from '@/hooks/use-action';
import { db } from '@/lib/db';
import { user } from '@nextui-org/react';
import { Organization, User } from '@prisma/client';

import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useQueryClient } from "@tanstack/react-query";
import { addMember } from '@/actions/add-boardmember';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface AddMembersData {
    membersData: any,
    boardId: string,
    setShowModel: Function
}

const AddMembers = async ({ membersData, boardId, setShowModel }: AddMembersData) => {

    const queryClient = useQueryClient();

    const disableAdding = () => {
        setShowModel(false)
    }



    const { execute, fieldErrors } = useAction(addMember, {
        onSuccess: (result) => {
            queryClient.invalidateQueries({
                queryKey: ["board", result.boardId],
            });
            queryClient.invalidateQueries({
                queryKey: ["users", result.userId]
            });
            toast.success(`User added`);
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
            boardId: boardId

        })

        console.log("User Added")

    }


    return (
        <div className="fixed z-50 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="p-8 border w-1/3 shadow-lg rounded-md bg-white divide-y-2 ">

                <div className='flex flex-row justify-between'>
                <div className="text-left ">
                    <h3 className="text-2xl font-bold text-gray-900">Members</h3>
                    <p className="text-lg text-black-500">View members and manage project</p>
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

                                            <span style={{ fontSize: 16 }} className="font-medium">{users.name}</span>
                                            <span style={{ fontSize: 12 }} className="font-medium">{users.email}</span>

                                        </div>
                                    </div>


                                    <div className='justify-end'> {/* Moved the button here */}

                                        <button onClick={() => handleAddToProject(users.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                            Add To Project
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

export default AddMembers