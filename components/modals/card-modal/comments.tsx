"use client";

import { toast } from "sonner";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useRef, ElementRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";

import { Skeleton } from "@/components/ui/skeleton";
import { FormTextarea } from "@/components/form/form-textarea";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
// import { db } from "@/lib/db"
import { Prisma, Comment, PrismaClient } from "@prisma/client";
import { db } from "@/lib/db";
import { createComment } from "@/actions/create-comment";
import { CardWithList } from "@/types";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { formatDistanceToNow } from "date-fns";
import { deleteComment } from "@/actions/delete-comment";

interface CommentsProps {
  data: CardWithList,
  items: Comment[];
};

export const Comments = ({data, items}: CommentsProps) => {

  console.log(items);

  const params = useParams();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  }

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);



const { execute, fieldErrors } = useAction(createComment, {
  onSuccess: (result) => {
    console.log("1")
    queryClient.invalidateQueries({
      queryKey: ["comment", result.cardId],
    });
    queryClient.invalidateQueries({
      queryKey: ["card-logs", result.cardId]
    });
    toast.success(`Comment "${result.comment}" Created`);
    disableEditing();
  },
  onError: (error) => {
    console.log("2")
    toast.error(error);
  },
  onComplete: () => {
    console.log("3");
  }
});

const boardId = params.boardId as string;
const onSubmit = (formData: FormData) => {
  const comment = formData.get("text") as string;

  execute({
    comment,
    cardId: data.id
  })

}

const [timeElapsed, setTimeElapsed] = useState<string>("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const distance = formatDistanceToNow(new Date(data.createdAt), {
        addSuffix: true,
      });
      setTimeElapsed(distance);
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [data.createdAt]);

  const editCommentHandler = (id: String) => {
    toast.message("edited => " + id);
  }


  const { 
    execute: execeutedeleteComment,
    isLoading: isLoadingDelete,
  } = useAction(deleteComment, {
    onSuccess: (result) => {
      console.log("1")

      queryClient.invalidateQueries({
        queryKey: ["comment", result.cardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["card-logs", result.cardId]
      });
      toast.success(`Comment "${result.comment}" Deleted`);
      disableEditing();
    },
    onError: (error) => {
      console.log("2")
      toast.error(error);
    },
    onComplete: () => {
      console.log("3");
    }
  });


  const deleteCommentHandler = (id: string) => {
    execeutedeleteComment({
      id
    });
  }


  return (

    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">
          Comment
        </p>
        {isEditing ? (
          <form
            action={onSubmit}
            ref={formRef}
            className="space-y-2"
          >
            <FormTextarea
              id="text"
              className="w-full mt-2"
              placeholder="Add a more detailed description"
              
              errors={fieldErrors}
              ref={textareaRef}
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>
                Save
              </FormSubmit>
              <Button
                type="button"
                onClick={disableEditing}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
          >
            {"Add a more detailed description..."}
          </div>
        )}
        <ol className="mt-2 space-y-4">
            {items.map((item, i) => (
                <li key={i} className="flex items-center gap-x-2">
                  <Avatar className="h-8 w-8">
                    {/* <AvatarImage src={data.userImage} /> */}
                  </Avatar>
                  <div style={{width: "100%"}} className="flex flex-col space-y-0.5">
                    <div className="mt-1 bg-slate-200 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold lowercase text-neutral-700">
                          {item.comment}
                        </span>{" "}
                        {/* {generateLogMessage(data)} */}
                      </p>
                    </div>
                    <div className="w-100 flex items-center justify-between">
                      <div>
                        <button className="text-xs text-muted-foreground me-2" onClick={() => editCommentHandler(item.id)}>Edit</button>
                        <button className="text-xs text-muted-foreground" onClick={() => deleteCommentHandler(item.id)}>Delete</button>
                      </div>
                      <p className="text-xs text-muted-foreground">{timeElapsed}</p>
                    </div>
                  </div>
                </li>
            ))}
          </ol>
      </div>
    </div>
  );
};

Comments.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px] bg-neutral-200" />
      </div>
    </div>
  );
};


