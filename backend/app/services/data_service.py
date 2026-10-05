import pandas as pd
from math import radians, sin, cos, sqrt, atan2


ROAD_DATA_PATH = "data/road_safety_real.csv"
PLACES_DATA_PATH = "data/places_real.csv"


roads = pd.read_csv(ROAD_DATA_PATH)
places = pd.read_csv(PLACES_DATA_PATH)


def get_roads():
    """
    Return available real road/location data.
    """

    return roads.fillna("").to_dict(orient="records")


def get_nearby_places(latitude: float, longitude: float, radius_km: float = 2.0):
    """
    Find nearby public places using latitude/longitude.
    """

    nearby = []

    for _, place in places.iterrows():

        distance = calculate_distance(
            latitude,
            longitude,
            place["latitude"],
            place["longitude"],
        )

        if distance <= radius_km:
            nearby.append({
                "name": place["name"],
                "type": place["type"],
                "latitude": place["latitude"],
                "longitude": place["longitude"],
                "distance_km": round(distance, 2),
            })

    return nearby


def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate approximate distance between two coordinates in km.
    """

    earth_radius = 6371.0

    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        sin(dlat / 2) ** 2
        + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return earth_radius * c