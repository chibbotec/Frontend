import * as React from "react"
import { TooltipProps } from "recharts"
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"

export type ChartConfig = Record<
  string,
  {
    label: string
    color?: string
  }
>

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

export function ChartContainer({
  config,
  className,
  ...props
}: ChartContainerProps) {
  return <div className={className} {...props} />
}

interface ChartTooltipProps extends TooltipProps<ValueType, NameType> {
  hideLabel?: boolean
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      {!hideLabel && <div className="text-sm font-medium">{label}</div>}
      <div className="mt-1 grid gap-1">
        {payload.map((item, index) => (
          <div
            key={`item-${index}`}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-1">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium">
                {item.name}
              </span>
            </div>
            <span className="text-sm font-medium">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 