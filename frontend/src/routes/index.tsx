import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import TemperatureHumidityChart from "~/components/chart-temperature-humidity";
import ChartTimeToggle, {
	type TimePeriod,
} from "~/components/chart-time-toggle";

import { getRecords } from "~/lib/api";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("hour");
	const queryClient = useQueryClient();

	// Prefetch all time periods on component mount
	useEffect(() => {
		const timePeriods: TimePeriod[] = [
			"hour",
			"day",
			"week",
			"month",
			"year",
			"all_time",
		];

		timePeriods.forEach((period) => {
			queryClient.prefetchQuery({
				queryKey: ["records", period],
				queryFn: async () => {
					return getRecords({
						data: {
							period,
						},
					});
				},
				staleTime: 5 * 60 * 1000, // 5 minutes
			});
		});
	}, [queryClient]);

	const query = useQuery({
		queryKey: ["records", selectedPeriod],
		queryFn: async () => {
			return getRecords({
				data: {
					period: selectedPeriod,
				},
			});
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	return (
		<main className="flex flex-col antialiased scroll-smooth px-5 md:px-40 lg:px-60 xl:px-80 py-10 md:py-20">
			<section className="flex flex-col gap-4">
				<div className="flex flex-col gap-4">
					<div className="flex justify-end">
						<ChartTimeToggle
							selectedPeriod={selectedPeriod}
							setSelectedPeriod={setSelectedPeriod}
						/>
					</div>
					<TemperatureHumidityChart data={query.data ?? []} />
				</div>
			</section>
		</main>
	);
}
