from dataclasses import dataclass
from datetime import datetime


@dataclass
class ConversionLog:
    id: str
    original_format: str
    target_format: str
    timestamp: datetime
    status: str


