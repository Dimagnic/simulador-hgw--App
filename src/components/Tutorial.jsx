import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function Tutorial() {
  const { t, closeTutorial } = useApp();
  const [step, setStep] = useState(0);

  const steps = [
    { title: t.tutorialStep1Title, desc: t.tutorialStep1Desc, emoji: '🏠' },
    { title: t.tutorialStep2Title, desc: t.tutorialStep2Desc, emoji: '👤' },
    { title: t.tutorialStep3Title, desc: t.tutorialStep3Desc, emoji: '🎲' },
    { title: t.tutorialStep4Title, desc: t.tutorialStep4Desc, emoji: '🎯' },
    { title: t.tutorialStep5Title, desc: t.tutorialStep5Desc, emoji: '✅' },
    { title: t.tutorialStep6Title, desc: t.tutorialStep6Desc, emoji: '🚀' },
  ];

  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-300">
        {/* Close */}
        <button
          onClick={closeTutorial}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{steps[step].emoji}</div>
          <h2 className="text-xl font-bold text-foreground">{steps[step].title}</h2>
        </div>

        {/* Body */}
        <p className="text-muted-foreground text-center leading-relaxed mb-6">
          {steps[step].desc}
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                i === step ? 'bg-primary w-6' : 'bg-border hover:bg-muted-foreground'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={closeTutorial}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.tutorialSkip}
          </button>

          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                {t.tutorialPrev.replace('← ', '')}
              </button>
            )}
            {isLast ? (
              <button
                onClick={closeTutorial}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-md"
              >
                <Check className="w-4 h-4" />
                {t.tutorialFinish}
              </button>
            ) : (
              <button
                onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-1 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-md"
              >
                {t.tutorialNext.replace(' →', '')}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
