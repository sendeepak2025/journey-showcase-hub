"use client"

import React, { useEffect } from "react"
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
import { CompassTags, type CompassTag } from "./CompassTags"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { BASE_URL } from "@/App"

// Updated action schema to use enum type
const actionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().optional(),
  type: z.enum(["customer", "backoffice"]),
})

const touchpointSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  type: z.string().min(2, "Type must be at least 2 characters"),
  duration: z.string().min(1, "Duration must be at least 1 number"),
  comment: z.string().optional(),
  compassTags: z
    .array(z.enum(["cognitive", "orchestrated", "memorable", "perceived", "activate", "social", "situational"]))
    .optional(),
  actions: z.array(actionSchema).min(1, "At least one action is required"),
})

const stageSchema = z.object({
  name: z.string().min(2, "Stage name must be at least 2 characters"),
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
type ActionType = "customer" | "backoffice"
type StageNameType = string

type CreateJourneyDialogProps = {
  id?: string,
  onSave: () => void;
}

export default function CreateJourneyDialog({ id,onSave }: CreateJourneyDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [expandedSections, setExpandedSections] = React.useState<{ [key: string]: boolean }>({})
  const [performanceIndicators, setPerformanceIndicators] = React.useState([{ name: "Conversion", value: 0 }])
  const user = useSelector((state: RootState) => state.auth?.user ?? null)
  const [validationErrors, setValidationErrors] = React.useState<string[]>([])
  const [showValidationPopup, setShowValidationPopup] = React.useState(false)

 
  const [stages, setStages] = React.useState([
    {
      name: "Awareness",
      description: "",
      touchpoints: [
        {
          title: "",
          type: "Digital",
          duration: "",
          comment: "",
          compassTags: [] as CompassTag[],
          actions: [
            {
              title: "",
              description: "",
              imageUrl: "",
              type: "customer" as ActionType,
            },
          ],
        },
      ],
    },
  ])

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // const response = await axios.get(`https://journey.mahitechnocrafts.in/api/reports/${id}`);
        const response = await axios.get(`${BASE_URL}/reports/${id}`)
        const data = response.data

        console.log("Report Data:", data)

        if (data) {
          form.reset({
            title: data.title || "",
            npsScore: data.npsScore || 0,
            customerSentiment: data.customerSentiment || 0,
            keyInsight: data.keyInsight || "",
            performanceIndicators: data.performanceIndicators || [{ name: "", value: 0 }],
            stages: data.stages || [],
          })
          setStages(data.stages || [])
        }
      } catch (error) {
        console.error("Error fetching report:", error)
      }
    }

    if (id && open) {
      fetchReport()
    }
  }, [id, open])

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

  // Add a useEffect to ensure form validation errors are displayed when the form is submitted
  React.useEffect(() => {
    // When there are errors and the validation popup is shown, make sure inline errors are visible
    if (showValidationPopup && Object.keys(form.formState.errors).length > 0) {
      // This will ensure all form fields with errors show their error messages
      form.trigger()
    }
  }, [showValidationPopup, form])

  // Modify the onSubmit function to ensure form validation errors are properly collected and displayed
  const onSubmit = async (data: JourneyFormValues) => {
    try {
      // Check for validation errors
      const isValid = await form.trigger()
      if (!isValid) {
        // Collect all error messages
        const errorMessages: string[] = []

        // Helper function to recursively collect error messages with better formatting
        const collectErrors = (obj: any, path = "") => {
          for (const key in obj) {
            if (obj[key]?.message) {
              // Format the error message to be more user-friendly
              const fieldName = key.charAt(0).toUpperCase() + key.slice(1)
              errorMessages.push(`${path}${fieldName}: ${obj[key].message}`)
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
              // For nested objects like stages, touchpoints, etc.
              if (Array.isArray(obj[key])) {
                // Handle arrays (like stages, touchpoints, actions)
                obj[key].forEach((item: any, index: number) => {
                  const itemType =
                    key === "stages"
                      ? "Stage"
                      : key === "touchpoints"
                        ? "Touchpoint"
                        : key === "actions"
                          ? "Action"
                          : key === "performanceIndicators"
                            ? "KPI"
                            : ""
                  collectErrors(item, `${itemType} ${index + 1} > `)
                })
              } else {
                collectErrors(obj[key], `${path}${key} > `)
              }
            }
          }
        }

        collectErrors(form.formState.errors)

        // Show validation popup
        setValidationErrors(errorMessages)
        setShowValidationPopup(true)
        return
      }

      console.log("Submitting journey data:", data)

      const config = {
        headers: { "Content-Type": "application/json" },
      }

      let response

      if (id) {
        // Update existing journey
        response = await axios.put(`${BASE_URL}/reports/${id}`, data, config)
        onSave()
      } else {
        // Create new journey
        response = await axios.post(`${BASE_URL}/reports`, data, config)
        onSave()
      }

      if (response.status === 200 || response.status === 201) {
        const message = id ? "Journey updated successfully!" : "Journey created successfully!"
        toast.success(message)
        console.log("Journey saved:", response.data)
        setOpen(false) // Close modal
        form.reset() // Reset form state
      } else {
        throw new Error(`Unexpected response status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error saving journey:", error)

      let errorMessage = "Something went wrong!"
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `Error (${error.response.status}): ${error.response.data?.message || "Unknown error"}`
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      toast.error(errorMessage)
    }
  }



  const handleActionTypeChange = (
    stageIndex: number,
    touchpointIndex: number,
    actionIndex: number,
    value: ActionType,
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
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        const response = await axios.post(`${BASE_URL}/image/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        console.log(response.data);
  
        // Optionally update state
        const imageUrl = response.data?.thumbnailImage?.secure_url || '';
        const newStages = [...stages];
        newStages[stageIndex].touchpoints[touchpointIndex].actions[actionIndex].imageUrl = imageUrl;
        setStages(newStages);
      } catch (error) {
        console.error("Upload failed", error);
      }
    }
  };
  


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
      name: "Awareness",
      description: "",
      touchpoints: [
        {
          title: "",
          type: "Digital",
          duration: "",
          comment: "",
          compassTags: [] as CompassTag[],
          actions: [{ title: "", description: "", imageUrl: "", type: "customer" as ActionType }],
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
      comment: "",
      compassTags: [] as CompassTag[],
      actions: [{ title: "", description: "", imageUrl: "", type: "customer" as ActionType }],
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
      type: "customer" as ActionType,
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
    <Dialog open={open}   onOpenChange={(value) => {
      // Prevent dialog from closing if the validation popup is active
      if (!showValidationPopup) {
        setOpen(value)
      }
    }}>
      <DialogTrigger asChild>
        {user && user?.role === "admin" && (
          <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
            <PlusCircle className="h-5 w-5" />
            {id ? "Edit Journey" : "Create Journey"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-purple-700">
              {id ? "Edit Journey" : "Create New Journey"}
            </DialogTitle>
          </div>
        </DialogHeader>
        <Form {...form}>
          {/* Update the form submission handler to ensure validation is triggered */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              // Trigger validation for all fields before submitting
              form.trigger().then((isValid) => {
                if (!isValid) {
                  // Collect all error messages
                  const errorMessages: string[] = []

                  // Helper function to recursively collect error messages
                  const collectErrors = (obj: any, path = "") => {
                    for (const key in obj) {
                      if (obj[key]?.message) {
                        // Format the error message to be more user-friendly
                        const fieldName = key.charAt(0).toUpperCase() + key.slice(1)
                        errorMessages.push(`${path}${fieldName}: ${obj[key].message}`)
                      } else if (typeof obj[key] === "object" && obj[key] !== null) {
                        // For nested objects like stages, touchpoints, etc.
                        if (Array.isArray(obj[key])) {
                          // Handle arrays (like stages, touchpoints, actions)
                          obj[key].forEach((item: any, index: number) => {
                            const itemType =
                              key === "stages"
                                ? "Stage"
                                : key === "touchpoints"
                                  ? "Touchpoint"
                                  : key === "actions"
                                    ? "Action"
                                    : key === "performanceIndicators"
                                      ? "KPI"
                                      : ""
                            collectErrors(item, `${itemType} ${index + 1} > `)
                          })
                        } else {
                          collectErrors(obj[key], `${path}${key} > `)
                        }
                      }
                    }
                  }

                  collectErrors(form.formState.errors)

                  // Show validation popup
                  setValidationErrors(errorMessages)
                  setShowValidationPopup(true)
                } else {
                  form.handleSubmit(onSubmit)(e)
                }
              })
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
                      <Input
                        placeholder="e.g., Customer Onboarding"
                        {...field}
                        className={form.formState.errors.title ? "border-red-500 focus:ring-red-500" : ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 font-medium" />
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

                {/* Add this new hierarchy diagram */}
                <div className="bg-gray-100 p-3 rounded-lg mb-4 border border-gray-300">
                  <h4 className="text-sm font-medium mb-2">Journey Structure:</h4>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <div className="bg-purple-100 border border-purple-300 rounded px-2 py-1 font-medium">Stage</div>
                    <div className="text-gray-500">→</div>
                    <div className="bg-blue-100 border border-blue-300 rounded px-2 py-1 font-medium">Touchpoint</div>
                    <div className="text-gray-500">→</div>
                    <div className="bg-green-100 border border-green-300 rounded px-2 py-1 font-medium">Action</div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    Each Stage contains multiple Touchpoints, and each Touchpoint contains multiple Actions
                  </p>
                </div>

                {stages.map((stage, stageIndex) => (
                  <Collapsible
                    key={stageIndex}
                    className="border rounded-lg bg-white shadow-sm"
                    open={expandedSections[`stage-${stageIndex}`]}
                    onOpenChange={() => toggleSection(`stage-${stageIndex}`)}
                  >
                    <div className="flex items-center justify-between p-4 border-b bg-purple-50">
                      <h4 className="font-medium text-purple-800 flex items-center">
                        <span className="bg-purple-700 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                          {stageIndex + 1}
                        </span>
                        Stage: {stage.name || `Stage ${stageIndex + 1}`}
                      </h4>
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
                              <Input
                                placeholder="e.g., Awareness, Consideration, etc."
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e)
                                  const newStages = [...stages]
                                  newStages[stageIndex].name = e.target.value
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
                            <div className="flex items-center justify-between p-3 border-b bg-blue-50">
                              <h6 className="font-medium text-sm flex items-center">
                                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">
                                  {touchpointIndex + 1}
                                </span>
                                <span className="flex flex-col">
                                  <span>Touchpoint: {touchpoint.title || `Touchpoint ${touchpointIndex + 1}`}</span>
                                  <span className="text-xs text-gray-500">
                                    Part of Stage {stageIndex + 1}: {stage.name}
                                  </span>
                                </span>
                              </h6>
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
        <div className="flex items-center gap-2">
          <Input
            placeholder="e.g., 5-7"
            {...field}
            type="number"
            className="text-sm"
            onChange={(e) => {
              field.onChange(e);
              const newStages = [...stages];
              newStages[stageIndex].touchpoints[touchpointIndex].duration = e.target.value;
              setStages(newStages);
            }}
          />
          <span className="text-sm text-gray-500">/Mins</span>
        </div>
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
                                          field.onChange(e)
                                          const newStages = [...stages]
                                          newStages[stageIndex].touchpoints[touchpointIndex].comment = e.target.value
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
                                name={`stages.${stageIndex}.touchpoints.${touchpointIndex}.compassTags`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm">Compass Tags</FormLabel>
                                    <CompassTags
                                      selectedTags={field.value || []}
                                      onTagSelect={(tag) => {
                                        const updated = [...(field.value || []), tag]
                                        field.onChange(updated)

                                        // update local state for UI sync
                                        const newStages = [...stages]
                                        newStages[stageIndex].touchpoints[touchpointIndex].compassTags = updated
                                        setStages(newStages)
                                      }}
                                      onTagRemove={(tag) => {
                                        const updated = (field.value || []).filter((t) => t !== tag)
                                        field.onChange(updated)

                                        // update local state for UI sync
                                        const newStages = [...stages]
                                        newStages[stageIndex].touchpoints[touchpointIndex].compassTags = updated
                                        setStages(newStages)
                                      }}
                                    />
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

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
                                    <div className="flex items-center justify-between p-2 border-b bg-green-50">
                                      <span className="text-xs font-medium flex items-center">
                                        <span className="bg-green-600 text-white rounded-full w-4 h-4 flex items-center justify-center mr-2 text-xs">
                                          {actionIndex + 1}
                                        </span>
                                        <span className="flex flex-col">
                                          <span>Action: {action.title || `Action ${actionIndex + 1}`}</span>
                                          <span className="text-[10px] text-gray-500">
                                            {`Stage ${stageIndex + 1} > Touchpoint ${touchpointIndex + 1}`}
                                          </span>
                                        </span>
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <select
                                          value={action.type}
                                          onChange={(e) =>
                                            handleActionTypeChange(
                                              stageIndex,
                                              touchpointIndex,
                                              actionIndex,
                                              e.target.value as ActionType,
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
                                                alt="Action preview"
                                                className="w-full h-full object-cover"
                                              />
                                              <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-0 right-0 h-5 w-5 p-0 rounded-full"
                                                onClick={(e) => {
                                                  e.preventDefault()
                                                  e.stopPropagation()
                                                  const newStages = [...stages]
                                                  newStages[stageIndex].touchpoints[touchpointIndex].actions[
                                                    actionIndex
                                                  ].imageUrl = ""
                                                  setStages(newStages)
                                                }}
                                              >
                                                <Trash2 className="h-3 w-3" />
                                              </Button>
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
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                {id ? "Save Journey" : "Create Journey"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
      {/* Custom Validation Error Popup */}
      {showValidationPopup && (
  <div
    className="fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center pointer-events-none"
  >
    <div
      className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full pointer-events-auto"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-red-600">Required Fields Missing</h3>
        <button
          onClick={() => setShowValidationPopup(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <p className="mb-3 text-gray-700">Please fill in the following required fields:</p>
        <ul className="list-disc pl-5 space-y-2 text-red-600">
          {validationErrors.map((error, index) => (
            <li key={index} className="text-sm">
              {error}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => setShowValidationPopup(false)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Close and Fix
        </button>
      </div>
    </div>
  </div>
)}

    </Dialog>
  )
}
