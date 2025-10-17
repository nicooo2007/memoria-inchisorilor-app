"""
Seed script to populate the database with mock data for Memorial Gherla app
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def seed_database():
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("🌱 Starting database seeding...")
    
    # Clear existing data
    await db.prisons.delete_many({})
    await db.victims.delete_many({})
    await db.testimonies.delete_many({})
    await db.documents.delete_many({})
    await db.historical_events.delete_many({})
    await db.app_events.delete_many({})
    
    print("✅ Cleared existing data")
    
    # Seed Prisons
    prisons = [
        {
            "_id": "gherla",
            "name": "Memorialul Gherla",
            "type": "memorial",
            "coordinates": {"latitude": 47.0242, "longitude": 23.9076},
            "description": "Închisoarea Gherla a fost unul dintre cele mai temute penitenciare din perioada comunistă, cunoscut pentru condițiile inumane și tratamentul brutal al deținuților politici.",
            "history_timeline": [
                {
                    "date": "1945",
                    "title": "Preluarea de către regimul comunist",
                    "description": "Închisoarea devine centru de detenție pentru opoziție politici"
                },
                {
                    "date": "1948-1964",
                    "title": "Perioada neagră",
                    "description": "Mii de deținuți politici încarcerați în condiții extreme"
                }
            ],
            "operational_years": [1945, 1964],
            "estimated_victims": 5000,
            "visit_info": {
                "address": "Str. Libertății nr. 1, Gherla, Cluj",
                "schedule": "Luni-Vineri: 9:00-17:00",
                "price": "Intrare liberă",
                "contact": {
                    "phone": "+40 264 241 234",
                    "email": "contact@memorial-gherla.ro"
                }
            },
            "images": [],
            "qr_codes": [],
            "audio_tour_tracks": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": "sighet",
            "name": "Memorialul Sighet",
            "type": "memorial",
            "coordinates": {"latitude": 47.9281, "longitude": 23.8886},
            "description": "Memorial al victimelor comunismului și al rezistenței. Fost loc de detenție pentru elita politică, intelectuală și religioasă a României.",
            "history_timeline": [],
            "operational_years": [1948, 1977],
            "estimated_victims": 180,
            "images": [],
            "qr_codes": [],
            "audio_tour_tracks": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": "pitesti",
            "name": "Închisoarea Pitești",
            "type": "prison",
            "coordinates": {"latitude": 44.8565, "longitude": 24.8692},
            "description": "Loc al experimentului de reeducare prin tortură, unul dintre cele mai îngrozitoare episoade ale terorii comuniste.",
            "history_timeline": [],
            "operational_years": [1949, 1952],
            "estimated_victims": 1000,
            "images": [],
            "qr_codes": [],
            "audio_tour_tracks": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": "aiud",
            "name": "Penitenciarul Aiud",
            "type": "prison",
            "coordinates": {"latitude": 46.3089, "longitude": 23.7189},
            "description": "Penitenciar de maximă siguranță unde au fost deținuți numeroși opoziție ai regimului comunist.",
            "history_timeline": [],
            "operational_years": [1945, 1989],
            "estimated_victims": 3000,
            "images": [],
            "qr_codes": [],
            "audio_tour_tracks": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": "jilava",
            "name": "Închisoarea Jilava",
            "type": "prison",
            "coordinates": {"latitude": 44.3167, "longitude": 26.1000},
            "description": "Fortăreață militară transformată în închisoare, cunoscută pentru execuțiile summare și torturi.",
            "history_timeline": [],
            "operational_years": [1945, 1989],
            "estimated_victims": 2500,
            "images": [],
            "qr_codes": [],
            "audio_tour_tracks": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    await db.prisons.insert_many(prisons)
    print(f"✅ Seeded {len(prisons)} prisons")
    
    # Seed Victims
    victims = [
        {
            "_id": "victim1",
            "prison_id": "gherla",
            "name": "Valeriu Gafencu",
            "birth_year": 1921,
            "death_year": 1952,
            "profession": "Student, membru al Mișcării Legionare",
            "biography": "Cunoscut ca 'Sfântul închisorilor', Valeriu Gafencu și-a dedicat viața ajutorării colegilor de suferință. A murit la vârsta de 31 de ani din cauza tuberculozei contractate în închisoare.",
            "testimonies": [],
            "imprisonment_period": {"start": "1948", "end": "1952"},
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": "victim2",
            "prison_id": "sighet",
            "name": "Iuliu Maniu",
            "birth_year": 1873,
            "death_year": 1953,
            "profession": "Prim-ministru al României",
            "biography": "Lider al Partidului Național Țărănesc, Iuliu Maniu a fost una dintre cele mai importante personalități politice ale României interbelice. Condamnat la muncă silnică pe viață, a murit în închisoarea Sighet.",
            "testimonies": [],
            "imprisonment_period": {"start": "1947", "end": "1953"},
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": "victim3",
            "prison_id": "pitesti",
            "name": "Alin Tănase",
            "birth_year": 1928,
            "death_year": 2011,
            "profession": "Student",
            "biography": "Supraviețuitor al experimentului de reeducare de la Pitești. Martor al celor mai cumplite torturi aplicate studenților români.",
            "testimonies": [],
            "imprisonment_period": {"start": "1949", "end": "1952"},
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": "victim4",
            "prison_id": "aiud",
            "name": "Gheorghe Calciu-Dumitreasa",
            "birth_year": 1925,
            "death_year": 2006,
            "profession": "Preot și disident",
            "biography": "Teolog și preot ortodox, a petrecut 21 de ani în închisorile comuniste pentru convingerile sale religioase.",
            "testimonies": [],
            "imprisonment_period": {"start": "1948", "end": "1964"},
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": "victim5",
            "prison_id": "gherla",
            "name": "Corneliu Coposu",
            "birth_year": 1914,
            "death_year": 1995,
            "profession": "Om politic",
            "biography": "Secretar al lui Iuliu Maniu, a petrecut 17 ani în închisorile comuniste. După revoluție a devenit președinte al PNȚCD.",
            "testimonies": [],
            "imprisonment_period": {"start": "1947", "end": "1964"},
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    await db.victims.insert_many(victims)
    print(f"✅ Seeded {len(victims)} victims")
    
    # Seed Testimonies
    testimonies = [
        {
            "prison_id": "pitesti",
            "victim_id": "victim3",
            "text": "Ceea ce s-a întâmplat la Pitești nu poate fi descris în cuvinte. Oameni obligați să își bată colegii până la moarte, să își batjocorească credința, să își renegați familiile. Tortura nu era doar fizică, ci și spirituală.",
            "source": "Mărturii despre Fenomenul Pitești",
            "year": 1990,
            "type": "written",
            "created_at": datetime.utcnow()
        },
        {
            "prison_id": "gherla",
            "victim_id": "victim1",
            "text": "Valeriu era un sfânt printre noi. Deși el însuși suferea de tuberculoză, își împărțea porția de mâncare cu cei mai slabi. Când a murit, am simțit că o lumină s-a stins în întunericul închisorii.",
            "source": "Memorialele supraviețuitorilor",
            "year": 1952,
            "type": "written",
            "created_at": datetime.utcnow()
        },
        {
            "prison_id": "sighet",
            "victim_id": "victim2",
            "text": "Iuliu Maniu a murit în celula sa, singur și uitat. Un om care a condus România, tratat ca ultimul criminal. Așa își dorea comunismul să ștergă memoria marilor personalități ale națiunii.",
            "source": "Arhivele Memorialului Sighet",
            "year": 1953,
            "type": "written",
            "created_at": datetime.utcnow()
        }
    ]
    
    await db.testimonies.insert_many(testimonies)
    print(f"✅ Seeded {len(testimonies)} testimonies")
    
    # Seed Documents
    documents = [
        {
            "title": "Sentința lui Iuliu Maniu",
            "document_type": "sentence",
            "scan_url": "https://placeholder.com/sentence1.pdf",
            "transcription": "Condamnat la muncă silnică pe viață pentru trădare de patrie...",
            "prison_id": "sighet",
            "victim_id": "victim2",
            "year": 1947,
            "description": "Sentința prin care Iuliu Maniu a fost condamnat la închisoare pe viață",
            "created_at": datetime.utcnow()
        },
        {
            "title": "Scrisoare din închisoare - Valeriu Gafencu",
            "document_type": "letter",
            "scan_url": "https://placeholder.com/letter1.pdf",
            "transcription": "Dragii mei, nu vă faceți griji pentru mine. Dumnezeu este cu mine...",
            "prison_id": "gherla",
            "victim_id": "victim1",
            "year": 1951,
            "description": "Una dintre ultimele scrisori ale lui Valeriu Gafencu către familia sa",
            "created_at": datetime.utcnow()
        },
        {
            "title": "Dosar Securitate - Fenomenul Pitești",
            "document_type": "securitate_file",
            "scan_url": "https://placeholder.com/securitate1.pdf",
            "prison_id": "pitesti",
            "year": 1952,
            "description": "Document desecretizat despre experimentul de reeducare",
            "created_at": datetime.utcnow()
        }
    ]
    
    await db.documents.insert_many(documents)
    print(f"✅ Seeded {len(documents)} documents")
    
    # Seed Historical Events
    historical_events = [
        {
            "date": "1945-03-06",
            "title": "Începutul dictaturii comuniste",
            "description": "Guvernul Petru Groza vine la putere, marcând începutul regimului comunist în România.",
            "related_prisons": [],
            "category": "political",
            "images": [],
            "created_at": datetime.utcnow()
        },
        {
            "date": "1948-12-30",
            "title": "Regele Mihai I abdică forțat",
            "description": "Ultimul rege al României este forțat să abdice, marcând instaurarea completă a dictaturii comuniste.",
            "related_prisons": [],
            "category": "political",
            "images": [],
            "created_at": datetime.utcnow()
        },
        {
            "date": "1949-06-01",
            "title": "Începe experimentul Pitești",
            "description": "Demarează experimentul de reeducare prin tortură la închisoarea Pitești.",
            "related_prisons": ["pitesti"],
            "category": "repression",
            "images": [],
            "created_at": datetime.utcnow()
        },
        {
            "date": "1989-12-21",
            "title": "Revoluția Română",
            "description": "Începe revoluția care va duce la căderea regimului comunist.",
            "related_prisons": [],
            "category": "resistance",
            "images": [],
            "created_at": datetime.utcnow()
        }
    ]
    
    await db.historical_events.insert_many(historical_events)
    print(f"✅ Seeded {len(historical_events)} historical events")
    
    # Seed App Events
    app_events = [
        {
            "title": "Zi de comemorare - Memorialul Sighet",
            "description": "Ceremonie de comemorare a victimelor comunismului",
            "date": "2025-12-21T10:00:00",
            "location": "Memorialul Sighet",
            "prison_id": "sighet",
            "type": "commemoration",
            "created_at": datetime.utcnow()
        },
        {
            "title": "Conferință: Rezistența anticomunistă",
            "description": "Conferință despre mișcările de rezistență împotriva regimului comunist",
            "date": "2025-10-15T14:00:00",
            "location": "București",
            "type": "conference",
            "created_at": datetime.utcnow()
        }
    ]
    
    await db.app_events.insert_many(app_events)
    print(f"✅ Seeded {len(app_events)} app events")
    
    print("✅ Database seeding completed successfully!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
