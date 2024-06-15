import { STORAGE_KEYS } from "@/consts";
import { useStorage } from "@plasmohq/storage/hook";
import { FavouriteIcon, TickDouble02Icon } from "hugeicons-react";
import { useEffect, useState } from "react";

export const InfoCount = () => {
  const [likes] = useStorage("likes");
  const [sentAmount] = useStorage(STORAGE_KEYS.sentAmount);
  const [totalMatchesSent, setTotalMatchesSent] = useState<number>(0);

  useEffect(() => {
    if (sentAmount) {
      setTotalMatchesSent((prevCount) => prevCount + 1);
    }
  }, [sentAmount]);

  return (
    <div className="flex gap-3">
      <div className="flex gap-1 text-primary">
        <FavouriteIcon strokeWidth={2} />
        <span>{likes}</span>
      </div>

      <div className="text-primary flex gap-1">
        <TickDouble02Icon strokeWidth={2} />
        {totalMatchesSent}
      </div>
    </div>
  );
};
