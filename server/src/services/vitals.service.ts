import {
  VitalsDashboardData,
  VitalCardData,
} from '@healthpulse/shared';

// Clinical baseline demo dataset for Elena Rostova (34yo female)
// Clearly marked as development/demonstration telemetry
const vitalsDashboardState: VitalsDashboardData = {
  patient: {
    id: 'pt_elena_rostova',
    name: 'Elena Rostova',
    age: 34,
    gender: 'Female',
    lastSynced: 'Today at 08:30 AM',
    syncStatus: 'synced',
    securityBadge: 'Demonstration Health Telemetry • Simulated Wearable Data',
  },
  summary: {
    status: 'normal',
    statusLabel: 'Physiological Baseline Stable',
    stabilityIndex: 94,
    summaryText:
      'All baseline telemetry readings are consistent with previous 30-day clinical medians. SpO2 remains optimal at 99%, resting pulse is steady at 64 bpm, and sleep duration reached target thresholds.',
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isDemoData: true,
  },
  cards: {
    heart_rate: {
      id: 'v_hr_1',
      metric: 'heart_rate',
      label: 'Resting Heart Rate',
      value: '64',
      numericValue: 64,
      unit: 'bpm',
      timestamp: '08:30 AM',
      status: 'normal',
      statusLabel: 'Optimal',
      baselineRange: 'Circadian median 60–72 bpm',
      deltaText: '+1 bpm vs baseline',
      deltaPositive: true,
      historyPoints: [68, 66, 65, 63, 64, 65, 64],
      supportingNote: 'Resting heart rate remained consistent during overnight tracking.',
    },
    blood_pressure: {
      id: 'v_bp_1',
      metric: 'blood_pressure',
      label: 'Blood Pressure',
      value: '118/78',
      numericValue: 118,
      secondaryValue: 78,
      unit: 'mmHg',
      timestamp: '08:15 AM',
      status: 'normal',
      statusLabel: 'Optimal',
      baselineRange: 'Resting target 110–120 / 70–80 mmHg',
      deltaText: '-2% vs 30-day mean',
      deltaPositive: true,
      historyPoints: [122, 120, 119, 121, 118, 120, 118],
      supportingNote: 'Systolic and diastolic pressures are within clinical reference ranges.',
    },
    sleep: {
      id: 'v_sleep_1',
      metric: 'sleep',
      label: 'Sleep Duration',
      value: '7.8',
      numericValue: 7.8,
      unit: 'hrs',
      timestamp: '07:00 AM',
      status: 'normal',
      statusLabel: 'Target Met',
      baselineRange: 'Target envelope 7.0–9.0 hrs',
      deltaText: '+42 min vs yesterday',
      deltaPositive: true,
      historyPoints: [6.8, 7.1, 6.5, 7.4, 7.0, 7.2, 7.8],
      supportingNote: 'Sufficient restorative rest recorded with balanced sleep architecture.',
    },
    spo2: {
      id: 'v_spo2_1',
      metric: 'spo2',
      label: 'Blood Oxygen (SpO2)',
      value: '99',
      numericValue: 99,
      unit: '%',
      timestamp: '08:30 AM',
      status: 'normal',
      statusLabel: 'Optimal',
      baselineRange: 'Clinical reference 95–100%',
      deltaText: 'Consistent baseline',
      deltaPositive: true,
      historyPoints: [98, 99, 98, 99, 99, 98, 99],
      supportingNote: 'Peripheral capillary oxygen saturation remained within standard range.',
    },
  },
  daily: [
    {
      id: 'd_sleep',
      metric: 'sleep',
      label: 'Sleep Duration',
      value: '7h 48m',
      target: '7h – 9h target',
      status: 'normal',
      statusLabel: 'Optimal',
      supportingText: 'Restorative sleep duration within recommended adult targets.',
    },
    {
      id: 'd_steps',
      metric: 'steps',
      label: 'Physical Activity',
      value: '8,420 steps',
      target: '8,000 steps daily baseline',
      status: 'normal',
      statusLabel: 'Active',
      supportingText: 'Daily activity baseline achieved with regular mobility intervals.',
    },
    {
      id: 'd_hydration',
      metric: 'hydration',
      label: 'Estimated Hydration',
      value: '2.1 L',
      target: '2.5 L recommended',
      status: 'attention',
      statusLabel: 'Below Target',
      supportingText: 'Daily fluid intake is approximately 400 mL below the recommended target.',
    },
    {
      id: 'd_hr',
      metric: 'heart_rate',
      label: 'Resting Heart Rate',
      value: '64 bpm',
      target: '60–72 bpm median',
      status: 'normal',
      statusLabel: 'Steady',
      supportingText: 'Resting pulse is consistent with circadian baseline patterns.',
    },
  ],
  trends: {
    sevenDays: [
      { date: '2026-09-28', label: 'Mon', heartRate: 67, systolic: 121, diastolic: 80, sleepHours: 6.9, spo2: 98 },
      { date: '2026-09-29', label: 'Tue', heartRate: 66, systolic: 120, diastolic: 79, sleepHours: 7.2, spo2: 99 },
      { date: '2026-09-30', label: 'Wed', heartRate: 65, systolic: 119, diastolic: 78, sleepHours: 6.8, spo2: 98 },
      { date: '2026-10-01', label: 'Thu', heartRate: 63, systolic: 121, diastolic: 80, sleepHours: 7.5, spo2: 99 },
      { date: '2026-10-02', label: 'Fri', heartRate: 64, systolic: 118, diastolic: 78, sleepHours: 7.1, spo2: 99 },
      { date: '2026-10-03', label: 'Sat', heartRate: 65, systolic: 119, diastolic: 79, sleepHours: 7.4, spo2: 99 },
      { date: '2026-10-04', label: 'Sun', heartRate: 64, systolic: 118, diastolic: 78, sleepHours: 7.8, spo2: 99 },
    ],
    thirtyDays: [
      { date: '2026-09-05', label: 'W1', heartRate: 66, systolic: 122, diastolic: 81, sleepHours: 7.1, spo2: 98 },
      { date: '2026-09-12', label: 'W2', heartRate: 65, systolic: 121, diastolic: 80, sleepHours: 7.0, spo2: 99 },
      { date: '2026-09-19', label: 'W3', heartRate: 64, systolic: 119, diastolic: 79, sleepHours: 7.3, spo2: 99 },
      { date: '2026-09-26', label: 'W4', heartRate: 65, systolic: 120, diastolic: 80, sleepHours: 7.2, spo2: 98 },
      { date: '2026-10-04', label: 'W5', heartRate: 64, systolic: 118, diastolic: 78, sleepHours: 7.5, spo2: 99 },
    ],
    threeMonths: [
      { date: '2026-08-01', label: 'Aug', heartRate: 66, systolic: 121, diastolic: 80, sleepHours: 7.2, spo2: 98 },
      { date: '2026-09-01', label: 'Sep', heartRate: 65, systolic: 120, diastolic: 79, sleepHours: 7.1, spo2: 99 },
      { date: '2026-10-01', label: 'Oct', heartRate: 64, systolic: 118, diastolic: 78, sleepHours: 7.4, spo2: 99 },
    ],
  },
  insights: [
    {
      id: 'ins_hr',
      type: 'observation',
      category: 'Heart Rate',
      message: 'Your resting heart rate remained close to your recent 30-day average.',
      observedAt: 'Today',
    },
    {
      id: 'ins_sleep',
      type: 'trend',
      category: 'Sleep',
      message: 'You slept longer than yesterday, completing 7.8 hours of rest.',
      observedAt: 'Past 24 Hours',
    },
    {
      id: 'ins_hydration',
      type: 'target',
      category: 'Hydration',
      message: 'Estimated fluid intake is below today’s target of 2.5 liters.',
      observedAt: 'Today',
    },
    {
      id: 'ins_bp',
      type: 'observation',
      category: 'Blood Pressure',
      message: 'Systolic pressure has remained stable within your expected clinical baseline.',
      observedAt: 'Past 7 Days',
    },
  ],
  alerts: [
    {
      id: 'alt_info_1',
      severity: 'normal',
      title: 'Resting Metrics Stable',
      message: 'All observed physiological parameters are within established baseline targets.',
      timestamp: 'Today at 08:30 AM',
    },
    {
      id: 'alt_att_1',
      severity: 'attention',
      title: 'Hydration Target',
      message: 'Daily fluid intake is trending lower than the target guideline.',
      timestamp: 'Today at 10:00 AM',
      actionLabel: 'Log Water Intake',
    },
  ],
};

export function getPatientVitals(): VitalsDashboardData {
  return vitalsDashboardState;
}

export function logNewVital(reading: Partial<VitalCardData>): VitalsDashboardData {
  if (reading.metric && vitalsDashboardState.cards[reading.metric as keyof typeof vitalsDashboardState.cards]) {
    const key = reading.metric as keyof typeof vitalsDashboardState.cards;
    vitalsDashboardState.cards[key] = {
      ...vitalsDashboardState.cards[key],
      ...reading,
      timestamp: 'Just now',
    };
  }
  return vitalsDashboardState;
}
