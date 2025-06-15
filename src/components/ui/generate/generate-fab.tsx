import { cn } from "@/lib/utils";
import { Button } from "@components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./generate-fab.css";

export function GenerateFab() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasEntranceCompleted, setHasEntranceCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setDescription("");
    setIsGenerating(false);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!description.trim()) return;

    setIsGenerating(true);
    try {
      // TODO: implement the actual image generation logic
      closeModal();
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [description, closeModal]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleGenerate();
    },
    [handleGenerate],
  );

  // Handle keyboard shortcuts and navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to toggle modal
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isModalOpen) {
          closeModal();
        } else {
          openModal();
        }
        return;
      }

      // Escape to close modal
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
        return;
      }
    },
    [isModalOpen, openModal, closeModal],
  );

  // Add global keyboard event listener
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Remove entrance animation after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasEntranceCompleted(true);
    }, 500); // Match the animation duration
    return () => clearTimeout(timer);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100); // Small delay to ensure modal is rendered
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal();
      }
    },
    [closeModal],
  );

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={openModal}
          size="lg"
          className={cn(
            "h-14 w-14 rounded-full shadow-lg hover:shadow-xl",
            "bg-primary hover:bg-primary/90",
            "generate-fab-button",
            "hover:scale-110 active:scale-95",
            "transition-all duration-200 ease-out",
            "group",
            !hasEntranceCompleted && "fab-entrance",
          )}
          aria-label="Generate Image (Cmd+K)"
        >
          <div className="relative">
            <Plus className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center",
            "bg-black/50 backdrop-blur-sm",
            "generate-fab-modal-backdrop animate-fade-in",
          )}
          onClick={handleBackdropClick}
        >
          <div
            ref={modalRef}
            className={cn(
              "relative w-full max-w-md mx-4",
              "bg-background border border-border rounded-lg shadow-xl",
              "generate-fab-modal-content animate-scale-up-fade-in",
            )}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Generate Image
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Describe the image you want to create
              </p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Image Description"
                  disabled={isGenerating}
                  className={cn(
                    "w-full px-4 py-3 rounded-md border border-input",
                    "bg-background text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                    "generate-fab-input",
                    "text-base", // Prevent zoom on iOS
                    isGenerating && "opacity-50 cursor-not-allowed",
                  )}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={isGenerating}
                  className="flex-1 generate-fab-button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!description.trim() || isGenerating}
                  className={cn(
                    "flex-1 relative generate-fab-button",
                    isGenerating && "cursor-not-allowed",
                  )}
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Generate</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>

            {/* Keyboard shortcut hint */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Press Esc to close</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono generate-fab-kbd">
                    ⌘K
                  </kbd>
                  <span>to toggle</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
