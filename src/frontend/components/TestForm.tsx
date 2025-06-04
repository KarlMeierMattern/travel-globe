"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

export default function TestForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      setErrors(["Passwords do not match"]);
      setIsSubmitting(false);
      return;
    }

    // Submit to server
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors([]);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-6 bg-white bg-opacity-60 p-8 rounded-xl shadow-md w-full max-w-md"
      >
        {errors.length > 0 && (
          <ul>
            {errors.map((error) => (
              <li
                key={error}
                className="bg-red-100 text-red-500 px-4 py-2 rounded-md"
              >
                {error}
              </li>
            ))}
          </ul>
        )}
        <input
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="px-6 py-4 rounded-lg bg-white bg-opacity-80 text-lg placeholder-gray-400 focus:outline-none border-1 border-gray-300"
        />
        <input
          value={password}
          type="password"
          minLength={8}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="px-6 py-4 rounded-lg bg-white bg-opacity-80 text-lg placeholder-gray-400 focus:outline-none border-1 border-gray-300"
        />
        <input
          value={confirmPassword}
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          className="px-6 py-4 rounded-lg bg-white bg-opacity-80 text-lg placeholder-gray-400 focus:outline-none border-1 border-gray-300"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white text-lg font-semibold py-3 rounded-lg transition-colors cursor-pointer"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
