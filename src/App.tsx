import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";

const URLBuilder = () => {
    const [baseURL, setBaseURL] = useState("");
    const [utmParams, setUtmParams] = useState({
        utm_source: "",
        utm_medium: "",
        utm_campaign: "",
        utm_term: "",
        utm_content: "",
    });
    const [generatedURL, setGeneratedURL] = useState("");
    const [presets, setPresets] = useState(() => {
        return JSON.parse(localStorage.getItem("utmPresets")) || [];
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "baseURL") {
            setBaseURL(value);
        } else {
            setUtmParams({ ...utmParams, [name]: value });
        }
    };

    const generateURL = () => {
        const queryParams = Object.entries(utmParams)
            .filter(([_, value]) => (value as string).trim() !== "")
            .map(
                ([key, value]) =>
                    `${key}=${encodeURIComponent(value as string)}`
            )
            .join("&");

        const finalURL = baseURL.includes("?")
            ? `${baseURL}&${queryParams}`
            : `${baseURL}?${queryParams}`;

        setGeneratedURL(finalURL);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedURL);
        alert("URL copied to clipboard!");
    };

    const savePreset = () => {
        const newPreset = { baseURL, ...utmParams };
        const updatedPresets = [...presets, newPreset];
        setPresets(updatedPresets);
        localStorage.setItem("utmPresets", JSON.stringify(updatedPresets));
        alert("Preset saved!");
    };

    const loadPreset = (preset) => {
        setBaseURL(preset.baseURL);
        setUtmParams({
            utm_source: preset.utm_source,
            utm_medium: preset.utm_medium,
            utm_campaign: preset.utm_campaign,
            utm_term: preset.utm_term,
            utm_content: preset.utm_content,
        });
    };

    return (
        <Card className="p-4 w-full max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg border border-[#bb5394]">
            <CardContent>
                <div className="text-center mb-6">
                    <img
                        src="/logo.png"
                        alt="Company Logo"
                        className="mx-auto h-12 mb-2"
                    />
                    <h1 className="text-2xl font-bold mb-2 text-[#bb5394]">
                        URL Builder
                    </h1>
                    <p className="text-sm text-gray-600">
                        Generate custom URLs with UTM parameters easily.
                    </p>
                </div>
                <div className="space-y-4">
                    <input
                        type="text"
                        name="baseURL"
                        value={baseURL}
                        onChange={handleInputChange}
                        placeholder="Enter Base URL"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#bb5394]"
                    />
                    {Object.keys(utmParams).map((key) => (
                        <input
                            key={key}
                            type="text"
                            name={key}
                            value={utmParams[key]}
                            onChange={handleInputChange}
                            placeholder={`Enter ${key.replace("utm_", "")}`}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#bb5394]"
                        />
                    ))}
                    <div className="space-x-2 text-center">
                        <Button
                            onClick={generateURL}
                            className="bg-[#bb5394] text-white hover:bg-[#a54883]"
                        >
                            Generate URL
                        </Button>
                        <Button
                            onClick={copyToClipboard}
                            disabled={!generatedURL}
                            className={`${
                                !generatedURL
                                    ? "bg-gray-400"
                                    : "bg-green-500 hover:bg-green-600"
                            } text-white`}
                        >
                            Copy URL
                        </Button>
                        <Button
                            onClick={savePreset}
                            className="bg-[#3fb1e5] text-white hover:bg-yellow-600"
                        >
                            Save Preset
                        </Button>
                    </div>
                    {generatedURL && (
                        <div className="mt-4 p-2 border rounded bg-gray-100">
                            <p className="text-sm font-semibold">
                                Generated URL:
                            </p>
                            <p className="break-words text-blue-600">
                                {generatedURL}
                            </p>
                        </div>
                    )}
                </div>
                {presets.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-2 text-[#bb5394]">
                            Presets
                        </h2>
                        <ul className="space-y-2">
                            {presets.map((preset, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center"
                                >
                                    <span>{preset.baseURL}</span>
                                    <Button
                                        size="sm"
                                        onClick={() => loadPreset(preset)}
                                        className="bg-blue-400 text-white hover:bg-blue-500"
                                    >
                                        Load
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default URLBuilder;
