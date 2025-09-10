import React, { useState } from "react";
import axios from "axios";
const SignupForm = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [IsLoading, setIsLoading] = useState(false);

  // State for form validation and messages
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { name, email, password } = formData;
    if (!name || !email || !password) {
      setMessage("All fields are required.");
      setMessageType("error");
      return false;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setMessageType("error");
      return false;
    }
    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/auth/signup",
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }
        );
        setIsLoading(false);
        if ([200,202].includes(response.status)) {
          setMessage("Signup succesfully !");
          setMessageType("success");
          setFormData({ name: "", email: "", password: "" });
        } else {
          setMessage("Something went wrong during sign up ");
          setMessageType("error");
        }
      } catch (error) {
        setIsLoading(false);
        if (axios.isAxiosError(error)) {
          if (error.response) {
            setMessage(
              error.response.data.message ||
                "An error occured please try again "
            );
            setMessageType("error");
          } else if (error.request) {
            setMessage(
              "No response from server. Please check your connection."
            );
            setMessageType("error");
          } else {
            setMessage("An unexpected error occurred. Please try again.");
            setMessageType("error");
          }
        } else if (error instanceof Error) {
          setMessage(error.message);
          setMessageType("error");
        } else {
          setMessage("An unknown error occurred.");
          setMessageType("error");
        }
        console.error("Signup error:", error);
      }
    }
  };
  const isFormValid =
    formData.name !== "" && formData.email !== "" && formData.password !== "";

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full shadow-lg">
        <h2 className="text-2xl font-bold text-text-main text-center mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-text-main"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary text-text-main"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-text-main"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary text-text-main"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-text-main"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary text-text-main"
            />
          </div>
          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                messageType === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background transition-colors duration-200 focus:outline-none  focus:ring-offset-2  ${
              isFormValid
                ? "bg-primary hover:bg-secondary"
                : "bg-secondary cursor-not-allowed"
            }`}
          >
            {IsLoading ? (
              <div className="flex items-center justify-center">
                {/* A simple inline SVG spinner */}
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          <span className="text-text-main">Already have an account? </span>
          <a
            href="/auth/signin"
            className="font-medium text-primary hover:text-secondary transition-colors duration-200"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
