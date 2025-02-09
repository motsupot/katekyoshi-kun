from fastapi import APIRouter, HTTPException, status
from grpc import Status
from app.model import Bookmark, BookmarkRegisterRequest, ChatType, Summary


router = APIRouter()


@router.get("/")
async def get_all_bookmarks():
    return dict(bookmarks=[])

@router.get("/summary/{user_id}")
async def get_bookmark_by_user_id(user_id: str):
    bookmarks = Bookmark.find_by(user_id)
    
    item_ids = [bookmark.item_id for bookmark in bookmarks]
    
    summaries = []
    for item_id in item_ids:
        summary = Summary.find(item_id)
        if summary:
            summaries.append(summary)
    
    return dict(summaries=summaries)

@router.post("/summary")
async def bookmark_summary(entry: BookmarkRegisterRequest):
    summary: Summary = Summary.find(entry.id)
    if summary is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid summary not found."
        )
    if summary.user_id != entry.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid user."
        )
    bookmark = Bookmark(user_id=summary.user_id, type=ChatType.SUMMARY, item_id=entry.id)
    bookmark_id = bookmark.save()
    return dict(id=bookmark_id)


@router.post("/question")
async def bookmark_summary():
    return "AHI"


@router.post("/quiz")
async def bookmark_summary():
    return "AHI"
