import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, X, RefreshCw, Check, AlertCircle, Sparkles, SunMedium, Smartphone } from "lucide-react";
import { Language } from "../types";
import { TRANSLATIONS } from "../constants";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
  language: Language;
}

export default function CameraModal({ isOpen, onClose, onCapture, language }: CameraModalProps) {
  const t = TRANSLATIONS[language];
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  // Check available cameras
  useEffect(() => {
    if (!isOpen) return;
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        setHasMultipleCameras(videoDevices.length > 1);
      }).catch(() => {});
    }
  }, [isOpen]);

  // Start or restart camera stream
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    stopCamera();
    setIsInitializing(true);
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser environment.");
      }

      // Try preferred constraints
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      };

      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        // Fallback to basic video constraint if ideal failed
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      let message = t.cameraPermissionDenied;
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        message = language === "ta" 
          ? "கேமரா அனுமதி மறுக்கப்பட்டது. தயவுசெய்து உங்கள் உலாவி அமைப்புகளில் கேமரா அனுமதியை அனுமதிக்கவும்."
          : "Camera permission was denied. Please allow camera access in your browser settings or use file upload.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        message = language === "ta"
          ? "சாதனத்தில் கேமரா எதுவும் கிடைக்கவில்லை. புகைப்படத்தைப் பதிவேற்றவும்."
          : "No camera device found on this system. Please upload a photo instead.";
      }
      setCameraError(message);
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 960;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // If front camera, flip horizontally for natural mirror feel
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-[#1A1A1A] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 flex items-center justify-between border-b border-white/10 text-white z-10 bg-[#1A1A1A]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A5A40] flex items-center justify-center text-white">
              <Camera size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">{t.openCamera}</h3>
              <p className="text-xs text-white/50">{t.alignLeafInstruction}</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Viewfinder / Video Canvas Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[360px] sm:min-h-[440px]">
          {/* Error Message */}
          {cameraError ? (
            <div className="p-8 text-center max-w-md text-white space-y-4">
              <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={32} />
              </div>
              <p className="text-sm text-white/80 leading-relaxed">{cameraError}</p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={startCamera}
                  className="px-5 py-2.5 bg-[#5A5A40] hover:bg-[#4A4A30] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} /> Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold"
                >
                  Close & Upload File
                </button>
              </div>
            </div>
          ) : capturedImage ? (
            /* Image Preview after Capture */
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={capturedImage}
                alt="Captured Leaf"
                className="max-h-[50vh] sm:max-h-[56vh] w-auto max-w-full object-contain rounded-xl"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-white/90 flex items-center gap-2 border border-white/10">
                <Check size={14} className="text-green-400" />
                Photo Captured Ready
              </div>
            </div>
          ) : (
            /* Live Stream */
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`w-full h-full object-cover max-h-[50vh] sm:max-h-[56vh] ${
                  facingMode === "user" ? "-scale-x-100" : ""
                }`}
              />

              {/* Viewfinder Reticle Overlay */}
              <div className="absolute inset-8 sm:inset-12 pointer-events-none border-2 border-white/30 rounded-3xl flex flex-col justify-between p-4">
                <div className="flex justify-between">
                  <div className="w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-xl -mt-1 -ml-1" />
                  <div className="w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-xl -mt-1 -mr-1" />
                </div>
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-medium text-white/80 border border-white/10">
                    <SunMedium size={12} className="text-amber-400" /> Good lighting recommended
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-xl -mb-1 -ml-1" />
                  <div className="w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-xl -mb-1 -mr-1" />
                </div>
              </div>

              {isInitializing && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white gap-3">
                  <RefreshCw className="animate-spin text-green-400" size={32} />
                  <p className="text-sm font-medium text-white/80">Starting live camera...</p>
                </div>
              )}
            </div>
          )}

          {/* Hidden Canvas for Snapshot Generation */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Controls Footer */}
        <div className="p-4 sm:p-6 bg-[#1A1A1A] border-t border-white/10 flex items-center justify-between text-white">
          {capturedImage ? (
            /* Post-capture controls */
            <div className="w-full flex items-center justify-between gap-4">
              <button
                onClick={retakePhoto}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw size={18} />
                {t.retake}
              </button>
              <button
                onClick={confirmPhoto}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#5A5A40]/30"
              >
                <Check size={18} />
                {t.usePhoto}
              </button>
            </div>
          ) : (
            /* Live Stream controls */
            <div className="w-full flex items-center justify-between gap-4">
              <div className="w-14">
                {hasMultipleCameras && (
                  <button
                    onClick={switchCamera}
                    title={t.switchCamera}
                    className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  >
                    <Smartphone size={20} />
                  </button>
                )}
              </div>

              {/* Shutter Button */}
              <button
                onClick={takeSnapshot}
                disabled={!!cameraError || isInitializing}
                className="group relative flex items-center justify-center w-18 h-18 rounded-full border-4 border-white/80 hover:border-white transition-all disabled:opacity-40"
              >
                <div className="w-14 h-14 bg-white rounded-full group-hover:scale-95 transition-transform flex items-center justify-center shadow-lg">
                  <Camera size={24} className="text-[#1A1A1A]" />
                </div>
              </button>

              <div className="w-14 flex justify-end">
                <button
                  onClick={onClose}
                  className="text-xs font-semibold text-white/50 hover:text-white px-2 py-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
