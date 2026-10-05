from fastapi import APIRouter

from app.schemas.safety import (
    RouteSafetyRequest,
    RouteSafetyResponse,
    ReportRequest,
    ReportResponse,
    AnalyzeReportRouteRequest,
    AnalyzeReportRouteResponse,
)

from app.services.mlp_service import predict_safety
from app.services.ai_service import analyze_report
from app.services.data_service import get_roads, get_nearby_places


router = APIRouter()


@router.post("/analyze-route", response_model=RouteSafetyResponse)
def analyze_route(request: RouteSafetyRequest):

    safety_indicator = predict_safety(
        lighting_score=request.lighting_score,
        incident_count=request.incident_count,
        dog_reports=request.dog_reports,
        activity_level=request.activity_level,
        safe_places=request.safe_places,
        time_of_day=request.time_of_day,
        ai_lighting_issue=request.ai_lighting_issue,
        ai_dog_issue=request.ai_dog_issue,
    )

    # Convert numerical values into readable labels
    if request.lighting_score >= 0.7:
        lighting = "Good"
    elif request.lighting_score >= 0.4:
        lighting = "Moderate"
    else:
        lighting = "Poor"

    if request.incident_count <= 2:
        incidents = "Low"
    elif request.incident_count <= 5:
        incidents = "Moderate"
    else:
        incidents = "High"

    if request.activity_level >= 0.7:
        activity = "High"
    elif request.activity_level >= 0.4:
        activity = "Moderate"
    else:
        activity = "Low"

    return {
        "route_id": request.route_id,
        "safety_indicator": safety_indicator,
        "lighting": lighting,
        "incidents": incidents,
        "activity": activity,
    }


@router.post("/report", response_model=ReportResponse)
def analyze_user_report(request: ReportRequest):

    result = analyze_report(request.report_text)

    return {
        "report_text": request.report_text,
        "lighting_issue": result["lighting_issue"],
        "dog_issue": result["dog_issue"],
    }


@router.post(
    "/analyze-report-route",
    response_model=AnalyzeReportRouteResponse
)
def analyze_report_route(request: AnalyzeReportRouteRequest):

    # Step 1: Analyze the user report using Gemma
    ai_result = analyze_report(request.report_text)

    # Step 2: Pass Gemma's structured features into the MLP
    safety_indicator = predict_safety(
        lighting_score=request.lighting_score,
        incident_count=request.incident_count,
        dog_reports=request.dog_reports,
        activity_level=request.activity_level,
        safe_places=request.safe_places,
        time_of_day=request.time_of_day,
        ai_lighting_issue=ai_result["lighting_issue"],
        ai_dog_issue=ai_result["dog_issue"],
    )

    return {
        "route_id": request.route_id,
        "report_text": request.report_text,
        "ai_features": {
            "lighting_issue": ai_result["lighting_issue"],
            "dog_issue": ai_result["dog_issue"],
        },
        "safety_indicator": safety_indicator,
    }


@router.get("/roads")
def roads():

    return {
        "roads": get_roads()
    }


@router.get("/nearby-places")
def nearby_places(
    latitude: float,
    longitude: float,
    radius_km: float = 2.0,
):

    return {
        "places": get_nearby_places(
            latitude,
            longitude,
            radius_km,
        )
    }