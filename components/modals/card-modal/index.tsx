"use client";

import { useQuery } from "@tanstack/react-query";

import { CardWithList } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { AuditLog } from "@prisma/client";
import { useCardModal } from "@/hooks/use-card-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./actions";
import { Activity } from "./activity";
import { useEffect, useState } from "react";

export const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);
  const [timer, setTimer] = useState(true)
  const [fetchLogs, setFetchLogs] = useState(false)
  const [latestLogDate, setLatestLogDate] = useState(new Date());

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

  const { data: auditLogsData, isLoading } = useQuery<AuditLog[]>({
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


  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent>
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
              {!auditLogsData
                ? <Activity.Skeleton />
                : <Activity items={auditLogsData} />
              }
            </div>
          </div>
          {!cardData
            ? <Actions.Skeleton />
            : <Actions data={cardData} />
          }
        </div>
      </DialogContent>
    </Dialog>
  );
};
