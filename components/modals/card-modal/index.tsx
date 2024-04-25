"use client";

import { useQuery } from "@tanstack/react-query";

import { CardWithList } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { AuditLog, Comment, File } from "@prisma/client";
import { useCardModal } from "@/hooks/use-card-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./actions";
import { Activity } from "./activity";
import { useEffect, useState } from "react";
import { Comments } from "./comments";
import Attachment from "./Attachment";
import {useDropzone} from 'react-dropzone'
import { useCallback } from "react";

export const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);
  const [timer, setTimer] = useState(true)
  const [fetchLogs, setFetchLogs] = useState(false)
  const [latestLogDate, setLatestLogDate] = useState(new Date());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [downloadUrl, setdownloadUrl] = useState<string>("");
  const [dragging, setDragging] = useState(false)

  
  const [trash, setTrash] = useState(true);

  // const onDrop = useCallback((acceptedFiles:File)=> {
  //   // Do something with the files
  //   setSelectedFile(acceptedFiles)
  //   console.log("File dropped", acceptedFiles)
  //   if(selectedFile){
  //   console.log("Selected files", selectedFile)
  // }else{
  //   console.log("Files not set")
  // }
  // }, [])
  // const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  useEffect(() => {
    setTrash(!trash)
    console.log("From index.tsx => ", downloadUrl);
  }, [downloadUrl])
  
 


  const getAuditLogs = () =>{
    setFetchLogs(true);
    setTimer(true);
    setLatestLogDate(new Date());
  }

  const setDefault = () =>{
    setTimer(false);
    setFetchLogs(false)
    setLatestLogDate(new Date());
  }
  
  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ["card", id],
    queryFn: () => fetcher(`/api/cards/${id}`),
    enabled: isOpen,
  });

  
  const { data: commentdata } = useQuery<Comment[]>({
    queryKey: ["comment", id],
    queryFn: () => fetcher(`/api/cards/${id}/comments`),
  });


  const { data: auditLogsData } = useQuery<AuditLog[]>({
    queryKey: ["card-logs", id],
    queryFn: () => fetcher(`/api/cards/${id}/logs`),
    enabled: isOpen || fetchLogs,
    refetchInterval: timer ? 2000 :false
  });

  useEffect(() => {
    let handleTimeout: NodeJS.Timeout;
    if(isOpen && timer && auditLogsData){
      const currentLogDate = auditLogsData && auditLogsData[0]?.updatedAt ? new Date(auditLogsData[0].updatedAt) : new Date(latestLogDate);
      if ( currentLogDate <= latestLogDate) {
        handleTimeout = setTimeout(setDefault, 6000);
      }else{
        setDefault();
      }
    }


 
    
    return () => {
      clearTimeout(handleTimeout);
      !isOpen && setTimer(true);
      !isOpen && setFetchLogs(false)
    } // Cleanup timeout
  }, [timer, isOpen,fetchLogs, auditLogsData]);


  const onDragOver = (e:any) => {
    // e.preventDefault(); // Prevent default behavior to allow dropping
    // setDragging(true)
    // console.log("Files Dragging");

    // console.log("drag over");
 
  };

  const onDragEnd = () => {
  
    // setDragging(false)
    // console.log("Files stopped Dragging");

    console.log("drag end")
 
  };

  const onDragleave= (e : any)  => {
   // Prevent default behavior to allow dropping
    // setDragging(false)
    // console.log("Files stopped Dragging");

    // console.log("file => ", e.target)

    console.log("drag leave")
 
  };

  const onDragCaptureHandler = () => {
    console.log("onDragCaptureHandler")
  }


  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      
    >
         <div onDragCapture={onDragCaptureHandler} onDragOver={onDragOver} onDragLeave={onDragleave} onDragEnd={onDragEnd}>


        {!dragging ? (
          <DialogContent className="h-[80vh] overflow-y-auto">

           {!cardData
             ? <Header.Skeleton />
             : <Header data={cardData} getAuditLogs={getAuditLogs}/>
           }
           <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
             <div className="col-span-3">
               <div className="w-full space-y-6">
                 {!cardData
                   ? <Description.Skeleton />
                   : <Description data={cardData} getAuditLogs={getAuditLogs}/>
                 }
   
                 {/* {downloadUrl != ""?(<Attachment selectedFile ={selectedFile} downloadURL={downloadUrl} />):null}
                  */}
               {/* { downloadUrl && <Attachment selectedFile ={selectedFile} downloadURL={downloadUrl} files={filedata} />} */}
   
               {!id
                   ? null
                   : <Attachment selectedFile ={selectedFile} downloadURL={downloadUrl} id={id} />
                 }
               
                 
                 {!cardData || !commentdata
                  ? <Comments.Skeleton />
                  : <Comments data={cardData} items={commentdata} /> 
                }
   
                 {!auditLogsData
                   ? <Activity.Skeleton />
                   : <Activity items={auditLogsData} />
                  }
   
                 
                 
                 
               </div>
             </div>
             {!cardData
               ? <Actions.Skeleton />
               : <Actions setSelectedFile={setSelectedFile} data={cardData} setdownloadUrl={setdownloadUrl}/>
              }
         
 
           </div>
        
         </DialogContent>
        ):(
          <DialogContent className="h-[80vh] overflow-y-auto">
            <h1>Drop your files here</h1>
            <input type="file" height={"100%"} width={"100%"} style={{backgroundColor: "red"}} />
          </DialogContent>
        )}
         
        </div>
    
    </Dialog>
  );
};
