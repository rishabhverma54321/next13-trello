"use client"

import { useCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { AuditLog, Board } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Bell, CalculatorIcon } from "lucide-react";
import { NotificationItem } from "./NotificationWidget";
import { Avatar, AvatarImage, } from "@/components/ui/avatar";
import { generateLogMessage } from "@/lib/generate-log-message";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Plus } from "lucide-react";
import { Badge } from "@nextui-org/badge";






const NotificationActivity = () => {

    const [checked, setChecked] = useState(false)
    const [timeElapsed, setTimeElapsed] = useState<string>("");

    const handleCheckbox = () => {

        setChecked(true)

        if (checked) {
            setChecked(false)
        }
    }
    // const id = useCardModal((state) => state.id);
    const [notificationLog, setNotificationLog] = useState<AuditLog[]>([]);
    const [Boards, setBoard] = useState<Board[]>([]);

    // Define a query to fetch the audit log data
    const { data } = useQuery<AuditLog[]>({
        queryKey: ["Notification-logs"],
        queryFn: () => fetcher(`/api/Notification`),
        refetchInterval: 2000

    });



    // Update the component state with fetched data
    useEffect(() => {
        if (data) {
            console.log(data)
            setNotificationLog(data);


        }



    }, [data]);



    const calculateTimeElapsed = (createdAt: Date) => {
        return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
    };






    const handleNotificationClick = async (notificationId: any) => {

        try {
            await fetch("/api/Markread", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ notificationId }),


            });


            // Refetch data after marking notification as read
            // await refetch();
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }

    };


    // Render the fetched audit log data
    return (
        <>

            <div>

                <button onClick={handleCheckbox} style={{marginTop:"14px", marginLeft:"10px"}}>

                    
                        <Bell />
                        {notificationLog.filter(item => !item.isRead).length > 0 && (
                        <span className="bg-red-500 text-white rounded-full px-2 py-1 relative -top-2 -right-2">
                            {notificationLog.filter(item => !item.isRead).length}
                        </span>
                    )}

{/* <Badge content={notificationLog.filter(item=> !item.isRead).length} color="primary"> </Badge> */}

                </button>


                {/* <div typeof="Button"><Bell/></div> */}
                {checked ? (
                    <div className="fixed right-0 mt-4 h-full ">
                        <div style={{ height: "400px", width: "400px" }} className="p-8 border w-96 shadow-lg rounded-md bg-white overflow-y-auto">


                            <div className="text-center w-full ">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h3>

                                {!data ? (
                                    <>
                                        <div className="mt-2 px-7 py-3">
                                            <p className="text-lg text-black-500">You have no notification yet</p>
                                        </div>
                                        <div className="flex justify-center mt-4">

                                            {/* Using useRouter to dismiss modal*/}
                                            <button
                                                onClick={() => setChecked(false)}
                                                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                            >
                                                Yes
                                            </button>

                                        </div>
                                    </>

                                ) : (<>

                                    <ol className="mt-2 space-y-4 w-full h-full ">


                                        {data.filter(data => !data.isRead).map((item) => (




                                            <div className="flex gap-2 items-center">



                                                <li style={{}} className="flex gap-x-2 w-full"  >
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={item.userImage} />
                                                    </Avatar>

                                                    <div style={{ display: "flex", flexDirection: "column", textAlign: "start", gap: "2px" }}>
                                                        <div className="flex flex-row space-y-0.5">
                                                            <p className="text-m text-muted-foreground text-start">
                                                                <span className="font-semibold lowercase text-neutral-700">
                                                                    {item.userName}
                                                                </span>{" "}
                                                                {generateLogMessage(item)}
                                                            </p>

                                                        </div>
                                                        <p className="text-xs text-muted-foreground">{calculateTimeElapsed(item.createdAt)}</p>
                                                    </div>

                                                </li>


                                                <CheckCircle height={18} className="" visibility={-1} onClick={() => handleNotificationClick(item.id)} />
                                            </div>







                                        ))}
                                    </ol>

                                </>)}

                            </div>
                        </div>
                    </div>
                ) : null}

            </div>

        </>
    );
};

export default NotificationActivity;
