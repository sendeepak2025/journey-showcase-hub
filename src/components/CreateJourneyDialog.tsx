
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, ImagePlus, Plus, Trash2, Info } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";

const actionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().optional(),
});

const touchpointSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  type: z.string().min(2, "Type must be at least 2 characters"),
  duration: z.string().min(2, "Duration must be at least 2 characters"),
  actions: z.array(actionSchema).min(1, "At least one action is required"),
});

const stageSchema = z.object({
  name: z.enum(["awareness", "consideration", "quote"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  touchpoints: z.array(touchpointSchema).min(1, "At least one touchpoint is required"),
});

const performanceIndicatorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  value: z.number().min(0).max(100),
});

const journeyFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  npsScore: z.number().min(0).max(100),
  customerSentiment: z.number().min(0).max(100),
  keyInsight: z.string().min(10, "Key insight must be at least 10 characters"),
  performanceIndicators: z.array(performanceIndicatorSchema).min(1, "At least one performance indicator is required"),
  stages: z.array(stageSchema).min(1, "At least one stage is required"),
});

type JourneyFormValues = z.infer<typeof journeyFormSchema>;

export default function CreateJourneyDialog() {
  const [open, setOpen] = React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState<{[key: string]: boolean}>({});

  const form = useForm<JourneyFormValues>({
    resolver: zodResolver(journeyFormSchema),
    defaultValues: {
      title: "",
      npsScore: 0,
      customerSentiment: 0,
      keyInsight: "",
      performanceIndicators: [
        { name: "Conversion", value: 0 },
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
    toast.success("Journey created successfully!");
    setOpen(false);
    form.reset();
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

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const addPerformanceIndicator = () => {
    const currentIndicators = form.getValues("performanceIndicators");
    currentIndicators.push({ name: "", value: 0 });
    form.setValue("performanceIndicators", currentIndicators);
  };

  const removePerformanceIndicator = (index: number) => {
    const currentIndicators = form.getValues("performanceIndicators");
    if (currentIndicators.length > 1) {
      currentIndicators.splice(index, 1);
      form.setValue("performanceIndicators", currentIndicators);
    } else {
      toast.error("You need at least one performance indicator");
    }
  };

  const addStage = () => {
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
    
    // Auto-expand the newly added stage
    const newSectionKey = `stage-${currentStages.length - 1}`;
    setExpandedSections(prev => ({
      ...prev,
      [newSectionKey]: true
    }));
  };

  const removeStage = (index: number) => {
    const currentStages = form.getValues("stages");
    if (currentStages.length > 1) {
      currentStages.splice(index, 1);
      form.setValue("stages", currentStages);
    } else {
      toast.error("You need at least one stage");
    }
  };

  const addTouchpoint = (stageIndex: number) => {
    const currentStages = form.getValues("stages");
    currentStages[stageIndex].touchpoints.push({
      title: "",
      type: "Digital",
      duration: "",
      actions: [{ title: "", description: "", imageUrl: "" }]
    });
    form.setValue("stages", currentStages);
    
    // Auto-expand the newly added touchpoint
    const newSectionKey = `stage-${stageIndex}-touchpoint-${currentStages[stageIndex].touchpoints.length - 1}`;
    setExpandedSections(prev => ({
      ...prev,
      [newSectionKey]: true
    }));
  };

  const removeTouchpoint = (stageIndex: number, touchpointIndex: number) => {
    const currentStages = form.getValues("stages");
    if (currentStages[stageIndex].touchpoints.length > 1) {
      currentStages[stageIndex].touchpoints.splice(touchpointIndex, 1);
      form.setValue("stages", currentStages);
    } else {
      toast.error("You need at least one touchpoint per stage");
    }
  };

  const addAction = (stageIndex: number, touchpointIndex: number) => {
    const currentStages = form.getValues("stages");
    currentStages[stageIndex].touchpoints[touchpointIndex].actions.push({
      title: "",
      description: "",
      imageUrl: "",
    });
    form.setValue("stages", currentStages);
    
    // Auto-expand the newly added action
    const newSectionKey = `stage-${stageIndex}-touchpoint-${touchpointIndex}-action-${currentStages[stageIndex].touchpoints[touchpointIndex].actions.length - 1}`;
    setExpandedSections(prev => ({
      ...prev,
      [newSectionKey]: true
    }));
  };

  const removeAction = (stageIndex: number, touchpointIndex: number, actionIndex: number) => {
    const currentStages = form.getValues("stages");
    if (currentStages[stageIndex].touchpoints[touchpointIndex].actions.length > 1) {
      currentStages[stageIndex].touchpoints[touchpointIndex].actions.splice(actionIndex, 1);
      form.setValue("stages", currentStages);
    } else {
      toast.error("You need at least one action per touchpoint");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
          <PlusCircle className="h-5 w-5" />
          Create Journey
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-purple-700">Create New Journey</DialogTitle>
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
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
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
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
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

              {/* Performance Indicators Section */}
              <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-purple-700">Key Performance Indicators</h3>
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPerformanceIndicator}
                    className="border-purple-400 text-purple-700 hover:bg-purple-50"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Indicator
                  </Button>
                </div>
                
                {form.getValues("performanceIndicators").map((indicator, index) => (
                  <div key={index} className="flex items-end gap-4 p-3 bg-white rounded-md border border-gray-200">
                    <FormField
                      control={form.control}
                      name={`performanceIndicators.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>KPI Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Conversion Rate" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`performanceIndicators.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Value (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="100"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePerformanceIndicator(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 mb-0.5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Stages Section */}
              <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-purple-700">Journey Stages</h3>
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addStage}
                    className="border-purple-400 text-purple-700 hover:bg-purple-50"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Stage
                  </Button>
                </div>
                
                {form.getValues("stages").map((stage, stageIndex) => (
                  <Collapsible 
                    key={stageIndex} 
                    className="border rounded-lg bg-white shadow-sm"
                    open={expandedSections[`stage-${stageIndex}`]}
                    onOpenChange={() => toggleSection(`stage-${stageIndex}`)}
                  >
                    <div className="flex items-center justify-between p-4 border-b">
                      <h4 className="font-medium text-purple-800">Stage {stageIndex + 1}</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStage(stageIndex)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            {expandedSections[`stage-${stageIndex}`] ? 'Hide Details' : 'Show Details'}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                    
                    <CollapsibleContent className="p-4 space-y-4">
                      <FormField
                        control={form.control}
                        name={`stages.${stageIndex}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stage Name</FormLabel>
                            <FormControl>
                              <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

                      {/* Touchpoints Section */}
                      <div className="space-y-3 mt-4">
                        <div className="flex justify-between items-center">
                          <h5 className="text-sm font-medium text-gray-700">Touchpoints</h5>
                          <Button 
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addTouchpoint(stageIndex)}
                            className="border-purple-300 text-purple-600 hover:bg-purple-50 h-7 px-2 text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add Touchpoint
                          </Button>
                        </div>

                        {stage.touchpoints.map((touchpoint, touchpointIndex) => (
                          <Collapsible 
                            key={touchpointIndex} 
                            className="border rounded-md bg-gray-50"
                            open={expandedSections[`stage-${stageIndex}-touchpoint-${touchpointIndex}`]}
                            onOpenChange={() => toggleSection(`stage-${stageIndex}-touchpoint-${touchpointIndex}`)}
                          >
                            <div className="flex items-center justify-between p-3 border-b">
                              <h6 className="font-medium text-sm">Touchpoint {touchpointIndex + 1}</h6>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTouchpoint(stageIndex, touchpointIndex)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                                <CollapsibleTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                                    {expandedSections[`stage-${stageIndex}-touchpoint-${touchpointIndex}`] ? 'Hide' : 'Show'}
                                  </Button>
                                </CollapsibleTrigger>
                              </div>
                            </div>
                            
                            <CollapsibleContent className="p-3 space-y-3 bg-white rounded-b-md">
                              <FormField
                                control={form.control}
                                name={`stages.${stageIndex}.touchpoints.${touchpointIndex}.title`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm">Touchpoint Title</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g., Website Visit" {...field} className="text-sm" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="grid grid-cols-2 gap-3">
                                <FormField
                                  control={form.control}
                                  name={`stages.${stageIndex}.touchpoints.${touchpointIndex}.type`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm">Type</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g., Digital" {...field} className="text-sm" />
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
                                      <FormLabel className="text-sm">Duration</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g., 5-7 mins" {...field} className="text-sm" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              {/* Actions Section */}
                              <div className="space-y-2 mt-3">
                                <div className="flex justify-between items-center">
                                  <h6 className="text-xs font-medium text-gray-700">Actions</h6>
                                  <Button 
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addAction(stageIndex, touchpointIndex)}
                                    className="border-purple-200 text-purple-600 hover:bg-purple-50 h-6 px-2 text-xs"
                                  >
                                    <Plus className="h-3 w-3 mr-1" /> Add Action
                                  </Button>
                                </div>

                                {touchpoint.actions.map((action, actionIndex) => (
                                  <Collapsible 
                                    key={actionIndex} 
                                    className="border rounded-md"
                                    open={expandedSections[`stage-${stageIndex}-touchpoint-${touchpointIndex}-action-${actionIndex}`]}
                                    onOpenChange={() => toggleSection(`stage-${stageIndex}-touchpoint-${touchpointIndex}-action-${actionIndex}`)}
                                  >
                                    <div className="flex items-center justify-between p-2 border-b bg-gray-50">
                                      <span className="text-xs font-medium">Action {actionIndex + 1}</span>
                                      <div className="flex items-center gap-1">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeAction(stageIndex, touchpointIndex, actionIndex)}
                                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                        <CollapsibleTrigger asChild>
                                          <Button variant="ghost" size="sm" className="h-6 text-xs">
                                            {expandedSections[`stage-${stageIndex}-touchpoint-${touchpointIndex}-action-${actionIndex}`] ? 'Hide' : 'Show'}
                                          </Button>
                                        </CollapsibleTrigger>
                                      </div>
                                    </div>
                                    
                                    <CollapsibleContent className="p-3 space-y-3">
                                      <FormField
                                        control={form.control}
                                        name={`stages.${stageIndex}.touchpoints.${touchpointIndex}.actions.${actionIndex}.title`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className="text-xs">Action Title</FormLabel>
                                            <FormControl>
                                              <Input placeholder="e.g., View Homepage" {...field} className="text-xs h-8" />
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
                                            <FormLabel className="text-xs">Action Description</FormLabel>
                                            <FormControl>
                                              <Textarea 
                                                placeholder="Describe this action"
                                                className="min-h-[60px] text-xs"
                                                {...field} 
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <div className="space-y-2">
                                        <FormLabel className="text-xs">Action Image</FormLabel>
                                        <div className="flex items-center gap-2 border p-2 rounded-md bg-gray-50">
                                          <label htmlFor={`image-${stageIndex}-${touchpointIndex}-${actionIndex}`} className="cursor-pointer flex items-center justify-center rounded-md border border-dashed px-3 py-2 text-xs text-gray-500 hover:bg-gray-100">
                                            <ImagePlus className="h-4 w-4 mr-1" />
                                            Upload Image
                                          </label>
                                          <Input
                                            id={`image-${stageIndex}-${touchpointIndex}-${actionIndex}`}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleImageUpload(e, stageIndex, touchpointIndex, actionIndex)}
                                          />
                                          {action.imageUrl && (
                                            <div className="relative w-12 h-12 ml-2 rounded overflow-hidden border">
                                              <img
                                                src={action.imageUrl}
                                                alt={action.title || "Action image"}
                                                className="w-full h-full object-cover"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </CollapsibleContent>
                                  </Collapsible>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700"
              >
                Create Journey
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
