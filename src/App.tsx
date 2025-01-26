import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Modal } from "./components/ui/modal";

const utmInfo = {
    utm_source: "The source of the traffic, e.g., Google, WhatsApp, Instagram.",
    utm_medium:
        "The medium of the traffic, e.g., story, banner, push_notification.",
    utm_campaign: "The name of the campaign, e.g., spring_sale.",
};

const URLBuilder = () => {
    const [baseURL, setBaseURL] = useState("");
    const [utmParams, setUtmParams] = useState({
        utm_source: "",
        utm_medium: "",
        utm_campaign: "",
    });
    const [generatedURL, setGeneratedURL] = useState("");
    const [presets, setPresets] = useState(() => {
        return JSON.parse(localStorage.getItem("utmPresets")) || [];
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [selectWidth, setSelectWidth] = useState(0);
    const selectRef = useRef(null);

    useEffect(() => {
        if (selectRef.current) {
            setSelectWidth(selectRef.current.offsetWidth);
        }
    }, [baseURL]);

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

        const cleanedBaseURL = baseURL.replace(/\/$/, "");

        const finalURL = cleanedBaseURL.includes("?")
            ? `${cleanedBaseURL}&${queryParams}`
            : `${cleanedBaseURL}?${queryParams}`;

        setGeneratedURL(finalURL);
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
    };

    const savePreset = () => {
        const newPreset = { baseURL, ...utmParams };
        const updatedPresets = [...presets, newPreset];
        setPresets(updatedPresets);
        localStorage.setItem("utmPresets", JSON.stringify(updatedPresets));
    };

    const loadPreset = (preset) => {
        setBaseURL(preset.baseURL);
        setUtmParams({
            utm_source: preset.utm_source,
            utm_medium: preset.utm_medium,
            utm_campaign: preset.utm_campaign,
        });
    };

    const getYuehliaURL = (url: string) => {
        // convert https://yuehlia.com/product-category/bath/ to yuehlia://product-category/bath and remove the slash at the end
        return url.replace("https://yuehlia.com", "yuehlia:/");
    };

    const openModal = (utmType: any) => {
        const content = utmInfo[utmType] || "No information available.";
        setModalContent(content);
        setIsModalOpen(true);
    };

    return (
        <Card className="p-4 w-full max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg border border-[#bb5394]">
            <CardContent>
                <div className="text-center mb-6">
                    <img
                        src="./assets/logo.png"
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
                    <div className="relative">
                        <input
                            type="text"
                            name="baseURL"
                            value={baseURL}
                            onChange={handleInputChange}
                            placeholder="Enter Base URL"
                            className="w-full p-2 pl-28 border rounded focus:outline-none focus:ring-2 focus:ring-[#bb5394]"
                            style={{ paddingLeft: `${selectWidth + 16}px` }}
                        />

                        <p className="mt-1 ml-0 text-sm text-gray-400">
                            Paste the URL from the website (<b>Product</b> or{" "}
                            <b>Category</b>)
                        </p>
                    </div>
                    {Object.keys(utmParams).map((key) => (
                        <div key={key} className="relative">
                            <input
                                key={key}
                                type="text"
                                name={key}
                                value={utmParams[key]}
                                onChange={handleInputChange}
                                placeholder={`Enter ${key}`}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#bb5394]"
                            />
                            <Button
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#bb5394] text-white hover:bg-[#a54883]"
                                onClick={() => openModal(key)}
                            >
                                ?
                            </Button>
                        </div>
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
                        <div className="mt-4 p-4 border rounded bg-gray-100">
                            <p className="text-sm font-semibold mb-2">
                                Generated URLs:
                            </p>
                            <div className="mb-2">
                                <p className="text-sm font-semibold text-gray-700">
                                    HTTPS URL:
                                </p>
                                <a
                                    href={copyToClipboard(
                                        getYuehliaURL(generatedURL)
                                    )}
                                    rel="noreferrer"
                                    className="break-words text-blue-600"
                                >
                                    {generatedURL}
                                </a>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700">
                                    Yuehlia URL:
                                </p>
                                <a
                                    href={copyToClipboard(
                                        getYuehliaURL(generatedURL)
                                    )}
                                    rel="noreferrer"
                                    className="break-words text-blue-600"
                                >
                                    {getYuehliaURL(generatedURL)}
                                </a>
                            </div>
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
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="UTM Parameter Info"
            >
                <p>{modalContent}</p>
            </Modal>
        </Card>
    );
};

export default URLBuilder;
