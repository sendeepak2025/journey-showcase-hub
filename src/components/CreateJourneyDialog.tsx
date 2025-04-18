
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, ImagePlus } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

const touchpointSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  type: z.string().min(2, "Type must be at least 2 characters"),
  duration: z.string().min(2, "Duration must be at least 2 characters"),
  actions: z.array(z.object({
    title: z.string().min(2, "Action title must be at least 2 characters"),
    description: z.string().min(10, "Action description must be at least 10 characters"),
    imageUrl: z.string().optional(),
  })).min(1, "At least one action is required"),
});

const stageSchema = z.object({
  name: z.enum(["awareness", "consideration", "quote"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  touchpoints: z.array(touchpointSchema).min(1, "At least one touchpoint is required"),
});

const journeyFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  npsScore: z.number().min(0).max(100),
  customerSentiment: z.number().min(0).max(100),
  keyInsight: z.string().min(10, "Key insight must be at least 10 characters"),
  performanceIndicators: z.array(z.object({
    name: z.string().min(2),
    value: z.number().min(0).max(100),
  })).min(2),
  stages: z.array(stageSchema).min(1, "At least one stage is required"),
});

type JourneyFormValues = z.infer<typeof journeyFormSchema>;

export default function CreateJourneyDialog() {
  const [currentStageIndex, setCurrentStageIndex] = React.useState(0);
  const [currentTouchpointIndex, setCurrentTouchpointIndex] = React.useState(0);
  const [currentActionIndex, setCurrentActionIndex] = React.useState(0);

  const form = useForm<JourneyFormValues>({
    resolver: zodResolver(journeyFormSchema),
    defaultValues: {
      title: "",
      npsScore: 0,
      customerSentiment: 0,
      keyInsight: "",
      performanceIndicators: [
        { name: "Conversion", value: 0 },
        { name: "Sales", value: 0 }
      ],
      stages: [
        {
          name: "awareness",
          description: "",
          touchpoints: [
            {
              title: "",
              type: "Digital",
              duration: "",
              actions: [
                {
                  title: "",
                  description: "",
                  imageUrl: "",
                }
              ]
            }
          ]
        }
      ]
    },
  });

  const onSubmit = (data: JourneyFormValues) => {
    console.log("Journey Data:", data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, stageIndex: number, touchpointIndex: number, actionIndex: number) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would typically upload the file to your storage service
      // For now, we'll just create a temporary URL
      const imageUrl = URL.createObjectURL(file);
      
      const currentStages = form.getValues("stages");
      currentStages[stageIndex].touchpoints[touchpointIndex].actions[actionIndex].imageUrl = imageUrl;
      form.setValue("stages", currentStages);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
          <PlusCircle className="h-5 w-5" />
          Create Journey
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Journey</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
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
              
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              
              <FormField
                control={form.control}
                name="keyInsight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Insight</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter key insight about this journey"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.getValues("stages").map((stage, stageIndex) => (
                <div key={stageIndex} className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Stage {stageIndex + 1}</h3>
                  
                  <FormField
                    control={form.control}
                    name={`stages.${stageIndex}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stage Name</FormLabel>
                        <FormControl>
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            {...field}
                          >
                            <option value="awareness">Awareness</option>
                            <option value="consideration">Consideration</option>
                            <option value="quote">Quote</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`stages.${stageIndex}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stage Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe this stage"
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {stage.touchpoints.map((touchpoint, touchpointIndex) => (
                    <div key={touchpointIndex} className="border rounded-lg p-4 space-y-4">
                      <h4 className="font-medium">Touchpoint {touchpointIndex + 1}</h4>
                      
                      <FormField
                        control={form.control}
                        name={`stages.${stageIndex}.touchpoints.${touchpointIndex}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Touchpoint Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Website Visit" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`stages.${stageIndex}.touchpoints.${touchpointIndex}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Digital" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`stages.${stageIndex}.touchpoints.${touchpointIndex}.duration`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duration</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 5-7 mins" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {touchpoint.actions.map((action, actionIndex) => (
                        <div key={actionIndex} className="border rounded-lg p-4 space-y-4">
                          <h5 className="font-medium">Action {actionIndex + 1}</h5>
                          
                          <FormField
                            control={form.control}
                            name={`stages.${stageIndex}.touchpoints.${touchpointIndex}.actions.${actionIndex}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Action Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., View Homepage" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`stages.${stageIndex}.touchpoints.${touchpointIndex}.actions.${actionIndex}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Action Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe this action"
                                    className="min-h-[60px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="space-y-2">
                            <FormLabel>Action Image</FormLabel>
                            <div className="flex items-center gap-4">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, stageIndex, touchpointIndex, actionIndex)}
                              />
                              {action.imageUrl && (
                                <div className="relative w-16 h-16">
                                  <img
                                    src={action.imageUrl}
                                    alt={action.title}
                                    className="w-full h-full object-cover rounded"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const currentStages = form.getValues("stages");
                          currentStages[stageIndex].touchpoints[touchpointIndex].actions.push({
                            title: "",
                            description: "",
                            imageUrl: "",
                          });
                          form.setValue("stages", currentStages);
                        }}
                      >
                        Add Action
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentStages = form.getValues("stages");
                      currentStages[stageIndex].touchpoints.push({
                        title: "",
                        type: "Digital",
                        duration: "",
                        actions: [{ title: "", description: "", imageUrl: "" }]
                      });
                      form.setValue("stages", currentStages);
                    }}
                  >
                    Add Touchpoint
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const currentStages = form.getValues("stages");
                  currentStages.push({
                    name: "awareness",
                    description: "",
                    touchpoints: [{
                      title: "",
                      type: "Digital",
                      duration: "",
                      actions: [{ title: "", description: "", imageUrl: "" }]
                    }]
                  });
                  form.setValue("stages", currentStages);
                }}
              >
                Add Stage
              </Button>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">Create Journey</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
