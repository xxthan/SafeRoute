import pandas as pd
import joblib

from app.models.safety_mlp import SafetyMLP


# Load training data
data = pd.read_csv("data/safety_data.csv")


features = [
    "lighting_score",
    "incident_count",
    "dog_reports",
    "activity_level",
    "safe_places",
    "time_of_day",
    "ai_lighting_issue",
    "ai_dog_issue",
]


X = data[features]
y = data["safety_indicator"]


# Create and train the model
model = SafetyMLP()
model.train(X, y)


# Save the trained model
joblib.dump(model, "saved_models/safety_mlp.pkl")


print("MLP training completed!")
print(f"Training samples: {len(data)}")
print(f"Features: {features}")
print("Model saved to saved_models/safety_mlp.pkl")