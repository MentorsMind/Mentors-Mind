import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  Sparkles,
} from "lucide-react";
import logo from "./assets/logo.png";
import { PasswordStrength } from "./components/PasswordStrength";
import { AnimatedCounter } from "./components/AnimatedCounter";
import { Confetti } from "./components/Confetti";
import { SocialProof } from "./components/SocialProof";
import { useForm } from "./hooks/useForm";
import { signupSchema, type SignupFormData } from "./lib/schemas";

export function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  const { values, getError, handleChange, handleBlur, handleSubmit } =
    useForm<SignupFormData>(
      signupSchema,
      { name: "", email: "", password: "" },
      (data) => {
        setShowConfetti(true);
        setTimeout(() => {
          navigate("/role-selection", { state: data });
        }, 1500);
      },
    );

  // Generate particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 15}s`,
    duration: `${15 + Math.random() * 10}s`,
  }));

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#050B0A] overflow-hidden">
      {/* Success Confetti */}
      <Confetti
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600 animate-gradient"></div>

        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl animate-float-slower"></div>

        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo & Brand */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <img
                src={logo}
                alt="Bentech"
                className="w-12 h-12 object-contain animate-logo-pulse"
              />
              <span className="text-2xl font-bold">MentorMinds</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div
              className="animate-slide-in-left"
              style={{ animationDelay: "100ms" }}
            >
              <h1 className="text-5xl font-bold mb-4 leading-tight">
                Start Your Journey to Excellence
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Connect with world-class mentors and unlock your potential in
                Tech, Business, and Medicine.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              {[
                {
                  icon: Check,
                  text: (
                    <>
                      <AnimatedCounter end={2000} suffix="+" /> Active Learners
                    </>
                  ),
                },
                { icon: Sparkles, text: "Verified Expert Mentors" },
                { icon: Check, text: "1-on-1 Personalized Guidance" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 animate-slide-in-left opacity-0"
                  style={{ animationDelay: `${200 + index * 150}ms` }}
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Quote */}
          <div className="space-y-4">
            <div
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-slide-in-left opacity-0"
              style={{ animationDelay: "650ms" }}
            >
              <p className="text-lg italic mb-2">
                "The best investment you can make is in yourself."
              </p>
              <p className="text-sm text-white/70">— Warren Buffett</p>
            </div>

            {/* Social Proof */}
            <div
              className="animate-slide-in-left opacity-0"
              style={{ animationDelay: "800ms" }}
            >
              <SocialProof />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 w-full flex items-center justify-between p-4 z-10 bg-white/80 dark:bg-[#050B0A]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
          <button
            onClick={() => navigate("/")}
            className="text-gray-800 dark:text-white flex w-10 h-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Bentech" className="w-8 h-8 object-contain" />
            <span className="font-bold text-gray-900 dark:text-white">
              MentorMinds
            </span>
          </div>
          <div className="w-10"></div>
        </header>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Desktop Back Button */}
            <button
              onClick={() => navigate("/")}
              className="hidden lg:flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to home</span>
            </button>

            {/* Form Header */}
            <div
              className="mb-8 mt-20 lg:mt-0 animate-fade-in-up opacity-0"
              style={{ animationDelay: "100ms" }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Create Account
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Join thousands of learners today
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name Input */}
              <div
                className="group animate-fade-in-up opacity-0"
                style={{ animationDelay: "200ms" }}
              >
                <label
                  htmlFor="signup-name"
                  className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2"
                >
                  Full Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Jane Doe"
                  required
                  aria-describedby="signup-name-error"
                  className="w-full bg-gray-50 dark:bg-[#1c2622] text-gray-900 dark:text-white placeholder:text-gray-400 border-2 border-gray-200 dark:border-[#3d524a] focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl h-14 px-4 outline-none transition-all duration-200 input-focus-glow"
                />
                {getError("name") && (
                  <p
                    id="signup-name-error"
                    className="text-red-500 text-xs mt-1"
                    role="alert"
                  >
                    {getError("name")}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div
                className="group animate-fade-in-up opacity-0"
                style={{ animationDelay: "300ms" }}
              >
                <label
                  htmlFor="signup-email"
                  className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="signup-email"
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="jane@startup.com"
                    required
                    aria-describedby="signup-email-error"
                    className="w-full bg-gray-50 dark:bg-[#1c2622] text-gray-900 dark:text-white placeholder:text-gray-400 border-2 border-gray-200 dark:border-[#3d524a] focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl h-14 px-4 outline-none transition-all duration-200 input-focus-glow"
                  />
                  {values.email && !getError("email") && (
                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                {getError("email") && (
                  <p
                    id="signup-email-error"
                    className="text-red-500 text-xs mt-1"
                    role="alert"
                  >
                    {getError("email")}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div
                className="group animate-fade-in-up opacity-0"
                style={{ animationDelay: "400ms" }}
              >
                <label
                  htmlFor="signup-password"
                  className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    required
                    aria-describedby="signup-password-error"
                    className="w-full bg-gray-50 dark:bg-[#1c2622] text-gray-900 dark:text-white placeholder:text-gray-400 border-2 border-gray-200 dark:border-[#3d524a] focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl h-14 pl-4 pr-12 outline-none transition-all duration-200 input-focus-glow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {getError("password") && (
                  <p
                    id="signup-password-error"
                    className="text-red-500 text-xs mt-1"
                    role="alert"
                  >
                    {getError("password")}
                  </p>
                )}
                <PasswordStrength password={values.password} />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="relative w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-lg h-14 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 flex items-center justify-center gap-2 mt-6 animate-fade-in-up opacity-0 ripple-effect btn-shimmer-hover overflow-hidden"
                style={{ animationDelay: "500ms" }}
              >
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-[#2a3832]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white dark:bg-[#050B0A] text-sm text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 h-12 rounded-xl bg-gray-50 dark:bg-[#1c2622] border-2 border-gray-200 dark:border-[#3d524a] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#25302b] hover:border-gray-300 dark:hover:border-gray-500 transition-all active:scale-95 ripple-effect overflow-hidden">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </button>
              <button className="flex-1 h-12 rounded-xl bg-gray-50 dark:bg-[#1c2622] border-2 border-gray-200 dark:border-[#3d524a] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#25302b] hover:border-gray-300 dark:hover:border-gray-500 transition-all active:scale-95 text-gray-900 dark:text-white ripple-effect overflow-hidden">
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.83-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.06-.03.05-.42 1.42-1.38 2.81zm-5.61-16c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.86 1.51-2.95 1.42-.15-1.24.41-2.35 1.05-3.11z"></path>
                </svg>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center space-y-4">
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                By signing up, you agree to our{" "}
                <a
                  href="#"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Terms
                </a>{" "}
                &{" "}
                <a
                  href="#"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Privacy Policy
                </a>
                .
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?
                <button
                  onClick={() => navigate("/login")}
                  className="text-emerald-600 hover:text-emerald-700 transition-colors ml-1 font-bold"
                >
                  Log In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
