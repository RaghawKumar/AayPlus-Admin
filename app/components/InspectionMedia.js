"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { API_BASE_URL } from '../lib/api';

export default function InspectionMedia({ path, token, video = false }) {
  const [source, setSource] = useState(null), [error, setError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    let objectUrl;
    const url = new URL(path, `${API_BASE_URL}/`);
    const internal = url.origin === new URL(API_BASE_URL).origin;
    fetch(url, { headers: internal ? { Authorization: `Bearer ${token}` } : {}, signal: controller.signal, cache: 'no-store' })
      .then(response => { if (!response.ok) throw new Error('Evidence unavailable'); return response.blob(); })
      .then(blob => { if (controller.signal.aborted) return; objectUrl = URL.createObjectURL(blob); setSource(objectUrl); })
      .catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [path, token]);
  if (error) return <p>Evidence unavailable. Refresh and try again.</p>;
  if (!source) return <p role="status">Loading evidence…</p>;
  return video ? <video src={source} controls preload="metadata" style={{ width: '100%', maxHeight: 360, borderRadius: 12 }} />
    : <a href={source} target="_blank" rel="noreferrer"><Image src={source} alt="Recorded handover condition" width={480} height={300} unoptimized style={{ width: '100%', height: 'auto', borderRadius: 12 }} /></a>;
}
