from fastapi import APIRouter
from app.model import SummaryDto


router = APIRouter()


@router.get("/")
async def get_all_bookmarks():
    return dict(bookmarks=[])


@router.get("/{user_id}")
async def get_bookmark_by_user_id(user_id: str):
    return dict(summaries=SummaryDto.find_by_user_id(user_id))


@router.post("/summary")
async def bookmark_summary(summary: SummaryDto):
    print(f"{summary=}")
    summary.save()
    return "summary saved"


@router.post("/question")
async def bookmark_summary():
    return "AHI"


@router.post("/quiz")
async def bookmark_summary():
    return "AHI"
