"use client";
import axios from 'axios'
import { useState } from "react";
import Link from "next/link";
import PageLayout from "../../components/ui/PageLayout";
import FormCard from "../../components/ui/FormCard";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router=useRouter();
  const[loading,setLoading]=useState(false)
  const initialfromData={
     name: "",
    email: "",
    password: "",
  }
  const [formData, setFormData] = useState(initialfromData);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const backend_url=process.env.NEXT_PUBLIC_BACKEND_URL;
  
  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form submitted:", formData);
    try {
      const response = await axios.post(`${backend_url}/auth/signup`,{
        name:formData.name,
        email:formData.email,
        password:formData.password
    },{
      withCredentials:true
    })
    if(response.status==201){
      alert(response.data.msg)
      router.push('/home')    
      setFormData(initialfromData)

    }
    
    } catch (error:any) {
      console.log(error.response.data)

    }finally{
      setLoading(false)
      
    }
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (
    <PageLayout
      title="Start Your Publishing Journey"
      subtitle="It only takes a minute to get started"
    >
      <FormCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
          />
          <div>
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
            />
            {formData.email && !emailRegex.test(formData.email) && (
              <p className="ml-2 text-red-500 mt-1.5 text-xs ">
                Please enter a valid email address
              </p>
            )}
          </div>

          <div>
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              placeholder="Create a strong password"
              showPasswordToggle={true}
              required
            />
            {formData.password && formData.password.length < 6 && (
              <p className="ml-2 text-red-500 text-xs mt-1 ">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading?"Loafing...":"Verify and Sign up"}
           
          </Button>

          <p className="text-xs text-gray-500 text-center leading-relaxed">
            By signing up, you agree to our{" "}
            <Link
              href="/terms"
              className="text-orange-500 hover:text-orange-600 underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-orange-500 hover:text-orange-600 underline"
            >
              Privacy Policy
            </Link>
          </p>
        </form>
      </FormCard>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200"
          >
            Sign In
          </Link>
        </p>
      </div>
    </PageLayout>
  );
}
