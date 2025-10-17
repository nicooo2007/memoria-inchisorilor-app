from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime

from models import (
    Prison, PrisonCreate,
    Victim, VictimCreate,
    Testimony, TestimonyCreate,
    Document, DocumentCreate,
    HistoricalEvent, HistoricalEventCreate,
    AppEvent, AppEventCreate,
    QRScanRequest, QRScanResponse
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Memorial Gherla API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Helper function to convert MongoDB _id
def serialize_doc(doc):
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

# ==================== PRISONS ====================
@api_router.get("/prisons", response_model=List[Prison])
async def get_prisons(
    type: Optional[str] = None,
    limit: int = Query(default=100, le=100)
):
    """Get all prisons with optional filtering"""
    query = {}
    if type:
        query['type'] = type
    
    prisons = await db.prisons.find(query).limit(limit).to_list(length=limit)
    return [Prison(**serialize_doc(p)) for p in prisons]

@api_router.get("/prisons/{prison_id}", response_model=Prison)
async def get_prison(prison_id: str):
    """Get a specific prison by ID"""
    prison = await db.prisons.find_one({"_id": prison_id})
    if not prison:
        raise HTTPException(status_code=404, detail="Prison not found")
    return Prison(**serialize_doc(prison))

@api_router.post("/prisons", response_model=Prison)
async def create_prison(prison: PrisonCreate):
    """Create a new prison"""
    prison_dict = prison.model_dump()
    prison_dict['_id'] = prison_dict['name'].lower().replace(' ', '_')
    prison_dict['created_at'] = datetime.utcnow()
    prison_dict['updated_at'] = datetime.utcnow()
    prison_dict['images'] = []
    prison_dict['qr_codes'] = []
    prison_dict['audio_tour_tracks'] = []
    
    result = await db.prisons.insert_one(prison_dict)
    prison_dict['_id'] = str(result.inserted_id)
    return Prison(**prison_dict)

# ==================== VICTIMS ====================
@api_router.get("/victims", response_model=List[Victim])
async def get_victims(
    prison_id: Optional[str] = None,
    limit: int = Query(default=100, le=100)
):
    """Get all victims with optional filtering by prison"""
    query = {}
    if prison_id:
        query['prison_id'] = prison_id
    
    victims = await db.victims.find(query).limit(limit).to_list(length=limit)
    return [Victim(**serialize_doc(v)) for v in victims]

@api_router.get("/victims/{victim_id}", response_model=Victim)
async def get_victim(victim_id: str):
    """Get a specific victim by ID"""
    victim = await db.victims.find_one({"_id": victim_id})
    if not victim:
        raise HTTPException(status_code=404, detail="Victim not found")
    return Victim(**serialize_doc(victim))

@api_router.post("/victims", response_model=Victim)
async def create_victim(victim: VictimCreate):
    """Create a new victim"""
    victim_dict = victim.model_dump()
    victim_dict['_id'] = victim_dict['name'].lower().replace(' ', '_')
    victim_dict['created_at'] = datetime.utcnow()
    victim_dict['updated_at'] = datetime.utcnow()
    victim_dict['testimonies'] = []
    
    result = await db.victims.insert_one(victim_dict)
    victim_dict['_id'] = str(result.inserted_id)
    return Victim(**victim_dict)

# ==================== TESTIMONIES ====================
@api_router.get("/testimonies", response_model=List[Testimony])
async def get_testimonies(
    prison_id: Optional[str] = None,
    victim_id: Optional[str] = None,
    type: Optional[str] = None,
    limit: int = Query(default=100, le=100)
):
    """Get all testimonies with optional filtering"""
    query = {}
    if prison_id:
        query['prison_id'] = prison_id
    if victim_id:
        query['victim_id'] = victim_id
    if type:
        query['type'] = type
    
    testimonies = await db.testimonies.find(query).limit(limit).to_list(length=limit)
    return [Testimony(**serialize_doc(t)) for t in testimonies]

@api_router.post("/testimonies", response_model=Testimony)
async def create_testimony(testimony: TestimonyCreate):
    """Create a new testimony"""
    testimony_dict = testimony.model_dump()
    testimony_dict['created_at'] = datetime.utcnow()
    
    result = await db.testimonies.insert_one(testimony_dict)
    testimony_dict['_id'] = str(result.inserted_id)
    return Testimony(**testimony_dict)

# ==================== DOCUMENTS ====================
@api_router.get("/documents", response_model=List[Document])
async def get_documents(
    type: Optional[str] = None,
    prison_id: Optional[str] = None,
    victim_id: Optional[str] = None,
    year_from: Optional[int] = None,
    year_to: Optional[int] = None,
    limit: int = Query(default=100, le=100)
):
    """Get all documents with optional filtering"""
    query = {}
    if type:
        query['document_type'] = type
    if prison_id:
        query['prison_id'] = prison_id
    if victim_id:
        query['victim_id'] = victim_id
    if year_from or year_to:
        query['year'] = {}
        if year_from:
            query['year']['$gte'] = year_from
        if year_to:
            query['year']['$lte'] = year_to
    
    documents = await db.documents.find(query).limit(limit).to_list(length=limit)
    return [Document(**serialize_doc(d)) for d in documents]

@api_router.post("/documents", response_model=Document)
async def create_document(document: DocumentCreate):
    """Create a new document"""
    document_dict = document.model_dump()
    document_dict['created_at'] = datetime.utcnow()
    
    result = await db.documents.insert_one(document_dict)
    document_dict['_id'] = str(result.inserted_id)
    return Document(**document_dict)

# ==================== HISTORICAL EVENTS ====================
@api_router.get("/historical-timeline", response_model=List[HistoricalEvent])
async def get_historical_timeline(
    category: Optional[str] = None,
    limit: int = Query(default=100, le=100)
):
    """Get historical timeline events"""
    query = {}
    if category:
        query['category'] = category
    
    events = await db.historical_events.find(query).sort("date", 1).limit(limit).to_list(length=limit)
    return [HistoricalEvent(**serialize_doc(e)) for e in events]

@api_router.post("/historical-timeline", response_model=HistoricalEvent)
async def create_historical_event(event: HistoricalEventCreate):
    """Create a new historical event"""
    event_dict = event.model_dump()
    event_dict['created_at'] = datetime.utcnow()
    
    result = await db.historical_events.insert_one(event_dict)
    event_dict['_id'] = str(result.inserted_id)
    return HistoricalEvent(**event_dict)

# ==================== APP EVENTS ====================
@api_router.get("/events", response_model=List[AppEvent])
async def get_events(
    upcoming: bool = False,
    limit: int = Query(default=100, le=100)
):
    """Get app events (commemorations, conferences, etc.)"""
    query = {}
    if upcoming:
        query['date'] = {'$gte': datetime.utcnow().isoformat()}
    
    events = await db.app_events.find(query).sort("date", 1).limit(limit).to_list(length=limit)
    return [AppEvent(**serialize_doc(e)) for e in events]

@api_router.post("/events", response_model=AppEvent)
async def create_event(event: AppEventCreate):
    """Create a new app event"""
    event_dict = event.model_dump()
    event_dict['created_at'] = datetime.utcnow()
    
    result = await db.app_events.insert_one(event_dict)
    event_dict['_id'] = str(result.inserted_id)
    return AppEvent(**event_dict)

# ==================== QR CODE SCANNING ====================
@api_router.post("/qr/scan", response_model=QRScanResponse)
async def scan_qr_code(request: QRScanRequest):
    """Validate QR code and return content"""
    # Look up QR code in database
    qr_location = await db.qr_locations.find_one({"qr_code": request.qr_code})
    
    if not qr_location:
        return QRScanResponse(valid=False)
    
    return QRScanResponse(
        valid=True,
        content_type=qr_location.get('content_type'),
        content_data=qr_location.get('content_data'),
        location_name=qr_location.get('location_name')
    )

# ==================== HEALTH CHECK ====================
@api_router.get("/")
async def root():
    return {
        "message": "Memorial Gherla API",
        "version": "1.0.0",
        "status": "running"
    }

@api_router.get("/health")
async def health_check():
    try:
        # Test database connection
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
