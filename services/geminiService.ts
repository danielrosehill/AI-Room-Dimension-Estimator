
import { GoogleGenAI, Type } from "@google/genai";

const PROMPT = `
You are an expert interior architect and spatial analyst. Your task is to analyze an image of a room and estimate its dimensions. You must use common objects within the photo (e.g., doors which are typically 6'8\" high, windows, light switches, furniture, power outlets) as a scale reference.

You must provide your response in a single JSON object. The JSON object should have two properties: 'dimensions' and 'annotatedImageSvg'.

1. 'dimensions': An array of objects. Each object should represent a single estimated dimension and have the following properties:
   - 'label': A descriptive name for the dimension (e.g., "Ceiling Height", "Width of Wall with Window").
   - 'estimate': A string representing the estimated dimension, including units (e.g., "~8 feet", "~2.5 meters").

2. 'annotatedImageSvg': A string containing a complete SVG. This SVG will be overlaid on top of the original image.
   - The SVG's viewBox should be '0 0 100 100', using a percentage-based coordinate system that corresponds to the original image's dimensions (width and height).
   - The SVG should contain lines, arrows, and text elements to visually represent the estimated dimensions on the image.
   - Use dashed lines for measurements.
   - Use a contrasting color for lines and text (e.g., bright yellow or cyan) to be visible on various backgrounds.
   - The text should be clear and readable.
   - Example SVG line: <line x1="10" y1="50" x2="90" y2="50" stroke="yellow" stroke-width="0.5" stroke-dasharray="1,1" />
   - Example SVG text: <text x="50" y="48" fill="yellow" font-size="3" text-anchor="middle">~12 ft</text>

Analyze the provided image and return the JSON object as described. Do not include any other text, explanations, or markdown formatting outside of the JSON object.
`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    dimensions: {
      type: Type.ARRAY,
      description: "An array of estimated dimensions.",
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: "Descriptive name for the dimension." },
          estimate: { type: Type.STRING, description: "The estimated dimension with units." },
        },
        required: ['label', 'estimate'],
      },
    },
    annotatedImageSvg: {
      type: Type.STRING,
      description: "A string containing a complete SVG to be overlaid on the image. Must have a viewBox of '0 0 100 100'."
    },
  },
  required: ['dimensions', 'annotatedImageSvg'],
};


export const analyzeImage = async (imageBase64: string, mimeType: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType,
    },
  };

  const textPart = {
    text: PROMPT,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return Promise.reject(`Error analyzing image: ${error.message}`);
    }
    return Promise.reject("An unknown error occurred while analyzing the image.");
  }
};
