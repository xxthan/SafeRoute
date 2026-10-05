export const routeData = {
  currentLocation: "My current location",

  destination: "North Avenue",

  coverage: {
    area: "Central district",
    level: "Good coverage",
  },

  routes: [
    {
      id: 1,
      name: "Recommended Route",
      distance: "1.8 km",
      duration: "24 min",

      safety: {
        lighting: "Good",
        activity: "High",
        animalReports: 1,
        incidents: 0,
      },

      insights: [
        "Mostly well-lit",
        "Higher pedestrian activity",
        "1 community animal report",
        "Few reported incidents",
      ],
    },

    {
      id: 2,
      name: "Alternative Route",
      distance: "2.1 km",
      duration: "27 min",

      safety: {
        lighting: "Limited",
        activity: "Moderate",
        animalReports: 2,
        incidents: 1,
      },

      insights: [
        "Some limited-lighting areas",
        "Moderate pedestrian activity",
        "2 community animal reports",
        "Some reported incidents",
      ],
    },
  ],
};