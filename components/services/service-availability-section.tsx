"use client"

import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import type { ServiceFormValues } from "@/lib/validations/service"

export function ServiceAvailabilitySection() {
  const { control } = useFormContext<ServiceFormValues>()

  return (
    <FormField
      control={control}
      name="isAvailable"
      render={({ field }) => (
        <FormItem className="flex items-center justify-between rounded-md border p-4">
          <div className="space-y-0.5">
            <FormLabel>Available for booking</FormLabel>
            <FormDescription>
              Turn off to hide this service from customers.
            </FormDescription>
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
