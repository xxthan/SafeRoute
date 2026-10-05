from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler


class SafetyMLP:
    def __init__(self):
        self.scaler = StandardScaler()

        self.model = MLPRegressor(
            hidden_layer_sizes=(8, 4),
            activation="relu",
            solver="adam",
            max_iter=1000,
            random_state=42
        )

        self.is_trained = False

    def train(self, X, y):
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self.is_trained = True

    def predict(self, X):
        if not self.is_trained:
            raise ValueError("MLP model has not been trained yet.")

        X_scaled = self.scaler.transform(X)
        prediction = self.model.predict(X_scaled)

        return prediction