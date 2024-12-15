const data = [
  42,
  "alexanderThomas",
  {
    vehicle: "sedan",
    animal: "elephant",
    ecosystem: {
      sound: "rustling",
      primaryResource: "water",
      biodiversityResearch: [
        {
          researcher: "DrEmilyRamirez",
          observation: "migratorySurvey",
        },
        "conservationData",
      ],
    },
  },
  ["riverValley", "mountainRange", "desertPlain", "coastalRegion"],
];


const customSerializer = (data) => {
  if (typeof data === "number") {
    return "num:" + data;
  }

  if (typeof data === "string") {
    if (data.length > 2) {
      return "str:" + data[0] + (data.length - 2) + data[data.length - 1];
    } else {
      return "str:" + data;
    }
  }

  if (Array.isArray(data)) {
    return "arr:" + data.map(customSerializer).join(""); 
  }

  if (typeof data === "object" && data !== null) {
    return "obj:" + Object.values(data).map(customSerializer).join(""); 
  }
  return "err:unknown";
};

const encodedData = customSerializer(data);
console.log(encodedData);
