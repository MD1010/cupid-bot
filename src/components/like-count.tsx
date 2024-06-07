import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

export const LikeCount = () => {
  const [likes] = useStorage("likes")

  return (
    <div>
      <h1>Remaining Likes</h1>
      <p>{likes !== null ? likes : "Loading..."}</p>
    </div>
  )
}
