import React, { useEffect, useState } from 'react';
import { Paperclip } from 'lucide-react';
import Link from 'next/link';
import { File } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { deleteFile } from '@/actions/delete-file';
import { useAction } from '@/hooks/use-action';
import { toast } from 'sonner';
import { useQueryClient } from "@tanstack/react-query";


interface AttachmentProps {
  selectedFile: any;
  downloadURL: string;
  id: string;
}

const Attachment = ({ selectedFile, downloadURL, id }: AttachmentProps) => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const queryClient = useQueryClient();



  const { execute, fieldErrors } = useAction(deleteFile, {
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ["Files", result.cardId],
      });
      const updatedAttachments = attachments.filter(file => file.id !== id);
      // Update the state with the filtered attachments
      setAttachments(updatedAttachments);

      // setdownloadUrl(result.downloadUrl)
      toast.success(`File "${result.fileName}" deleted`);

    },
    onError: (error) => {
      toast.error(error);
    },

  });

  useEffect(() => {
    // Fetch attachments when the component mounts
    fetchAttachments();
  }, []);

  useEffect(() => {
    // Fetch attachments again when downloadURL changes (new file uploaded)
    if (downloadURL ) {
      fetchAttachments();
    }
  }, [downloadURL]);

  useEffect(() => {
    // Fetch attachments again when downloadURL changes (new file uploaded)
    if (attachments ) {
      fetchAttachments();
    }
  }, [attachments]);




  const fetchAttachments = async () => {
    try {

      const filedata = await fetcher(`/api/cards/${id}/files`);

      setAttachments(filedata);
    } catch (error) {
      console.error('Error fetching attachments:', error);
    }
  };

  const calculateTimeElapsed = (createdAt: Date) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  };


  const deleteFileHandler = async (id: string, userId:string) => {


    execute({
       id: id, 
      userID: userId
      
      })


  }






  return (
    <>
    {downloadURL !== "" ?( 
      <>
    <div className='flex items-start gap-x-3 w-full'>
        <Paperclip className="h-5 w-5 mt-0.5 text-neutral-700" />
        <h3 className="font-semibold text-neutral-700 mb-2">Attachment</h3>
      </div>
      <ol className=" space-y-4 ps-4">
        {attachments && attachments.length ? attachments.map((file, i) => (
          <div key={i} className='flex items-start gap-x-3 w-full'>
            <div className='w-full'>
              <div role="button" className="flex gap-x-3 min-h-[78px] hover:bg-neutral-200 text-sm font-medium rounded-md">
                <div className='w-1/5 min-h-[90px] rounded-md '>

                  {<img src={'/folder.png'} alt={file.fileName} className="w-full h-auto object-contain rounded-md" style={{ maxWidth: '100%', maxHeight: '70px' }} />}
                </div>
                <div className='flex flex-col gap-1'>
                  <p className="font-semibold text-neutral-700 mt-2 text-lg">{file.fileName}</p>

                  <p className="text-xs text-muted-foreground">Added {calculateTimeElapsed(file.createdAt)}</p>
                  <div className='flex gap-5 items-end'>
                    <Link href={file.downloadUrl} target='_blank' className="text-sm font-medium">download</Link>
                    <button className="text-sm font-medium" onClick={() => deleteFileHandler(file.id, file.userId)}>delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )) : null}
      </ol>
      </>
      ):null}
     
    </>
  );
};

export default Attachment;
