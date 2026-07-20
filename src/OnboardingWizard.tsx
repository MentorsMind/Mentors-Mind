import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Briefcase,
  Award,
  Calendar,
  Check,
  ChevronRight,
  Upload,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuth } from "./contexts/AuthContext";

type OnboardingData = {
  // Step 2: Profile Photo
  image?: string;

  // Step 3: Professional Info
  title?: string;
  company?: string;
  bio?: string;

  // Step 4: Expertise
  specializations: Array<{ name: string; price: number }>;

  // Step 5: Availability
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
};

const STORAGE_KEY = "onboarding_data";
const TOTAL_STEPS = 5;

const steps = [
  { id: 1, name: "Welcome", icon: Check },
  { id: 2, name: "Photo", icon: Camera },
  { id: 3, name: "Professional", icon: Briefcase },
  { id: 4, name: "Expertise", icon: Award },
  { id: 5, name: "Availability", icon: Calendar },
];

export function OnboardingWizard() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [data, setData] = useState<OnboardingData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse onboarding data", e);
      }
    }
    return {
      specializations: [],
      availability: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      },
    };
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateField = <K extends keyof OnboardingData>(
    field: K,
    value: OnboardingData[K],
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        // Welcome step - no validation needed
        break;

      case 2:
        // Profile photo is optional
        break;

      case 3:
        if (!data.title?.trim()) {
          newErrors.title = "Professional title is required";
        }
        if (!data.company?.trim()) {
          newErrors.company = "Company/organization is required";
        }
        if (!data.bio?.trim()) {
          newErrors.bio = "Bio is required";
        } else if (data.bio.length < 50) {
          newErrors.bio = "Bio must be at least 50 characters";
        }
        break;

      case 4:
        if (data.specializations.length === 0) {
          newErrors.specializations = "Add at least one specialization";
        } else {
          data.specializations.forEach((spec, index) => {
            if (!spec.name.trim()) {
              newErrors[`spec_name_${index}`] =
                "Specialization name is required";
            }
            if (spec.price <= 0) {
              newErrors[`spec_price_${index}`] = "Price must be greater than 0";
            }
          });
        }
        break;

      case 5:
        const hasAvailability = Object.values(data.availability).some((v) => v);
        if (!hasAvailability) {
          newErrors.availability = "Please select at least one available day";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!validateStep(currentStep)) return;

    try {
      // Save all onboarding data to user profile
      await updateUser({
        image: data.image,
        title: data.title,
        company: data.company,
        about: data.bio,
        specializations: data.specializations,
        onboardingCompleted: true,
      });

      // Clear onboarding data from localStorage
      localStorage.removeItem(STORAGE_KEY);

      // Redirect to mentor dashboard
      navigate("/mentor-dashboard");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      setErrors({ submit: "Failed to save profile. Please try again." });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSpecialization = () => {
    updateField("specializations", [
      ...data.specializations,
      { name: "", price: 0 },
    ]);
  };

  const updateSpecialization = (
    index: number,
    field: "name" | "price",
    value: string | number,
  ) => {
    const updated = [...data.specializations];
    updated[index] = { ...updated[index], [field]: value };
    updateField("specializations", updated);
  };

  const removeSpecialization = (index: number) => {
    const updated = data.specializations.filter((_, i) => i !== index);
    updateField("specializations", updated);
  };

  const toggleDay = (day: keyof OnboardingData["availability"]) => {
    updateField("availability", {
      ...data.availability,
      [day]: !data.availability[day],
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Welcome to MentorMinds! 🎉
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Let's set up your mentor profile so learners can discover you.
                This will only take a few minutes.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-left">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>What you'll need:</strong>
              </p>
              <ul className="text-sm text-blue-800 dark:text-blue-300 mt-2 space-y-1 list-disc list-inside">
                <li>A professional photo (optional)</li>
                <li>Your job title and company</li>
                <li>A brief bio about yourself</li>
                <li>Your areas of expertise with pricing</li>
                <li>Your weekly availability</li>
              </ul>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Add a Profile Photo
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Help learners connect with you by adding a professional photo
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div
                  className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-700 bg-cover bg-center ring-4 ring-white dark:ring-gray-800 shadow-lg"
                  style={{
                    backgroundImage: data.image
                      ? `url(${data.image})`
                      : undefined,
                  }}
                >
                  {!data.image && (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                {data.image && (
                  <button
                    onClick={() => updateField("image", undefined)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
                  <Upload className="w-5 h-5" />
                  <span className="font-semibold">Upload Photo</span>
                </div>
              </label>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                or skip this step and add it later
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Professional Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Tell learners about your professional background
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Professional Title *
                </label>
                <input
                  type="text"
                  value={data.title || ""}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.title
                      ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  } text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-colors`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Company / Organization *
                </label>
                <input
                  type="text"
                  value={data.company || ""}
                  onChange={(e) => updateField("company", e.target.value)}
                  placeholder="e.g., Google, Microsoft, Freelance"
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.company
                      ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  } text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-colors`}
                />
                {errors.company && (
                  <p className="text-red-500 text-sm mt-1">{errors.company}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Bio * (minimum 50 characters)
                </label>
                <textarea
                  value={data.bio || ""}
                  onChange={(e) => updateField("bio", e.target.value)}
                  placeholder="Tell learners about your experience, expertise, and what they can expect from your mentorship..."
                  rows={6}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.bio
                      ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  } text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-colors resize-none`}
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {data.bio?.length || 0} / 50 characters minimum
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Your Expertise
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Add your specializations and set your hourly rates
              </p>
            </div>

            <div className="space-y-4">
              {data.specializations.map((spec, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1 space-y-3">
                    <div>
                      <input
                        type="text"
                        value={spec.name}
                        onChange={(e) =>
                          updateSpecialization(index, "name", e.target.value)
                        }
                        placeholder="e.g., React Development"
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          errors[`spec_name_${index}`]
                            ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                        } text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-colors`}
                      />
                      {errors[`spec_name_${index}`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[`spec_name_${index}`]}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        value={spec.price || ""}
                        onChange={(e) =>
                          updateSpecialization(
                            index,
                            "price",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className={`w-full pl-8 pr-4 py-3 rounded-xl border-2 ${
                          errors[`spec_price_${index}`]
                            ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                        } text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-colors`}
                      />
                      {errors[`spec_price_${index}`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[`spec_price_${index}`]}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeSpecialization(index)}
                    className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors mt-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}

              {errors.specializations && (
                <p className="text-red-500 text-sm">{errors.specializations}</p>
              )}

              <button
                onClick={addSpecialization}
                className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Add Specialization</span>
              </button>
            </div>
          </div>
        );

      case 5:
        const days = [
          { key: "monday" as const, label: "Monday" },
          { key: "tuesday" as const, label: "Tuesday" },
          { key: "wednesday" as const, label: "Wednesday" },
          { key: "thursday" as const, label: "Thursday" },
          { key: "friday" as const, label: "Friday" },
          { key: "saturday" as const, label: "Saturday" },
          { key: "sunday" as const, label: "Sunday" },
        ];

        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Set Your Availability
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Select the days you're available for mentorship sessions
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {days.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => toggleDay(key)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    data.availability[key]
                      ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{label}</span>
                    {data.availability[key] && (
                      <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {errors.availability && (
              <p className="text-red-500 text-sm text-center">
                {errors.availability}
              </p>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>Note:</strong> You can update your availability and time
                slots anytime from your dashboard settings.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentStep > step.id
                        ? "bg-emerald-600 text-white"
                        : currentStep === step.id
                          ? "bg-emerald-600 text-white ring-4 ring-emerald-200 dark:ring-emerald-800"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      currentStep >= step.id
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        currentStep > step.id
                          ? "bg-emerald-600"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                      style={{ width: currentStep > step.id ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Step {currentStep} of {TOTAL_STEPS}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
          {renderStep()}

          {/* Error Message */}
          {errors.submit && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm">
                {errors.submit}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 py-4 px-6 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
            )}

            {currentStep < TOTAL_STEPS ? (
              <button
                onClick={handleNext}
                className="flex-1 py-4 px-6 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex-1 py-4 px-6 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>Complete Setup</span>
              </button>
            )}
          </div>
        </div>

        {/* Skip Option (except for last step) */}
        {currentStep < TOTAL_STEPS && (
          <div className="text-center mt-6">
            <button
              onClick={() => navigate("/mentor-dashboard")}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Skip for now (you can complete this later)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
