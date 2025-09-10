import axios from "axios";
import React, { useState } from "react";

export default function SignInForm() {
  const [formData, setFromData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFromData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const { email, password } = formData;
    if (!email.trim() || !password.trim()) {
      setMessage("All fields are required.");
      setMessageType("error");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setMessage("Please enter a valid email.");
      setMessageType("error");
      return false;
    }
    // If all checks pass, the form is valid
    return true; 
  };

  const handleSubmit = async (e:React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsLoading(true);
        setMessage('')
        setMessageType('')
        const response = await axios.post(
          "http://localhost:5000/api/v1/auth/signin",
          {
            email: formData.email,
            password: formData.password,
          }
        );
        setIsLoading(false);
        setMessage(response.data.msg)
        setMessageType("success")
        setFromData({email:'',password:''})
        console.log(response)
        
      } catch (error) {
        setIsLoading(false);
        if (axios.isAxiosError(error)) {
          const backendMessage = error.response?.data?.msg || "An unexpected error occurred.";
          setMessage(backendMessage );
          setMessageType("error");
        } else if (error instanceof Error) {
          setMessage(error.message);
          setMessageType("error");
        } else {
          setMessage("An unknown error occurred.");
          setMessageType("error");
        }
        console.error(error);
      }
    }
  };

  const isFormValid = formData.email.trim() !== "" && formData.password.trim() !== "";
  
  return (
    <div className="flex justify-center items-center bg-background min-h-screen">
      <div className="bg-white rounded-lg p-8 m-8 max-w-sm w-full shadow-lg">
        <h2 className="text-2xl text-text-main text-center font-bold mb-4">
          Sign In To Substack
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-text-main font-medium text-md"
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full p-1.5 rounded-md border-gray-300 shadow-sm text-text-main"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-text-main font-medium text-md"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full shadow-md p-1.5 cursor-auto caret-black mt-1.5 text-black rounded-md"
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
            disabled={!isFormValid || isLoading} // Add isLoading to disable state
            className={`rounded-md w-full text-center py-2 px-4 border border-transparent shadow-sm font-medium text-md text-background ${
              isFormValid
                ? "bg-primary hover:bg-secondary"
                : "bg-secondary cursor-not-allowed"
            }`}
          >
            {isLoading ? (
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
          <p className="mt-4 text-center text-sm">
            <span className="text-text-main">Don't have an account? </span>
            <a
              href="/auth/signup"
              className="font-medium text-primary hover:text-secondary transition-colors duration-200"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}