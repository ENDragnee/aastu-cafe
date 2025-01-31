"use client"
import React, { useState, useEffect } from 'react';
import { Calendar, Download, Loader2, RefreshCw } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ExportAttendance = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  interface Record {
    name: string;
    university: string;
    responsibility: string;
    date: string;
    timestamp: string;
  }
  
  const [recentRecords, setRecentRecords] = useState<Record[]>([]);

  const fetchRecords = async (useFilters = false) => {
    try {
      setIsLoading(true);
      let url = '/api/attendance/recent';

      if (useFilters && startDate && endDate) {
        const params = new URLSearchParams({
          startDate,
          endDate,
          startTime,
          endTime,
        });
        url = `${url}?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch records');
      
      const data = await response.json();
      setRecentRecords(data);
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          startTime: `${startTime}:00`,
          endTime: `${endTime}:59`,
        }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_report_${startDate}_${endDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFilter = () => {
    fetchRecords(true);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setStartTime('00:00');
    setEndTime('23:59');
    fetchRecords();
  };

  // Set today's date as default for date inputs
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (!startDate) setStartDate(today);
    if (!endDate) setEndDate(today);
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Manage Attendance Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full"
                step="1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full"
                step="1"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleFilter}
              disabled={isLoading || !startDate || !endDate}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                'Filter'
              )}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={handleExport}
            disabled={isExporting || !startDate || !endDate}
            className="w-full mt-2"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Export to Excel
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">University</th>
                  <th className="px-4 py-2 text-left">Responsibility</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.map((record, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{record.name}</td>
                    <td className="px-4 py-2">{record.university}</td>
                    <td className="px-4 py-2">{record.responsibility}</td>
                    <td className="px-4 py-2">{record.date}</td>
                    <td className="px-4 py-2">{record.timestamp}</td>
                  </tr>
                ))}
                {recentRecords.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportAttendance;