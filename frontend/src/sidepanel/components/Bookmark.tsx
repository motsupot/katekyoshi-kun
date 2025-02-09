import React from "react";
import { useBookmark } from "../../shared/hooks";

export const Bookmark = ({
  isBookmarked,
  isRegistering,
  onClick,
}: Omit<ReturnType<typeof useBookmark>, "bookmarkId" | "registerBookmark"> & {
  onClick: () => void;
}) => {
  if (isRegistering) {
    return (
      <>
        <div>お待ちください...</div>
      </>
    );
  }

  return (
    <>
      <button onClick={onClick}>
        ブックマークに追加{isBookmarked ? "済" : "する"}
      </button>
    </>
  );
};
