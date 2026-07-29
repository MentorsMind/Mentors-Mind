import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  DollarSign,
  Upload,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { MedicalProfessional } from "./data";
import { useForm } from "./hooks/useForm";
import {
  medicalRegistrationSchema,
  type MedicalRegistrationFormData,
} from "./lib/schemas";

export function MedicalRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
  );

  const {
    values,
    getError,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useForm<MedicalRegistrationFormData>(
    medicalRegistrationSchema,
    {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "",
      licenseNumber: "",
      experienceYears: "",
      practice: "",
      consultationFee: "",
      about: "",
      state: "",
      country: "",
      specializations: "",
    },
    async (data) => {
      setError("");

      const selectedSpecializations = data.specializations
        .split(";")
        .filter(Boolean);

      if (selectedSpecializations.length === 0) {
        setError("Please select at least one specialization");
        return;
      }

      const existingProfessionals = JSON.parse(
        localStorage.getItem("medicalProfessionals") || "[]",
      );
      if (
        existingProfessionals.some(
          (p: MedicalProfessional) => p.email === data.email,
        )
      ) {
        setError("Email already registered");
        return;
      }

      const newProfessional: MedicalProfessional = {
        id: `med-${Date.now()}`,
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        licenseNumber: data.licenseNumber,
        experienceYears: parseInt(data.experienceYears),
        practice: data.practice,
        specializations: selectedSpecializations,
        about: data.about,
        image: profileImage,
        phone: data.phone,
        state: data.state,
        country: data.country,
        consultationFee: parseInt(data.consultationFee),
        rating: 5.0,
        verified: false,
        registeredAt: new Date().toISOString(),
        sessions: 0,
        reviews: [],
      };

      const updatedProfessionals = [...existingProfessionals, newProfessional];
      localStorage.setItem(
        "medicalProfessionals",
        JSON.stringify(updatedProfessionals),
      );
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ email: data.email, role: "medical" }),
      );

      setSuccess(true);
      setTimeout(() => {
        navigate("/medical-dashboard");
      }, 2000);
    },
  );

  const specialtyOptions = [
    "Cardiology",
    "Pediatrics",
    "General Practice",
    "Dentistry",
    "Psychology",
    "Orthopedics",
    "Dermatology",
    "Ophthalmology",
    "Neurology",
    "Gynecology",
    "Psychiatry",
    "Surgery",
    "Emergency Medicine",
    "Family Medicine",
    "Internal Medicine",
  ];

  const getSpecializationsArray = () =>
    values.specializations.split(";").filter(Boolean);

  const handleSpecializationToggle = (specialty: string) => {
    const current = getSpecializationsArray();
    const updated = current.includes(specialty)
      ? current.filter((s) => s !== specialty)
      : [...current, specialty];
    setFieldValue("specializations", updated.join(";"));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      // Validate step 1 fields manually
      const step1Fields = [
        "name",
        "email",
        "phone",
        "password",
        "confirmPassword",
      ] as const;
      for (const field of step1Fields) {
        if (!values[field]) {
          setError("Please fill in all required fields");
          return;
        }
      }
      if (values.password !== values.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-[#0e1612] dark:to-[#1a2e22] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#1a2e22] rounded-3xl shadow-2xl p-12 max-w-md w-full text-center border border-emerald-100 dark:border-white/10">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Registration Successful!
          </h2>
          <p className="text-slate-600 dark:text-gray-300 mb-6">
            Your account has been created. You'll be redirected to the Medical
            Hub shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-[#0e1612] dark:to-[#1a2e22]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#1a2e22]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/medical")}
            className="flex items-center gap-2 text-slate-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Medical Hub</span>
          </button>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-emerald-600" />
            <span className="font-bold text-slate-900 dark:text-white">
              Medical Registration
            </span>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? "bg-emerald-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"}`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-20 h-1 mx-2 transition-all ${step > s ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-[#1a2e22] rounded-3xl shadow-2xl p-8 md:p-12 border border-emerald-100 dark:border-white/10">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </p>
              </div>
            )}

            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Basic Information
                </h2>

                <div>
                  <label
                    htmlFor="med-name"
                    className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2"
                  >
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="med-name"
                      type="text"
                      name="name"
                      required
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-describedby="med-name-error"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Dr. John Doe"
                    />
                  </div>
                  {getError("name") && (
                    <p
                      id="med-name-error"
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                    >
                      {getError("name")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="med-email"
                    className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2"
                  >
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="med-email"
                      type="email"
                      name="email"
                      required
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-describedby="med-email-error"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="doctor@example.com"
                    />
                  </div>
                  {getError("email") && (
                    <p
                      id="med-email-error"
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                    >
                      {getError("email")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="med-phone"
                    className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2"
                  >
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="med-phone"
                      type="tel"
                      name="phone"
                      required
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-describedby="med-phone-error"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="08012345678"
                    />
                  </div>
                  {getError("phone") && (
                    <p
                      id="med-phone-error"
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                    >
                      {getError("phone")}
                    </p>
                  )}
                </div>

                {/* Profile Picture Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <img
                        src={profileImage}
                        alt="Profile preview"
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-gray-200 dark:border-white/10"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="cursor-pointer">
                        <div className="flex items-center gap-3 px-6 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/10 transition-colors">
                          <Upload className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white text-sm">
                              Upload Photo
                            </p>
                            <p className="text-xs text-slate-500 dark:text-gray-400">
                              JPG, PNG or GIF (max 5MB)
                            </p>
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="med-password"
                    className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2"
                  >
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="med-password"
                      type="password"
                      name="password"
                      required
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-describedby="med-password-error"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                  {getError("password") && (
                    <p
                      id="med-password-error"
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                    >
                      {getError("password")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="med-confirm-password"
                    className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2"
                  >
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="med-confirm-password"
                      type="password"
                      name="confirmPassword"
                      required
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-describedby="med-confirm-password-error"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                  {getError("confirmPassword") && (
                    <p
                      id="med-confirm-password-error"
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                    >
                      {getError("confirmPassword")}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Professional Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Professional Details
                </h2>

                <div>
                  <label
                    htmlFor="med-role"
                    className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2"
                  >
                    Medical Title/Role *
                  </label>
                  <div className="relative">
                    <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="med-role"
                      type="text"
                      name="role"
                      required
                      value={values.role}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-describedby="med-role-error"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="e.g., Cardiologist, Pediatrician"
                    />
                  </div>
                  {getError("role") && (
                    <p
                      id="med-role-error"
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                    >
                      {getError("role")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="med-license"
                    className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2"
                  >
                    Medical License Number *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="med-license"
                      type="text"
                      name="licenseNumber"
                      required
                      value={values.licenseNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-describedby="med-license-error"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="License number"
                    />
                  </div>
                  {getError("licenseNumber") && (
                    <p
                      id="med-license-error"
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                    >
                      {getError("licenseNumber")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="med-experience"
                    className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2"
                  >
                    Years of Experience *
                  </label>
                  <input
                    id="med-experience"
                    type="number"
                    name="experienceYears"
                    required
                    min={0}
                    value={values.experienceYears}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-describedby="med-experience-error"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="10"
                  />
                  {getError("experienceYears") && (
                    <p
                      id="med-experience-error"
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                    >
                      {getError("experienceYears")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="med-practice"
                    className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2"
                  >
                    Hospital/Clinic/Practice Name *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="med-practice"
                      type="text"
                      name="practice"
                      required
                      value={values.practice}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-describedby="med-practice-error"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Medical Center Name"
                    />
                  </div>
                  {getError("practice") && (
                    <p
                      id="med-practice-error"
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                    >
                      {getError("practice")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="med-fee"
                    className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2"
                  >
                    Consultation Fee (₦) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="med-fee"
                      type="number"
                      name="consultationFee"
                      required
                      min={0}
                      value={values.consultationFee}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-describedby="med-fee-error"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="10000"
                    />
                  </div>
                  {getError("consultationFee") && (
                    <p
                      id="med-fee-error"
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                    >
                      {getError("consultationFee")}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Additional Information */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Additional Information
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                    Specializations * (Select at least one)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {specialtyOptions.map((specialty) => {
                      const selected =
                        getSpecializationsArray().includes(specialty);
                      return (
                        <button
                          key={specialty}
                          type="button"
                          onClick={() => handleSpecializationToggle(specialty)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${selected ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                        >
                          {specialty}
                        </button>
                      );
                    })}
                  </div>
                  {getError("specializations") && (
                    <p
                      id="med-specializations-error"
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                    >
                      {getError("specializations")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="med-about"
                    className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2"
                  >
                    Professional Bio *
                  </label>
                  <textarea
                    id="med-about"
                    name="about"
                    required
                    rows={4}
                    value={values.about}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-describedby="med-about-error"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="Tell patients about your experience, expertise, and approach to healthcare..."
                  />
                  {getError("about") && (
                    <p
                      id="med-about-error"
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                    >
                      {getError("about")}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="med-state"
                      className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2"
                    >
                      State *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        id="med-state"
                        type="text"
                        name="state"
                        required
                        value={values.state}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-describedby="med-state-error"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Lagos"
                      />
                    </div>
                    {getError("state") && (
                      <p
                        id="med-state-error"
                        className="text-red-500 text-xs mt-1"
                        role="alert"
                      >
                        {getError("state")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="med-country"
                      className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2"
                    >
                      Country *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        id="med-country"
                        type="text"
                        name="country"
                        required
                        value={values.country}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-describedby="med-country-error"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#29382f] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Nigeria"
                      />
                    </div>
                    {getError("country") && (
                      <p
                        id="med-country-error"
                        className="text-red-500 text-xs mt-1"
                        role="alert"
                      >
                        {getError("country")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-white/10 text-slate-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  Previous
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/30 transition-all"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/30 transition-all"
                >
                  Complete Registration
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
