import axios from "axios";

export const GeneratePersona = async (jsonObject: any) => {
  try {
    const res = await axios.post("/api/generatePersona", jsonObject);
    console.log("Persona in GeneratePeersonaFunction", res.data);
    return res.data.persona;
  } catch (error) {
    console.error("Error Generating Persona:", error);
    throw error;
  }
};
