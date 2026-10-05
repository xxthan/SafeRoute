from pydantic import BaseModel
from typing import Optional


class RouteSafetyRequest(BaseModel):
    route_id: str
    lighting_score: float
    incident_count: int
    dog_reports: int
    activity_level: float
    safe_places: int
    time_of_day: int
    ai_lighting_issue: int = 0
    ai_dog_issue: int = 0


class RouteSafetyResponse(BaseModel):
    route_id: str
    safety_indicator: float
    lighting: str
    incidents: str
    activity: str


class ReportRequest(BaseModel):
    report_text: str


class ReportResponse(BaseModel):
    report_text: str
    lighting_issue: int
    dog_issue: int


class AnalyzeReportRouteRequest(BaseModel):
    route_id: str
    report_text: str
    lighting_score: float
    incident_count: int
    dog_reports: int
    activity_level: float
    safe_places: int
    time_of_day: int


class AnalyzeReportRouteResponse(BaseModel):
    route_id: str
    report_text: str
    ai_features: dict
    safety_indicator: float