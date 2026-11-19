"use client"

import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SERVICE_MODES,
  type ServiceFormValues,
} from "@/lib/validations/service"

export function ServicePricingSection() {
  const { control } = useFormContext<ServiceFormValues>()

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <FormField
        control={control}
        name="basePrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Starting price (USD)</FormLabel>
            <FormControl>
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                placeholder="25"
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="estimatedDuration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estimated duration</FormLabel>
            <FormControl>
              <Input placeholder="2-3 hours" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="serviceMode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service mode</FormLabel>
            <Select onValueChange={field.onChange} value={field.value ?? null}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a mode" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SERVICE_MODES.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="serviceArea"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service area</FormLabel>
            <FormControl>
              <Input placeholder="Dhanmondi, Dhaka" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
