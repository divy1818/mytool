"use client";
import { useState } from "react";
import { removeBackground } from "@imgly/background-removal";

export default function Home() {
  const [originalImage, setOriginalImage] = useState < string | null > (null);
  const [processedImage, setProcessedImage] = useState < string | null > (null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState < string | null > (null);

  const handleFileChange = (e: React.ChangeEvent < HTMLInputElement > ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setProcessedImage(null); // Reset processed image when new one is uploaded
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!originalImage) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resultBlob = await removeBackground(originalImage);
      const resultUrl = URL.createObjectURL(resultBlob);
      setProcessedImage(resultUrl);
    } catch (e: any) {
      setError("Failed to process image. The model might be too large for your device. Please refresh and try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) {
      setError("No processed image to download.");
      return;
    }
    const a = document.createElement("a");
    a.href = processedImage;
    a.download = "background-removed.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    < main className = "flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100" >
      < div className = "w-full max-w-4xl bg-white rounded-lg shadow-xl p-8" >
        < h1 className = "text-4xl font-bold text-center text-gray-800 mb-2" > Free Background Remover < /h1>
          < p className = "text-center text-gray-500 mb-8" >
          Powered by < code className = "font-mono bg-gray-200 p-1 rounded" > @imgly/background-removal < /code>.Processing happens in your browser. <
          /p>

          < div className = "grid grid-cols-1 md:grid-cols-2 gap-8" >
            { /* Upload Section */ }
            < div className = "flex flex-col items-center" >
              < label htmlFor = "file-upload" className = "w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50" >
                {
                  originalImage ? (
                    <img src = {
                      originalImage
                    }
                    alt = "Original" className = "max-h-full max-w-full" / >
                  ) : (
                    <span className = "text-gray-400" > Click to upload an image < /span>
                  )
                }
                < /label>
                < input id = "file-upload" type = "file" className = "hidden" accept = "image/*" onChange = {
                  handleFileChange
                }
                />
                < button onClick = {
                  processImage
                }
                disabled = {!originalImage || isLoading
                }
                className = "mt-4 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all" >
                  {
                    isLoading ? "Processing..." : "Remove Background"
                  }
                  < /button>
                  < /div>

                  { /* Result Section */ }
                  < div className = "flex flex-col items-center" >
                    < div className = "w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50" >
                      {
                        processedImage ? (
                          <img src = {
                            processedImage
                          }
                          alt = "Background Removed" className = "max-h-full max-w-full" / >
                        ) : (
                          <span className = "text-gray-400" > Processed image will appear here < /span>
                        )
                      }
                      < /div>
                      < button onClick = {
                        downloadImage
                      }
                      disabled = {!processedImage
                      }
                      className = "mt-4 w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all" >
                        Download Image
                        < /button>
                        < /div>
                        < /div>

                        {
                          error && (
                            <div className = "mt-6 text-center text-red-600 bg-red-100 p-3 rounded-lg" >
                              <p> {
                                error
                              } < /p>
                              < /div>
                          )
                        }
                        < /div>
                        < /main>
                  );
                }
