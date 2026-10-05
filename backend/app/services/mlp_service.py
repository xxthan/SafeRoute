import joblib
import pandas as pd


MODEL_PATH = "saved_models/safety_mlp.pkl"


# Load the trained model once when the backend starts
mlp_model = joblib.load(MODEL_PATH)


def predict_safety(
    lighting_score: float,
    incident_count: int,
    dog_reports: int,
    activity_level: float,
    safe_places: int,
    time_of_day: int,
    ai_lighting_issue: int,
    ai_dog_issue: int,
):
    data = pd.DataFrame([{
        "lighting_score": lighting_score,
        "incident_count": incident_count,
        "dog_reports": dog_reports,
        "activity_level": activity_level,
        "safe_places": safe_places,
        "time_of_day": time_of_day,
        "ai_lighting_issue": ai_lighting_issue,
        "ai_dog_issue": ai_dog_issue,
    }])

    prediction = mlp_model.predict(data)[0]

    # Keep the result between 0 and 1
    prediction = max(0.0, min(1.0, float(prediction)))

    return round(prediction, 2)