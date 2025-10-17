from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

# Enums
PrisonType = Literal['memorial', 'prison', 'camp']
TestimonyType = Literal['written', 'audio', 'video']
DocumentType = Literal['sentence', 'letter', 'securitate_file', 'photograph', 'other']
EventCategory = Literal['political', 'resistance', 'repression', 'commemoration']
ContentType = Literal['audio_story', 'text', 'ar_experience', 'video']

# Sub-models
class Coordinates(BaseModel):
    latitude: float
    longitude: float

class TimelineEvent(BaseModel):
    date: str
    title: str
    description: str
    image_url: Optional[str] = None

class VisitInfo(BaseModel):
    address: str
    schedule: Optional[str] = None
    price: Optional[str] = None
    contact: Optional[dict] = None
    facilities: Optional[List[str]] = None

class AudioTrack(BaseModel):
    id: str
    title: str
    duration: int
    audio_url: str
    transcript: Optional[str] = None
    location: Optional[Coordinates] = None

class ImprisonmentPeriod(BaseModel):
    start: str
    end: Optional[str] = None

# Main Models
class Prison(BaseModel):
    id: Optional[str] = Field(None, alias='_id')
    name: str
    type: PrisonType
    coordinates: Coordinates
    description: str
    history_timeline: List[TimelineEvent] = []
    operational_years: List[int]
    estimated_victims: int
    visit_info: Optional[VisitInfo] = None
    images: List[str] = []
    qr_codes: List[str] = []
    audio_tour_tracks: List[AudioTrack] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class PrisonCreate(BaseModel):
    name: str
    type: PrisonType
    coordinates: Coordinates
    description: str
    history_timeline: List[TimelineEvent] = []
    operational_years: List[int]
    estimated_victims: int
    visit_info: Optional[VisitInfo] = None

class Victim(BaseModel):
    id: Optional[str] = Field(None, alias='_id')
    prison_id: str
    name: str
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    profession: str
    biography: str
    photo_url: Optional[str] = None
    testimonies: List[str] = []
    imprisonment_period: ImprisonmentPeriod
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class VictimCreate(BaseModel):
    prison_id: str
    name: str
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    profession: str
    biography: str
    photo_url: Optional[str] = None
    imprisonment_period: ImprisonmentPeriod

class Testimony(BaseModel):
    id: Optional[str] = Field(None, alias='_id')
    prison_id: Optional[str] = None
    victim_id: Optional[str] = None
    text: str
    audio_url: Optional[str] = None
    source: str
    year: int
    type: TestimonyType
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class TestimonyCreate(BaseModel):
    prison_id: Optional[str] = None
    victim_id: Optional[str] = None
    text: str
    audio_url: Optional[str] = None
    source: str
    year: int
    type: TestimonyType

class Document(BaseModel):
    id: Optional[str] = Field(None, alias='_id')
    title: str
    document_type: DocumentType
    scan_url: str
    transcription: Optional[str] = None
    prison_id: Optional[str] = None
    victim_id: Optional[str] = None
    year: int
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class DocumentCreate(BaseModel):
    title: str
    document_type: DocumentType
    scan_url: str
    transcription: Optional[str] = None
    prison_id: Optional[str] = None
    victim_id: Optional[str] = None
    year: int
    description: Optional[str] = None

class HistoricalEvent(BaseModel):
    id: Optional[str] = Field(None, alias='_id')
    date: str
    title: str
    description: str
    related_prisons: List[str] = []
    category: EventCategory
    images: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class HistoricalEventCreate(BaseModel):
    date: str
    title: str
    description: str
    related_prisons: List[str] = []
    category: EventCategory
    images: List[str] = []

class AppEvent(BaseModel):
    id: Optional[str] = Field(None, alias='_id')
    title: str
    description: str
    date: str
    location: str
    prison_id: Optional[str] = None
    type: str
    registration_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class AppEventCreate(BaseModel):
    title: str
    description: str
    date: str
    location: str
    prison_id: Optional[str] = None
    type: str
    registration_url: Optional[str] = None

class QRScanRequest(BaseModel):
    qr_code: str

class QRScanResponse(BaseModel):
    valid: bool
    content_type: Optional[ContentType] = None
    content_data: Optional[dict] = None
    location_name: Optional[str] = None
