'use client'

import React from 'react'
import { toast } from 'sonner'

const BoardTile = () => {
  return (
    <div style={{position: "absolute", height: "100%", width: "100%", zIndex: 988}} onClick={() => toast.success("You aren't allowed to access this board")}></div>
  )
}

export default BoardTile