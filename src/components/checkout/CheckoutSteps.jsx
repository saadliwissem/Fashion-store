import React from "react";
import { Check } from "lucide-react";

const CheckoutSteps = ({ steps, currentStep }) => {
  return (
    <div className="relative">
      {/* Progress Bar */}
      <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
        <div
          className="h-1 bg-gradient-to-r from-primary-500 to-black transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index + 1 < currentStep;
          const isCurrent = index + 1 === currentStep;
          const stepNumber = index + 1;

          return (
            <div key={step.id} className="flex flex-col items-center relative">
              {/* Step Circle */}
              <div
                className={`
                w-8 h-8 rounded-full flex items-center justify-center mb-2
                ${
                  isCompleted
                    ? "bg-gradient-to-r from-primary-500 to-black text-white"
                    : ""
                }
                ${
                  isCurrent
                    ? "bg-white border-2 border-primary-500 text-primary-500"
                    : ""
                }
                ${!isCompleted && !isCurrent ? "bg-gray-200 text-gray-400" : ""}
                transition-all duration-300
              `}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="font-semibold text-sm">{stepNumber}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="text-center">
                <p
                  className={`text-xs font-medium ${
                    isCurrent || isCompleted ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.name}
                </p>
                <p className="text-xs text-gray-500 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;
