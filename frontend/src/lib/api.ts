import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

type DataRecord = {
  timestamp: string;
  temperature: number;
  humidity: number;
}

export const getRecords = createServerFn().handler(async () => {
  const collection = await pb.collection("data").authWithPassword("red@reddie.dev", "password123");

  const records = collection.record.
})