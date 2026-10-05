def calculate_safety(
    lighting_score: float,
    incident_count: int,
    dog_reports: int,
    activity_level: float,
    safe_places: int,
    time_of_day: int,
):
    # Temporary rule-based calculation.
    # We will replace this with the MLP later.

    incident_score = max(0, 1 - (incident_count / 10))
    dog_score = max(0, 1 - (dog_reports / 10))
    safe_place_score = min(safe_places / 10, 1)

    safety_indicator = (
        0.30 * lighting_score
        + 0.20 * incident_score
        + 0.10 * dog_score
        + 0.20 * activity_level
        + 0.20 * safe_place_score
    )

    safety_indicator = round(safety_indicator, 2)

    # Convert numerical values into readable labels
    if lighting_score >= 0.7:
        lighting = "Good"
    elif lighting_score >= 0.4:
        lighting = "Moderate"
    else:
        lighting = "Poor"

    if incident_count <= 2:
        incidents = "Low"
    elif incident_count <= 5:
        incidents = "Moderate"
    else:
        incidents = "High"

    if activity_level >= 0.7:
        activity = "High"
    elif activity_level >= 0.4:
        activity = "Moderate"
    else:
        activity = "Low"

    return {
        "safety_indicator": safety_indicator,
        "lighting": lighting,
        "incidents": incidents,
        "activity": activity,
    }