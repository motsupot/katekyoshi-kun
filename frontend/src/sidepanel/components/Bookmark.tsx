import React from "react";
import { useBookmark } from "../../shared/hooks";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import "./Bookmark.css";

export const Bookmark = ({
  isBookmarked,
  isRegistering,
  onClick,
}: Omit<ReturnType<typeof useBookmark>, "bookmarkId" | "registerBookmark"> & {
  onClick: () => void;
}) => {
  const status = toStatus(isBookmarked, isRegistering);
  return (
    <button className="bookmark-button" onClick={onClick} disabled={status === "loading"}>
      <BookmarkIcon className={`bookmark-icon ${status}`} />
    </button>
  );
};

const toStatus = (isBookmarked: boolean, isRegistering: boolean): "default" | "loading" | "bookmarked" => {
  if (isRegistering) return "loading";
  return isBookmarked ? "bookmarked" : "default";
}
