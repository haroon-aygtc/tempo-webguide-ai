import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ElementHighlighterProps {
  targetElement?: HTMLElement | null;
  explanation?: string;
  isActive?: boolean;
  highlightColor?: string;
  onClose?: () => void;
}

const ElementHighlighter = ({
  targetElement = null,
  explanation = "This is an important element on the page.",
  isActive = false,
  highlightColor = "#4f46e5",
  onClose = () => {},
}: ElementHighlighterProps) => {
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (targetElement && isActive) {
      const rect = targetElement.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });

      // Show explanation after a short delay
      const timer = setTimeout(() => {
        setShowExplanation(true);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setShowExplanation(false);
    }
  }, [targetElement, isActive]);

  if (!isActive || !targetElement) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none bg-transparent">
      {/* Highlight outline */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute pointer-events-none"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${position.width}px`,
          height: `${position.height}px`,
          boxShadow: `0 0 0 4px ${highlightColor}`,
          borderRadius: "4px",
          zIndex: 9999,
        }}
      />

      {/* Explanation bubble */}
      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-xs pointer-events-auto"
          style={{
            top: `${position.top + position.height + 8}px`,
            left: `${position.left}px`,
            zIndex: 10000,
          }}
        >
          <div className="flex justify-between items-start">
            <div className="text-sm text-gray-700 dark:text-gray-200">
              {explanation}
            </div>
            <button
              onClick={onClose}
              className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ElementHighlighter;
