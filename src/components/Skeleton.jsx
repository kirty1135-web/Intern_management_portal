import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-4 w-24 bg-slate-200 rounded-md" />
      <div className="h-6 w-6 bg-slate-200 rounded-full" />
    </div>
    <div className="h-8 w-16 bg-slate-200 rounded-md" />
    <div className="h-3 w-32 bg-slate-200 rounded-md" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-pulse">
    <div className="h-4 w-32 bg-slate-200 rounded-md" />
    <div className="h-48 w-full bg-slate-100 rounded-xl" />
  </div>
);

export const TableSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-4 w-28 bg-slate-200 rounded-md" />
      <div className="h-8 w-20 bg-slate-200 rounded-md" />
    </div>
    <div className="space-y-2.5">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="flex gap-4 items-center">
          <div className="h-10 w-10 bg-slate-200 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 w-1/3 bg-slate-200 rounded-md" />
            <div className="h-3 w-1/4 bg-slate-200 rounded-md" />
          </div>
          <div className="h-4 w-16 bg-slate-200 rounded-md" />
        </div>
      ))}
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ChartSkeleton />
      </div>
      <div>
        <TableSkeleton />
      </div>
    </div>
  </div>
);
