'use client'

import { useState } from 'react';
import Link from 'next/link';
import PageLayout from '../../components/ui/PageLayout';
import FormCard from '../../components/ui/FormCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import SocialButton from '../../components/ui/SocialButton';
import axios from 'axios';
import { emitWarning } from 'process';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router=useRouter()
  const [loading,setLoading]=useState(false)
  const backend_url=process.env.NEXT_PUBLIC_BACKEND_URL;
  const initialformData={
    email:'',
    password:''
  }
  const [formData, setFormData] = useState(initialformData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    const data={
        email:formData.email,
        password:formData.password
      }
    try {
      const response=await axios.post(`${backend_url}/auth/signin`,data,{withCredentials:true}
    )
      console.log(response.data.msg)
      if(response.status==201){
        alert(response.data.msg)
        router.push("/home")
        router.refresh();
      }
      setFormData(initialformData)
    } catch (error:any) {
      console.log(error.response.data)
    }finally{
      setLoading(false)
    }
  };

  const handleSocialSignIn = (provider: string) => {
    console.log(`Sign in with ${provider}`);
  };

  return (
    <PageLayout 
      title="Welcome Back" 
      subtitle="It's good to see you again"
    >
      <FormCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            required
          />

          <div>
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              showPasswordToggle={true}
              required
            />
            <div className="mt-2 text-right">
              <Link 
                href="/forgot-password" 
                className="text-sm text-orange-500 hover:text-orange-600 transition-colors duration-200 cursor-pointer"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SocialButton provider="Google" onClick={handleSocialSignIn} />
              <SocialButton provider="Apple" onClick={handleSocialSignIn} />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading?"Loading...":"Sign In"}
          </Button>
        </form>
      </FormCard>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link 
            href="/auth/signup" 
            className="font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </PageLayout>
  );
}