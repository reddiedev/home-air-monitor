"use client";

import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

export type TimePeriod =
	| "hour"
	| "day"
	| "week"
	| "month"
	| "year"
	| "all_time";

export default function ChartTimeToggle({
	selectedPeriod,
	setSelectedPeriod,
}: {
	selectedPeriod: TimePeriod;
	setSelectedPeriod: (period: TimePeriod) => void;
}) {
	return (
		<div className="flex items-center gap-4">
			<span className="text-sm font-medium">Time Period:</span>
			<ToggleGroup
				type="single"
				value={selectedPeriod}
				onValueChange={(value) =>
					value && setSelectedPeriod(value as TimePeriod)
				}
				className="border rounded-md"
			>
				<ToggleGroupItem value="hour" aria-label="Last hour">
					1H
				</ToggleGroupItem>
				<ToggleGroupItem value="day" aria-label="Last day">
					1D
				</ToggleGroupItem>
				<ToggleGroupItem value="week" aria-label="Last week">
					1W
				</ToggleGroupItem>
				<ToggleGroupItem value="month" aria-label="Last month">
					1M
				</ToggleGroupItem>
				<ToggleGroupItem value="year" aria-label="Last year">
					1Y
				</ToggleGroupItem>
				<ToggleGroupItem value="all_time" aria-label="All time">
					All
				</ToggleGroupItem>
			</ToggleGroup>
		</div>
	);
}
