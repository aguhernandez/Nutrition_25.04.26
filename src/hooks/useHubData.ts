import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getAnthropometry,
  getTrainingSchedule,
  getFoodDiary,
  getAthleteProfile,
  getAthleteHabits,
  getWellness,
  HubApiError,
  type HubAnthropometry,
  type HubTrainingSchedule,
  type HubFoodDiary,
  type HubAthleteProfile,
  type HubAthleteHabits,
  type HubWellness,
} from '../lib/hubApi';

interface UseHubAnthropometryResult {
  data: HubAnthropometry | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHubAnthropometry(athleteEmailOrId: string | null | undefined): UseHubAnthropometryResult {
  const [data, setData] = useState<HubAnthropometry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef<string | null>(null);

  const doFetch = useCallback(async (id: string, force = false) => {
    if (!force && fetchedRef.current === id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getAnthropometry(id);
      setData(result);
      fetchedRef.current = id;
    } catch (err) {
      fetchedRef.current = null;
      if (err instanceof HubApiError) {
        setError(err.message);
      } else {
        setError('Error connecting to Hub');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!athleteEmailOrId) return;
    doFetch(athleteEmailOrId);
  }, [athleteEmailOrId, doFetch]);

  const refetch = useCallback(() => {
    if (!athleteEmailOrId) return;
    fetchedRef.current = null;
    doFetch(athleteEmailOrId, true);
  }, [athleteEmailOrId, doFetch]);

  return { data, loading, error, refetch };
}

interface UseHubTrainingScheduleResult {
  data: HubTrainingSchedule | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHubTrainingSchedule(
  athleteEmailOrId: string | null | undefined,
  dateFrom?: string,
  dateTo?: string
): UseHubTrainingScheduleResult {
  const [data, setData] = useState<HubTrainingSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `${athleteEmailOrId}|${dateFrom ?? ''}|${dateTo ?? ''}`;
  const fetchedRef = useRef<string | null>(null);

  const doFetch = useCallback(async (id: string, key: string, force = false) => {
    if (!force && fetchedRef.current === key) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getTrainingSchedule(id, dateFrom, dateTo);
      setData(result);
      fetchedRef.current = key;
    } catch (err) {
      fetchedRef.current = null;
      if (err instanceof HubApiError) {
        setError(err.message);
      } else {
        setError('Error connecting to Hub');
      }
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    if (!athleteEmailOrId) return;
    doFetch(athleteEmailOrId, cacheKey);
  }, [athleteEmailOrId, cacheKey, doFetch]);

  const refetch = useCallback(() => {
    if (!athleteEmailOrId) return;
    fetchedRef.current = null;
    doFetch(athleteEmailOrId, cacheKey, true);
  }, [athleteEmailOrId, cacheKey, doFetch]);

  return { data, loading, error, refetch };
}

interface UseHubFoodDiaryResult {
  data: HubFoodDiary | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHubFoodDiary(
  athleteEmailOrId: string | null | undefined,
  dateFrom: string,
  dateTo: string
): UseHubFoodDiaryResult {
  const [data, setData] = useState<HubFoodDiary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `${athleteEmailOrId}|${dateFrom}|${dateTo}`;
  const fetchedRef = useRef<string | null>(null);

  const doFetch = useCallback(async (id: string, key: string, force = false) => {
    if (!force && fetchedRef.current === key) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getFoodDiary(id, dateFrom, dateTo);
      setData(result);
      fetchedRef.current = key;
    } catch (err) {
      fetchedRef.current = null;
      if (err instanceof HubApiError) {
        setError(err.message);
      } else {
        setError('Error connecting to Hub');
      }
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    if (!athleteEmailOrId) return;
    doFetch(athleteEmailOrId, cacheKey);
  }, [athleteEmailOrId, cacheKey, doFetch]);

  const refetch = useCallback(() => {
    if (!athleteEmailOrId) return;
    fetchedRef.current = null;
    doFetch(athleteEmailOrId, cacheKey, true);
  }, [athleteEmailOrId, cacheKey, doFetch]);

  return { data, loading, error, refetch };
}

interface UseHubAthleteProfileResult {
  data: HubAthleteProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHubAthleteProfile(athleteEmailOrId: string | null | undefined): UseHubAthleteProfileResult {
  const [data, setData] = useState<HubAthleteProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef<string | null>(null);

  const doFetch = useCallback(async (id: string, force = false) => {
    if (!force && fetchedRef.current === id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getAthleteProfile(id);
      setData(result);
      fetchedRef.current = id;
    } catch (err) {
      fetchedRef.current = null;
      if (err instanceof HubApiError) {
        setError(err.message);
      } else {
        setError('Error connecting to Hub');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!athleteEmailOrId) return;
    doFetch(athleteEmailOrId);
  }, [athleteEmailOrId, doFetch]);

  const refetch = useCallback(() => {
    if (!athleteEmailOrId) return;
    fetchedRef.current = null;
    doFetch(athleteEmailOrId, true);
  }, [athleteEmailOrId, doFetch]);

  return { data, loading, error, refetch };
}

interface UseHubHabitsResult {
  data: HubAthleteHabits | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHubHabits(athleteEmailOrId: string | null | undefined): UseHubHabitsResult {
  const [data, setData] = useState<HubAthleteHabits | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef<string | null>(null);

  const doFetch = useCallback(async (id: string, force = false) => {
    if (!force && fetchedRef.current === id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getAthleteHabits(id);
      setData(result);
      fetchedRef.current = id;
    } catch (err) {
      fetchedRef.current = null;
      if (err instanceof HubApiError) {
        setError(err.message);
      } else {
        setError('Error connecting to Hub');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!athleteEmailOrId) return;
    doFetch(athleteEmailOrId);
  }, [athleteEmailOrId, doFetch]);

  const refetch = useCallback(() => {
    if (!athleteEmailOrId) return;
    fetchedRef.current = null;
    doFetch(athleteEmailOrId, true);
  }, [athleteEmailOrId, doFetch]);

  return { data, loading, error, refetch };
}

interface UseHubWellnessResult {
  data: HubWellness | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHubWellness(
  athleteEmailOrId: string | null | undefined,
  dateFrom: string,
  dateTo: string
): UseHubWellnessResult {
  const [data, setData] = useState<HubWellness | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `${athleteEmailOrId}|${dateFrom}|${dateTo}`;
  const fetchedRef = useRef<string | null>(null);

  const doFetch = useCallback(async (id: string, key: string, force = false) => {
    if (!force && fetchedRef.current === key) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getWellness(id, dateFrom, dateTo);
      setData(result);
      fetchedRef.current = key;
    } catch (err) {
      fetchedRef.current = null;
      if (err instanceof HubApiError) {
        setError(err.message);
      } else {
        setError('Error connecting to Hub');
      }
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    if (!athleteEmailOrId) return;
    doFetch(athleteEmailOrId, cacheKey);
  }, [athleteEmailOrId, cacheKey, doFetch]);

  const refetch = useCallback(() => {
    if (!athleteEmailOrId) return;
    fetchedRef.current = null;
    doFetch(athleteEmailOrId, cacheKey, true);
  }, [athleteEmailOrId, cacheKey, doFetch]);

  return { data, loading, error, refetch };
}
