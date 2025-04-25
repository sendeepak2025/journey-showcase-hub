
"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle, ImagePlus, Plus, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { toast } from "sonner"
import axios from "axios"
import { CompassTags, CompassTag } from "./CompassTags"

const actionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().optional(),
  type: z.string(),
})

const touchpointSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  type: z.string().min(2, "Type must be at least 2 characters"),
  duration: z.string().min(2, "Duration must be at least 2 characters"),
  comment: z.string().optional(),
  compassTags: z.array(z.enum(["cognitive", "orchestrated", "memorable", "perceived", "activate", "social", "situational"])).optional(),
  actions: z.array(actionSchema).min(1, "At least one action is required"),
})

const stageSchema = z.object({
  name: z.string(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  touchpoints: z.array(touchpointSchema).min(1, "At least one touchpoint is required"),
})

const performanceIndicatorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  value: z.number().min(0).max(100),
})

const journeyFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  npsScore: z.number().min(0).max(100),
  customerSentiment: z.number().min(0).max(100),
  keyInsight: z.string().min(10, "Key insight must be at least 10 characters"),
  performanceIndicators: z.array(performanceIndicatorSchema).min(1, "At least one performance indicator is required"),
  stages: z.array(stageSchema).min(1, "At least one stage is required"),
})

type JourneyFormValues = z.infer<typeof journeyFormSchema>

export default function CreateJourneyDialog() {
  const [open, setOpen] = React.useState(false)
  const [expandedSections, setExpandedSections] = React.useState<{ [key: string]: boolean }>({})
  const [performanceIndicators, setPerformanceIndicators] = React.useState([{ name: "Conversion", value: 0 }])
  const [stages, setStages] = React.useState([
    {
      name: "awareness" as const,
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
              type: "customer" as const,
            },
          ],
        },
      ],
    },
  ])

  const form = useForm<JourneyFormValues>({
    resolver: zodResolver(journeyFormSchema),
    defaultValues: {
      title: "",
      npsScore: 0,
      customerSentiment: 0,
      keyInsight: "",
      performanceIndicators: performanceIndicators,
      stages: stages,
    },
    mode: "onBlur", // Validate fields when they lose focus
  })

  // Update form when state changes
  React.useEffect(() => {
    form.setValue("performanceIndicators", performanceIndicators)
  }, [performanceIndicators, form])

  React.useEffect(() => {
    form.setValue("stages", stages)
  }, [stages, form])

  const onSubmit = async (data: JourneyFormValues) => {
    try {
      console.log("Submitting journey data:", data)

      // Send the data to the backend
      const response = await axios.post("https://journey.mahitechnocrafts.in/api/reports", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      // If successful, show success toast and reset the form
      if (response.status === 200 || response.status === 201) {
        toast.success("Journey created successfully!")
        console.log("Journey created:", response.data)
        setOpen(false) // Close the dialog after successful submission
        form.reset() // Reset the form
      } else {
        throw new Error(`Server responded with status: ${response.status}`)
      }
    } catch (error) {
      // In case of error, show error toast with more details
      console.error("There was an error creating the journey:", error)

      // Extract error message if available
      let errorMessage = "Error creating journey!"
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `Error (${error.response.status}): ${error.response.data?.message || "Unknown error"}`
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      toast.error(errorMessage)
    }
  }

  const handleCompassTagToggle = (
    stageIndex: number,
    touchpointIndex: number,
    tag: CompassTag
  ) => {
    const newStages = [...stages];
    const currentTouchpoint = newStages[stageIndex].touchpoints[touchpointIndex];
    const tags = currentTouchpoint.compassTags || [];
    
    if (tags.includes(tag)) {
      currentTouchpoint.compassTags = tags.filter(t => t !== tag);
    } else {
      currentTouchpoint.compassTags = [...tags, tag];
    }
    
    setStages(newStages);
  };

  const handleActionTypeChange = (
    stageIndex: number,
    touchpointIndex: number,
    actionIndex: number,
    value: "customer" | "backoffice",
  ) => {
    const newStages = [...stages]
    newStages[stageIndex].touchpoints[touchpointIndex].actions[actionIndex].type = value
    setStages(newStages)
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    stageIndex: number,
    touchpointIndex: number,
    actionIndex: number,
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      // Here you would typically upload the file to your storage service
      // For now, we'll just create a temporary URL
      const imageUrl = URL.createObjectURL(file)

      const newStages = [...stages]
      newStages[stageIndex].touchpoints[touchpointIndex].actions[actionIndex].imageUrl = imageUrl
      setStages(newStages)
    }
  }

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  const addPerformanceIndicator = (e: React.MouseEvent) => {
    // Stop event propagation to prevent any parent handlers from executing
    e.stopPropagation()
    e.preventDefault()

    // Create a deep copy of the current indicators
    setPerformanceIndicators([...performanceIndicators, { name: "", value: 0 }])
  }

  const removePerformanceIndicator = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    e.preventDefault()

    if (performanceIndicators.length > 1) {
      const newIndicators = [...performanceIndicators]
      newIndicators.splice(index, 1)
      setPerformanceIndicators(newIndicators)
    } else {
      toast.error("You need at least one performance indicator")
    }
  }

  const addStage = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    const newStage = {
      name: "awareness" as const,
      description: "",
      touchpoints: [
        {
          title: "",
          type: "Digital",
          duration: "",
          actions: [{ title: "", description: "", imageUrl: "", type: "customer" as const }],
        },
      ],
    }

    setStages([...stages, newStage])

    // Auto-expand the newly added stage
    const newSectionKey = `stage-${stages.length}`
    setExpandedSections((prev) => ({
      ...prev,
      [newSectionKey]: true,
    }))
  }

  const removeStage = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    e.preventDefault()

    if (stages.length > 1) {
      const newStages = [...stages]
      newStages.splice(index, 1)
      setStages(newStages)
    } else {
      toast.error("You need at least one stage")
    }
  }

  const addTouchpoint = (e: React.MouseEvent, stageIndex: number) => {
    e.stopPropagation()
    e.preventDefault()

    const newStages = [...stages]
    newStages[stageIndex].touchpoints.push({
      title: "",
      type: "Digital",
      duration: "",
      actions: [{ title: "", description: "", imageUrl: "", type: "customer" as const }],
    })
    setStages(newStages)

    // Auto-expand the newly added touchpoint
    const newSectionKey = `stage-${stageIndex}-touchpoint-${newStages[stageIndex].touchpoints.length - 1}`
    setExpandedSections((prev) => ({
      ...prev,
      [newSectionKey]: true,
    }))
  }

  const removeTouchpoint = (e: React.MouseEvent, stageIndex: number, touchpointIndex: number) => {
    e.stopPropagation()
    e.preventDefault()

    const newStages = [...stages]
    if (newStages[stageIndex].touchpoints.length > 1) {
      newStages[stageIndex].touchpoints.splice(touchpointIndex, 1)
      setStages(newStages)
    } else {
      toast.error("You need at least one touchpoint per stage")
    }
  }

  const addAction = (e: React.MouseEvent, stageIndex: number, touchpointIndex: number) => {
    e.stopPropagation()
    e.preventDefault()

    const newStages = [...stages]
    newStages[stageIndex].touchpoints[touchpointIndex].actions.push({
      title: "",
      description: "",
      imageUrl: "",
      type: "customer" as const,
    })
    setStages(newStages)

    // Auto-expand the newly added action
    const newSectionKey = `stage-${stageIndex}-touchpoint-${touchpointIndex}-action-${
      newStages[stageIndex].touchpoints[touchpointIndex].actions.length - 1
    }`
    setExpandedSections((prev) => ({
      ...prev,
      [newSectionKey]: true,
    }))
  }

  const removeAction = (e: React.MouseEvent, stageIndex: number, touchpointIndex: number, actionIndex: number) => {
    e.stopPropagation()
    e.preventDefault()

    const newStages = [...stages]
    if (newStages[stageIndex].touchpoints[touchpointIndex].actions.length > 1) {
      newStages[stageIndex].touchpoints[touchpointIndex].actions.splice(actionIndex, 1)
      setStages(newStages)
    } else {
      toast.error("You need at least one action per touchpoint")
    }
  }

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
          <form
            onSubmit={(e) => {
              console.log("Form submission triggered", form.formState.errors)
              form.handleSubmit(onSubmit)(e)
            }}
            className="space-y-6"
          >
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
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
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
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
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
                    onClick={(e) => addPerformanceIndicator(e)}
                    className="border-purple-400 text-purple-700 hover:bg-purple-50"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Indicator
                  </Button>
                </div>

                {performanceIndicators.map((indicator, index) => (
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
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
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
                      onClick={(e) => removePerformanceIndicator(e, index)}
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
                    onClick={(e) => addStage(e)}
                    className="border-purple-400 text-purple-700 hover:bg-purple-50"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Stage
                  </Button>
                </div>

                {stages.map((stage, stageIndex) => (
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
                          onClick={(e) => removeStage(e, stageIndex)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            {expandedSections[`stage-${stageIndex}`] ? "Hide Details" : "Show Details"}
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
                                onChange={(e) => {
                                  field.onChange(e)
                                  const newStages = [...stages]
                                  newStages[stageIndex].name = e.target.value as "awareness" | "consideration" | "quote"
                                  setStages(newStages)
                                }}
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
                                onChange={(e) => {
                                  field.onChange(e)
                                  const newStages = [...stages]
                                  newStages[stageIndex].description = e.target.value
                                  setStages(newStages)
                                }}
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
                            onClick={(e) => addTouchpoint(e, stageIndex)}
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
                                  onClick={(e) => removeTouchpoint(e, stageIndex, touchpointIndex)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                                <CollapsibleTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                                    {expandedSections[`stage-${stageIndex}-touchpoint-${touchpointIndex}`]
                                      ? "Hide"
                                      : "Show"}
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
                                      <Input
                                        placeholder="e.g., Website Visit"
                                        {...field}
                                        className="text-sm"
                                        onChange={(e) => {
                                          field.onChange(e)
                                          const newStages = [...stages]
                                          newStages[stageIndex].touchpoints[touchpointIndex].title = e.target.value
                                          setStages(newStages)
                                        }}
                                      />
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
                                        <Input
                                          placeholder="e.g., Digital"
                                          {...field}
                                          className="text-sm"
                                          onChange={(e) => {
                                            field.onChange(e)
                                            const newStages = [...stages]
                                            newStages[stageIndex].touchpoints[touchpointIndex].type = e.target.value
                                            setStages(newStages)
                                          }}
                                        />
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
                                        <Input
                                          placeholder="e.g., 5-7 mins"
                                          {...field}
                                          className="text-sm"
                                          onChange={(e) => {
                                            field.onChange(e)
                                            const newStages = [...stages]
                                            newStages[stageIndex].touchpoints[touchpointIndex].duration = e.target.value
                                            setStages(newStages)
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              {/* Inside the touchpoint form section, after the duration field */}
                              <FormField
                                control={form.control}
                                name={`stages.${stageIndex}.touchpoints.${touchpointIndex}.comment`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm">Comment (Optional)</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Add any additional notes..."
                                        className="min-h-[60px] text-sm"
                                        {...field}
                                        onChange={(e) => {
                                          field.onChange(e);
                                          const newStages = [...stages];
                                          newStages[stageIndex].touchpoints[touchpointIndex].comment = e.target.value;
                                          setStages(newStages);
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="space-y-2">
                                <FormLabel className="text-sm">Compass Tags</FormLabel>
                                <CompassTags
                                  selectedTags={touchpoint.compassTags || []}
                                  onTagSelect={(tag) => handleCompassTagToggle(stageIndex, touchpointIndex, tag)}
                                  onTagRemove={(tag) => handleCompassTagToggle(stageIndex, touchpointIndex, tag)}
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
                                    onClick={(e) => addAction(e, stageIndex, touchpointIndex)}
                                    className="border-purple-200 text-purple-600 hover:bg-purple-50 h-6 px-2 text-xs"
                                  >
                                    <Plus className="h-3 w-3 mr-1" /> Add Action
                                  </Button>
                                </div>

                                {touchpoint.actions.map((action, actionIndex) => (
                                  <Collapsible
                                    key={actionIndex}
                                    className="border rounded-md"
                                    open={
                                      expandedSections[
                                        `stage-${stageIndex}-touchpoint-${touchpointIndex}-action-${actionIndex}`
                                      ]
                                    }
                                    onOpenChange={() =>
                                      toggleSection(
                                        `stage-${stageIndex}-touchpoint-${touchpointIndex}-action-${actionIndex}`,
                                      )
                                    }
                                  >
                                    <div className="flex items-center justify-between p-2 border-b bg-gray-50">
                                      <span className="text-xs font-medium">Action {actionIndex + 1}</span>
                                      <div className="flex items-center gap-2">
                                        <select
                                          value={action.type}
                                          onChange={(e) =>
                                            handleActionTypeChange(
                                              stageIndex,
                                              touchpointIndex,
                                              actionIndex,
                                              e.target.value as "customer" | "backoffice",
                                            )
                                          }
                                          className="text-xs border rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                                        >
                                          <option value="customer">Customer</option>
                                          <option value="backoffice">Backoffice</option>
                                        </select>

                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => removeAction(e, stageIndex, touchpointIndex, actionIndex)}
                                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                        <CollapsibleTrigger asChild>
                                          <Button variant="ghost" size="sm" className="h-6 text-xs">
                                            {expandedSections[
                                              `stage-${stageIndex}-touchpoint-${touchpointIndex}-action-${actionIndex}`
                                            ]
                                              ? "Hide"
                                              : "Show"}
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
                                              <Input
                                                placeholder="e.g., View Homepage"
                                                {...field}
                                                className="text-xs h-8"
                                                onChange={(e) => {
                                                  field.onChange(e)
                                                  const newStages = [...stages]
                                                  newStages[stageIndex].touchpoints[touchpointIndex].actions[
                                                    actionIndex
                                                  ].title = e.target.value
                                                  setStages(newStages)
                                                }}
                                              />
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
                                                onChange={(e) => {
                                                  field.onChange(e)
                                                  const newStages = [...stages]
                                                  newStages[stageIndex].touchpoints[touchpointIndex].actions[
                                                    actionIndex
                                                  ].description = e.target.value
                                                  setStages(newStages)
                                                }}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <div className="space-y-2">
                                        <FormLabel className="text-xs">Action Image</FormLabel>
                                        <div className="flex items-center gap-2 border p-2 rounded-md bg-gray-50">
                                          <label
                                            htmlFor={`image-${stageIndex}-${touchpointIndex}-${actionIndex}`}
                                            className="cursor-pointer flex items-center justify-center rounded-md border border-dashed px-3 py-2 text-xs text-gray-500 hover:bg-gray-100"
                                          >
                                            <ImagePlus className="h-4 w-4 mr-1" />
                                            Upload Image
                                          </label>
                                          <Input
                                            id={`image-${stageIndex}-${touchpointIndex}-${actionIndex}`}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                              handleImageUpload(e, stageIndex, touchpointIndex, actionIndex)
                                            }
                                          />
                                          {action.imageUrl && (
                                            <div className="relative w-12 h-12 ml-2 rounded overflow-hidden border">
                                              <img
                                                src={action.imageUrl || "/placeholder.svg"}
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
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Create Journey
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
