import React from 'react';
import { useForm } from "react-hook-form";
import useRegister from '../Hooks/useRegister';
import { Music, Mail, Lock, User, Headset } from 'lucide-react'; // Using lucide-react for icons
import { Link } from "@tanstack/react-router";


export const Register = () => {
  const { mutate, isLoading } = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = data => {
    mutate(data);
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
        
        {/* Logo / Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <Music className="text-white w-8 h-8" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Create Your Beat
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Join the community of 10M+ listeners.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              {...register("name", { required: "What's your stage name?" })}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="Full Name"
            />
            {errors.name && <p className="text-xs text-pink-500 mt-1 ml-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="Email Address"
            />
            {errors.email && <p className="text-xs text-pink-500 mt-1 ml-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="password"
              {...register("password", { 
                required: "Set a secure password",
                minLength: { value: 6, message: "Too short! (Min 6 chars)" }
              })}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="Password"
            />
            {errors.password && <p className="text-xs text-pink-500 mt-1 ml-1">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg transform transition active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="animate-pulse">Tuning in...</span>
            ) : (
              <>
                <Headset className="w-5 h-5" />
                Start Listening
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            By signing up, you agree to our <span className="text-purple-400 cursor-pointer">Terms of Service</span>.
          </p>
          <p className="text-center text-sm text-gray-400">
            Already have an account?  <span className="text-purple-400 cursor-pointer"><Link to="/login"> Log in</Link></span>
          </p>
        </form>
      </div>
    </div>
  );
};