
"use client";
import { useState, useRef } from "react";
import { removeBackground } from "@imgly/background-removal";
import { FaImage, FaDownload, FaTrash, FaMagic } from "react-icons/fa";

export default function Home() {
  const [image, setImage] = useState<{ original: string; processed: string | null }>({
    original: "",
    processed: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage({ original: event.target?.result as string, processed: null });
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image.original) {
      setError("Please upload an image first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const resultBlob = await removeBackground(image.original);
      const resultUrl = URL.createObjectURL(resultBlob);
      setImage((prev) => ({ ...prev, processed: resultUrl }));
    } catch (e: any) {
      setError(`An error occurred: ${e.message}. Please try a different image or refresh the page.`);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (image.processed) {
      const a = document.createElement("a");
      a.href = image.processed;
      a.download = "background-removed.png";
      a.click();
    }
  };
  
  const resetState = () => {
      setImage({ original: "", processed: null });
      setError(null);
      if(fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 transition-all">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-gray-800">
            AI Background Remover
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            100% Free, Private, and Automatic. Runs entirely in your browser.
          </p>
        </div>

        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        )}

        {!image.original ? (
          <div 
            onClick={handleFileSelect}
            className="flex flex-col items-center justify-center border-4 border-dashed border-gray-300 rounded-2xl p-16 cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-all duration-300">
            <FaImage className="text-6xl text-gray-400 mb-4" />
            <p className="text-2xl font-semibold text-gray-700">Click to Upload Image</p>
            <p className="text-gray-500 mt-2">PNG, JPG, WEBP supported</p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Original Image Card */}
            <div className="flex flex-col items-center">
                 <h2 className="text-2xl font-bold text-gray-700 mb-4">Original</h2>
                 <img
                    src={image.original}
                    alt="Original"
                    className="rounded-xl shadow-lg w-full h-auto object-contain max-h-96"
                  />
                  <button 
                    onClick={resetState}
                    className="mt-4 flex items-center justify-center px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all duration-300">
                      <FaTrash className="mr-2" /> Remove
                  </button>
            </div>

            {/* Processed Image / Action Card */}
            <div className="flex flex-col items-center h-full">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Result</h2>
                <div className="w-full h-full min-h-96 flex items-center justify-center bg-gray-100 rounded-xl shadow-inner">
                    {isLoading ? (
                        <div className="flex flex-col items-center text-gray-600">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                            <p className="mt-4 font-semibold">Processing...</p>
                        </div>
                    ) : image.processed ? (
                         <img
                            src={image.processed}
                            alt="Background Removed"
                            className="rounded-xl shadow-lg w-full h-auto object-contain max-h-96"
                         />
                    ) : (
                        <div className="text-center text-gray-500">
                            <p>Click the button to remove the background.</p>
                        </div>
                    )}
                </div>
                {!image.processed ? (
                    <button
                        onClick={processImage}
                        disabled={isLoading}
                        className="w-full mt-4 flex items-center justify-center py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-xl rounded-lg shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-transform duration-300">
                        <FaMagic className="mr-3" />
                        {isLoading ? 'Working on it...' : 'Remove Background'}
                    </button>
                ) : (
                    <button
                        onClick={downloadImage}
                        className="w-full mt-4 flex items-center justify-center py-4 px-6 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-xl rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                        <FaDownload className="mr-3" />
                        Download Image
                    </button>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
