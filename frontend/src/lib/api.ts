import { createServerFn } from "@tanstack/react-start";
import PocketBase from "pocketbase";
import { z } from "zod";
import dayjs from "~/utils/dayjs";


const pb = new PocketBase(process.env.POCKETBASE_URL);

pb.autoCancellation(false);

type DataRecord = {
  timestamp: string;
  temperature: number;
  humidity: number;
};

// Helper function to fetch all records across all pages
async function fetchAllRecords(filter?: string) {
  const allRecords: DataRecord[] = [];
  let page = 1;
  const perPage = 1000; // PocketBase max per page

  while (true) {
    const records = await pb.collection("data").getList(page, perPage, {
      sort: "timestamp",
      ...(filter && { filter }),
      requestKey: null,
    });

    // Map and add records from current page
    const pageRecords = records.items.map(
      (record) =>
        ({
          timestamp: record.timestamp,
          temperature: record.temperature,
          humidity: record.humidity,
        }) as DataRecord,
    );

    allRecords.push(...pageRecords);

    // Check if we've reached the last page
    if (page >= records.totalPages) {
      break;
    }

    page++;
  }

  return allRecords;
}

export const getRecords = createServerFn({ method: "GET", response: "data", type: "dynamic" })
  .validator(
    z.object({
      period: z.enum(["hour", "day", "week", "month", "year", "all_time"]),
    }),
  )
  .handler(async ({ data }) => {
    // Authenticate ONCE on the PocketBase instance
    await pb
      .collection("_superusers")
      .authWithPassword(process.env.POCKETBASE_EMAIL, process.env.POCKETBASE_PASSWORD);

    const period = data.period;
    const endTime = dayjs().utc();

    let startTime = endTime.subtract(1, "hour");

    if (period === "hour") {
      startTime = endTime.subtract(1, "hour");
    } else if (period === "day") {
      startTime = endTime.subtract(1, "day");
    } else if (period === "week") {
      startTime = endTime.subtract(1, "week");
    } else if (period === "month") {
      startTime = endTime.subtract(1, "month");
    } else if (period === "year") {
      startTime = endTime.subtract(1, "year");
    } else if (period === "all_time") {
      startTime = dayjs().subtract(5, "year");
    }

    /* console.log(
      `[getRecords] Start time: ${startTime.format("YYYY-MM-DD HH:mm:ss.SSS[Z]")}`,
    );
    console.log(
      `[getRecords] End time: ${endTime.format("YYYY-MM-DD HH:mm:ss.SSS[Z]")}`,
    ); */

    // Use helper function to fetch all records across all pages
    const filter = `timestamp >= "${startTime.format("YYYY-MM-DD HH:mm:ss.SSS[Z]")}"`;
    const rawRecords = await fetchAllRecords(filter);

    /* console.log(`[getRecords] Last ${period} records: ${rawRecords.length}`); */

    return rawRecords;
  });
