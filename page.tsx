import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const SUPABASE_URL = "https://moffuiaclxlkldqjuvwk.supabase.co";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZmZ1aWFjbHhsa2xkcWp1dndrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNjU5NzcsImV4cCI6MjA5Mjk0MTk3N30.JxKn4OywOS2-SxeWyiwfVxta-mqhHw2LMLKiDPd1pQo";

export default function App() {
    const [data, setData] = useState([]);
    const [distance, setDistance] = useState(0);

    const fetchData = async () => {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/tank?id=eq.1`, {
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        const json = await res.json();

        if (json.length > 0) {
            setDistance(json[0].distance);
            setData((prev) => [...prev.slice(-20), json[0].distance]);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, []);

    const percentage = Math.max(0, Math.min(100, ((50 - distance) / 50) * 100));

    return (
        <div className="min-h-screen bg-black text-white p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Smart Tank Dashboard</h1>

            {/* Water Tank Animation */}
            <div className="flex justify-center mb-8">
                <div className="w-40 h-80 border-2 border-cyan-400 rounded-xl relative overflow-hidden">
                    <motion.div
                        className="absolute bottom-0 w-full bg-cyan-500"
                        animate={{ height: `${percentage}%` }}
                        transition={{ duration: 1 }}
                    />
                    <div className="absolute top-2 left-2 text-sm">{percentage.toFixed(0)}%</div>
                </div>
            </div>

            {/* Stats */}
            <div className="text-center mb-6">
                <p>Distance: {distance.toFixed(2)} cm</p>
            </div>

            {/* Graph */}
            <div className="bg-gray-900 p-4 rounded-lg">
                <h2 className="mb-2">Real-time Graph</h2>
                <div className="flex items-end h-40 gap-1">
                    {data.map((d, i) => (
                        <div
                            key={i}
                            className="bg-cyan-400 w-2"
                            style={{ height: `${(d / 50) * 100}%` }}
                        />
                    ))}
                </div>
            </div>

            {/* Mobile UI Buttons */}
            <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-4">
                <button
                    className="bg-green-500 px-6 py-3 rounded-xl"
                    onClick={() => updatePump("ON")}
                >
                    ON
                </button>
                <button
                    className="bg-red-500 px-6 py-3 rounded-xl"
                    onClick={() => updatePump("OFF")}
                >
                    OFF
                </button>
            </div>
        </div>
    );

    async function updatePump(state) {
        await fetch(`${SUPABASE_URL}/rest/v1/tank?id=eq.1`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({ pump: state }),
        });
    }
}
