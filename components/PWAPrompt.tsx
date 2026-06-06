"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PWAPrompt() {
  const [showModal, setShowModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if prompt has been shown before
    const hasPrompted = localStorage.getItem("pwaPrompted");

    const timer = setTimeout(() => {
      if (!hasPrompted && !window.matchMedia('(display-mode: standalone)').matches) {
        setShowModal(true);
      }
    }, 5000);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait to show prompt or show install button
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setDeferredPrompt(null);
    } else {
        alert("To install, use your browser's 'Add to Home Screen' option.");
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    localStorage.setItem("pwaPrompted", "true");
  };

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 right-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-96 z-50 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl flex items-start gap-4"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0">
               <span className="text-xl font-bold text-white">S</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold mb-1">Install our app</h3>
              <p className="text-slate-400 text-sm mb-3">Get a faster experience. Add to Home Screen.</p>
              <div className="flex gap-2">
                <button onClick={handleInstall} className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-2 rounded-lg text-sm font-bold transition-colors">Install</button>
                <button onClick={closeModal} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm transition-colors">Not now</button>
              </div>
            </div>
            <button onClick={closeModal} className="text-slate-400 hover:text-white shrink-0"><X className="w-5 h-5"/></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating global install button if supported or just add it to footer later */}
      {deferredPrompt && !showModal && (
          <button onClick={handleInstall} className="fixed bottom-4 left-4 z-40 bg-violet-600 hover:bg-violet-500 text-white p-3 rounded-full shadow-lg shadow-violet-500/20 group hidden sm:flex items-center gap-2 pr-4">
              <Download className="w-5 h-5" />
              <span className="text-sm font-bold overflow-hidden whitespace-nowrap max-w-0 group-hover:max-w-xs transition-all duration-300">Install App</span>
          </button>
      )}
    </>
  );
}
