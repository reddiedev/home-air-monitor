"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "~/components/ui/chart";
import { Skeleton } from "~/components/ui/skeleton";

type DataRecord = {
	timestamp: string;
	temperature: number;
	humidity: number;
};

const chartConfig = {
	temperature: {
		label: "Temperature",
		color: "var(--chart-1)",
	},
	humidity: {
		label: "Humidity",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig;

interface TemperatureHumidityChartProps {
	data: DataRecord[];
}

export default function TemperatureHumidityChart({
	data,
}: TemperatureHumidityChartProps) {
	const [activeChart, setActiveChart] =
		React.useState<keyof typeof chartConfig>("temperature");

	const stats = React.useMemo(() => {
		const temperatures = data.map((d) => d.temperature);
		const humidities = data.map((d) => d.humidity);

		return {
			temperature: {
				avg:
					temperatures.reduce((acc, curr) => acc + curr, 0) /
					temperatures.length,
				min: Math.min(...temperatures),
				max: Math.max(...temperatures),
			},
			humidity: {
				avg:
					humidities.reduce((acc, curr) => acc + curr, 0) / humidities.length,
				min: Math.min(...humidities),
				max: Math.max(...humidities),
			},
		};
	}, [data]);

	// Calculate Y-axis domain based on active chart data
	const yAxisDomain = React.useMemo(() => {
		const currentStats = stats[activeChart];
		const padding = (currentStats.max - currentStats.min) * 0.1; // 10% padding
		return [
			Math.max(0, currentStats.min - padding), // Ensure minimum is not negative
			currentStats.max + padding,
		];
	}, [stats, activeChart]);

	const formatValue = (value: number, type: "temperature" | "humidity") => {
		if (type === "temperature") {
			return `${value.toFixed(1)}°C`;
		}
		return `${value.toFixed(1)}%`;
	};

	const getUnit = (type: "temperature" | "humidity") => {
		return type === "temperature" ? "°C" : "%";
	};

	// Calculate time difference for the latest record
	const timeDifference = React.useMemo(() => {
		if (data.length === 0) return null;

		const latestTimestamp = new Date(data[data.length - 1].timestamp);
		const now = new Date();
		const diffInMinutes = Math.floor(
			(now.getTime() - latestTimestamp.getTime()) / (1000 * 60),
		);

		if (diffInMinutes < 1) return "Just now";
		if (diffInMinutes === 1) return "1 minute ago";
		if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours === 1) return "1 hour ago";
		return `${diffInHours} hours ago`;
	}, [data]);

	return (
		<Card className="py-0">
			<CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 pt-3 sm:pb-0">
					<CardTitle>Bedroom Monitor</CardTitle>
					<CardDescription>
						Real-time temperature and humidity readings
						{timeDifference && (
							<span className="block text-xs text-muted-foreground mt-1">
								{timeDifference}
							</span>
						)}
					</CardDescription>
				</div>
				<div className="flex">
					{(["temperature", "humidity"] as const).map((key) => {
						const chart = key as keyof typeof chartConfig;
						return (
							<button
								type="button"
								key={chart}
								data-active={activeChart === chart}
								className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
								onClick={() => setActiveChart(chart)}
							>
								<span className="text-muted-foreground text-xs">
									{chartConfig[chart].label}
								</span>

								{data.length > 0 && (

									<span className="text-lg leading-none font-bold sm:text-3xl">
										{formatValue(stats[key].avg, key)}
									</span>
								)}

								{data.length == 0 && <Skeleton className="w-full h-4" />
								}

								{data.length > 0 && (

									<span className="text-muted-foreground text-xs">
										{formatValue(stats[key].min, key)} -{" "}
										{formatValue(stats[key].max, key)}
									</span>
								)}
								{data.length == 0 && <Skeleton className="w-full h-4" />}
							</button>


						)
					})}
				</div>
			</CardHeader>
			<CardContent className="px-2 sm:p-6 py-0">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[300px] w-full"
				>
					<LineChart
						accessibilityLayer
						data={data}
						margin={{
							left: 0,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="timestamp"
							tickLine={true}
							axisLine={true}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleTimeString("en-US", {
									hour: "2-digit",
									minute: "2-digit",
								});
							}}
						/>
						<YAxis type="number" width={45} scale="linear" domain={yAxisDomain} />
						<ChartTooltip
							content={
								<ChartTooltipContent
									className="w-[180px]"
									labelFormatter={(value) => {
										return new Date(value).toLocaleString("en-US", {
											month: "short",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										});
									}}
									formatter={(value, name) => [
										`${Number(value).toFixed(1)}${getUnit(name as "temperature" | "humidity")}`,
										chartConfig[name as keyof typeof chartConfig]?.label ||
										name,
									]}
								/>
							}
						/>
						<Line
							dataKey={activeChart}
							type="monotone"
							stroke={chartConfig[activeChart].color}
							strokeWidth={2}
							dot={false}
							activeDot={{
								r: 4,
								stroke: chartConfig[activeChart].color,
								strokeWidth: 2,
							}}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
