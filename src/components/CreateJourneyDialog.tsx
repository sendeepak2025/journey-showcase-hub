
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from 'lucide-react';

const journeyFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  npsScore: z.number().min(0).max(100),
  customerSentiment: z.number().min(0).max(100),
  keyInsight: z.string().min(10, "Key insight must be at least 10 characters"),
  conversionRate: z.number().min(0).max(100),
  salesRate: z.number().min(0).max(100),
});

type JourneyFormValues = z.infer<typeof journeyFormSchema>;

export default function CreateJourneyDialog() {
  const form = useForm<JourneyFormValues>({
    resolver: zodResolver(journeyFormSchema),
    defaultValues: {
      title: "",
      npsScore: 0,
      customerSentiment: 0,
      keyInsight: "",
      conversionRate: 0,
      salesRate: 0,
    },
  });

  const onSubmit = (data: JourneyFormValues) => {
    console.log("Journey Data:", data);
    // Here you would typically save the data
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
          <PlusCircle className="h-5 w-5" />
          Create Journey
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Journey</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Journey Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Customer Onboarding" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="npsScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NPS Score (0-100)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customerSentiment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Sentiment (0-100)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="keyInsight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Insight</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter key insight about this journey" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="conversionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conversion Rate (0-100)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="salesRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sales Rate (0-100)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">Create Journey</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
