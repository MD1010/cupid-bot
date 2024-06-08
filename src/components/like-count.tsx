import { useStorage } from "@plasmohq/storage/hook";
import { RefreshIcon } from "hugeicons-react";
import { useState } from "react";
import { updateRemainingLikes } from '~services/likes';


export const LikeCount = () => {
  const [likes] = useStorage("likes");
  const [isLoading, setIsLoading] = useState<boolean>();

  const refreshLikes = async () => {
    setIsLoading(true);
    await updateRemainingLikes();
    setIsLoading(false);
  };

  return (
    <div className='plasmo-text-blue-400'>
      {!isLoading ? (
        <h1>Remaining Likes: {likes}</h1>
      ): <div>Loading...</div>}
      <RefreshIcon color="rgb(96 165 250)" onClick={refreshLikes}/>
    </div>
  );
};
