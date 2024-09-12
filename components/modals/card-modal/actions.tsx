"use client";

import { toast } from "sonner";
import { Copy, Trash, Paperclip } from "lucide-react";
import { useParams } from "next/navigation";

import { CardWithList } from "@/types";
import { useAction } from "@/hooks/use-action";
import { copyCard } from "@/actions/copy-card";
import { Button } from "@/components/ui/button";
import { deleteCard } from "@/actions/delete-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCardModal } from "@/hooks/use-card-modal";
import { useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "@/firebaseConfig";
import { createFile } from "@/actions/create-file";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

interface ActionsProps {
  data: CardWithList;
  setSelectedFile:Function
  setdownloadUrl: Function
};

export const Actions = ({
  data,
  setSelectedFile,
  setdownloadUrl

}: ActionsProps) => {
  const params = useParams();
  const cardModal = useCardModal();
  const queryClient = useQueryClient();


  const { execute, fieldErrors } = useAction(createFile, {
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ["Files", result.cardId],
      });
     
      setdownloadUrl(result.downloadUrl)
      toast.success(`File "${result.fileName}" Uploaded`);
     
    },
    onError: (error) => {
      toast.error(error);
    },
  
  });

  const Storage = getStorage(app)
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);


  const handleFileInputChange =  (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    // Do something with the selected file

    if(file){
      setSelectedFile(file)
      uploadFile(file)
    }
  };




  const uploadFile = (file: any) => {
    const metadata = {
      contentType: file.type
    }


    const storageRef = ref(Storage, 'file-upload/' + file?.name)
    const uploadTask = uploadBytesResumable(storageRef, file, metadata)

    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');


        console.log("progress => ", progress, typeof progress);

        if(progress == 100){
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            
            execute({
              cardId: data.id,
              downloadUrl: downloadURL,
              fileName: file.name
            })
          });
        }


      })

     

  }



  const handleButtonClick = () => {
    (fileInputRef.current as HTMLInputElement)?.click();
  };

  const {
    execute: executeCopyCard,
    isLoading: isLoadingCopy,
  } = useAction(copyCard, {
    onSuccess: (data) => {
      toast.success(`Card "${data.title}" copied`);
      cardModal.onClose();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const {
    execute: executeDeleteCard,
    isLoading: isLoadingDelete,
  } = useAction(deleteCard, {
    onSuccess: (data) => {
      toast.success(`Card "${data.title}" deleted`);
      cardModal.onClose();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onCopy = () => {
    const boardId = params.boardId as string;

    executeCopyCard({
      id: data.id,
      boardId,
    });
  };

  const onDelete = () => {
    const boardId = params.boardId as string;

    executeDeleteCard({
      id: data.id,
      boardId,
    });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">
        Actions
      </p>
      <Button
        onClick={onCopy}
        disabled={isLoadingCopy}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button
        onClick={onDelete}
        disabled={isLoadingDelete}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Trash className="h-4 w-4 mr-2" />
        Delete
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />



      <Button
        onClick={handleButtonClick}
        // disabled={isLoadingDelete}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Paperclip className="h-4 w-4 mr-2" />
        Attachment

      </Button>






    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
