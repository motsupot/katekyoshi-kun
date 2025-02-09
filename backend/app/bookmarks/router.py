from fastapi import APIRouter, HTTPException, status
from grpc import Status
from app.model import Bookmark, BookmarkRegisterRequest, ChatType, Quiz, Summary, SummaryWithBookmarkId


router = APIRouter()


@router.get("/")
async def get_all_bookmarks():
    return dict(bookmarks=[])

@router.get("/summary/{user_id}")
async def get_bookmark_by_user_id(user_id: str):
    bookmarks = Bookmark.find_by(user_id)

    item_ids = [dict(summary_id=bookmark.item_id, bookmark_id=bookmark.id) for bookmark in bookmarks if bookmark.type == ChatType.SUMMARY]

    summaries = []
    for item_id in item_ids:
        summary = Summary.find(item_id["summary_id"])
        if summary:
            result = SummaryWithBookmarkId(
                url=summary.url,
                user_id=summary.user_id,
                body=summary.body,
                title=summary.title,
                bookmark_id=item_id["bookmark_id"])
            summaries.append(result)

    return dict(summaries=summaries)

@router.post("/summary")
async def bookmark_summary(entry: BookmarkRegisterRequest):
    summary: Summary = Summary.find(entry.id)
    if summary is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Summary not found."
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

@router.get("/quiz/{user_id}")
async def get_bookmark_by_user_id(user_id: str):
    bookmarks = Bookmark.find_by(user_id)

    item_ids = [bookmark.item_id for bookmark in bookmarks if bookmark.type == ChatType.QUIZ]

    quizzes = []
    for item_id in item_ids:
        quiz = Quiz.find(item_id)
        if quiz:
            quizzes.append(quiz)

    return dict(quizzes=quizzes)

@router.post("/quiz")
async def bookmark_summary(entry: BookmarkRegisterRequest):
    quiz: Quiz = Quiz.find(entry.id)
    if quiz is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found."
        )
    if quiz.user_id != entry.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid user."
        )
    bookmark = Bookmark(user_id=quiz.user_id, type=ChatType.QUIZ, item_id=entry.id)
    bookmark_id = bookmark.save()
    return dict(id=bookmark_id)


@router.delete("/{bookmark_id}")
async def delete_bookmark(bookmark_id: str):
    deleted = Bookmark.delete(bookmark_id)
    if deleted is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bookmark not found."
        )
    return f"bookmark {deleted} has deleted."
