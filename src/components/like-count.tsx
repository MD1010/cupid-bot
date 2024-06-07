import { useStorage } from "@plasmohq/storage/hook";

export const LikeCount = () => {
  const [likes] = useStorage("likes");

  return (
    <div>
      <h1 className="plasmo-text-blue-400">Remaining Likes</h1>
      <p className="plasmo-text-blue-400">
        {likes !== null ? likes : "Loading..."}
      </p>
    </div>
  );
};
