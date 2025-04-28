
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { setToken, setUser } from '@/redux/authSlice';

import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
  
    try {
      // Show a loading message (optional)
      toast('Logging in...', { icon: '⏳', description: 'Please wait...' });

      // Make the login API request
     
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: values.email,
        password: values.password,
      });

      // Check if login was successful
      if (response.data.success) {
        const { token, user } = response.data;

        // Dispatch token and user data to Redux store
        dispatch(setToken(token));
        dispatch(setUser(user));

        // Optionally, store the token and user data in localStorage or cookies if needed
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Show success message
        toast.success('Login successful!');

        // Redirect the user
        navigate('/');  // Adjust the route to where you want the user to be redirected
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please try again.');
    } 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" autoComplete="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" autoComplete="current-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  Sign in
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-purple-600 hover:text-purple-500">
                    Register
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
