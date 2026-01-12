"use client";

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { formatNumber, calculateChange } from '@/lib/analytics';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  isPositive?: boolean;
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel = 'vs last week',
  icon: Icon,
  isPositive = true,
}: StatsCardProps) {
  return (
    <div className="relative">
      <div className="relative rounded-xl border border-white/20 p-1">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={2}
        />
        <div className="relative bg-black rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            {change !== undefined && (
              <div
                className={`flex items-center text-sm ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {change}%
              </div>
            )}
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          <p className="text-sm text-gray-400">{title}</p>
          {changeLabel && change !== undefined && (
            <p className="text-xs text-gray-500 mt-2">{changeLabel}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  metrics: Array<{
    label: string;
    value: string | number;
  }>;
  icon: LucideIcon;
}

export function MetricCard({ title, metrics, icon: Icon }: MetricCardProps) {
  return (
    <div className="relative">
      <div className="relative rounded-xl border border-white/20 p-1">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={2}
        />
        <div className="relative bg-black rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <div className="space-y-3">
            {metrics.map((metric, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">{metric.label}</span>
                <span className="text-white font-medium">
                  {typeof metric.value === 'number'
                    ? formatNumber(metric.value)
                    : metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface RealtimeIndicatorProps {
  label: string;
  value: number;
  icon: LucideIcon;
  pulse?: boolean;
}

export function RealtimeIndicator({
  label,
  value,
  icon: Icon,
  pulse = true,
}: RealtimeIndicatorProps) {
  return (
    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
      <div className="relative">
        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
          <Icon className="w-4 h-4 text-white" />
        </div>
        {pulse && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        )}
      </div>
      <div>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-xs text-gray-400">{label}</p>
      </div>
    </div>
  );
}
