export type Severity = "stable" | "caution" | "critical" | "signal";

export type TrendPoint = { label: string; value: number; secondary?: number };

export type Highlight = {
  id: string;
  title: string;
  detail: string;
  severity: Severity;
  confidence: number;
  window: string;
  sources: LineageRecord[];
};

export type LineageRecord = {
  id: string;
  source: string;
  captured: string;
  value: string;
  method: string;
  confidence: number;
};

export type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  detail: string;
  kind: "record" | "observation" | "order";
};

export type Series = {
  id: string;
  label: string;
  unit: string;
  latest: string;
  delta: string;
  severity: Severity;
  reference: string;
  points: TrendPoint[];
};

export type Kpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  severity: Severity;
  hint: string;
};

export type MacroRow = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  severity: Severity;
};

export type Entity = {
  id: string;
  ref: string;
  name: string;
  meta: string[];
  series: Series[];
  timeline: TimelineEvent[];
  highlights: Highlight[];
};

export type DomainConfig = {
  id: string;
  label: string;
  tagline: string;
  entityNoun: string;
  systemNoun: string;
  compliance: string;
  isolationScope: string;
  entities: Entity[];
  macro: {
    kpis: Kpi[];
    trend: { title: string; caption: string; primaryLabel: string; secondaryLabel: string; points: TrendPoint[] };
    breakdownTitle: string;
    rows: MacroRow[];
    highlights: Highlight[];
  };
  prompts: { micro: string[]; macro: string[] };
};

const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];

const mk = (vals: number[], sec?: number[]): TrendPoint[] =>
  vals.map((v, i) => {
    const point: TrendPoint = { label: months[i] ?? `T${i}`, value: v };
    const s2 = sec?.[i];
    if (s2 !== undefined) point.secondary = s2;
    return point;
  });

export const domains: DomainConfig[] = [
  {
    id: "healthcare",
    label: "Healthcare",
    tagline: "Ward operations & patient records",
    entityNoun: "Patient",
    systemNoun: "Hospital",
    compliance: "HIPAA / PHI",
    isolationScope: "Tenant: St. Aldric Health · Record scope: Ward 4B",
    entities: [
      {
        id: "4092",
        ref: "Patient #4092",
        name: "A. Mwangi",
        meta: ["68 yrs", "Ward 4B · Bed 12", "Admitted 04 Aug", "Cardiology"],
        series: [
          {
            id: "bp",
            label: "Systolic BP",
            unit: "mmHg",
            latest: "154",
            delta: "+12 vs. 90d mean",
            severity: "caution",
            reference: "Ref. range 90–130 mmHg",
            points: mk([128, 131, 136, 142, 148, 154], [82, 84, 86, 88, 90, 92]),
          },
          {
            id: "hr",
            label: "Heart rate",
            unit: "bpm",
            latest: "96",
            delta: "+9 vs. 90d mean",
            severity: "caution",
            reference: "Ref. range 60–100 bpm",
            points: mk([74, 78, 81, 88, 92, 96]),
          },
          {
            id: "spo2",
            label: "SpO₂",
            unit: "%",
            latest: "97",
            delta: "stable",
            severity: "stable",
            reference: "Ref. range 95–100%",
            points: mk([98, 97, 98, 97, 97, 97]),
          },
        ],
        timeline: [
          { id: "t1", date: "12 Aug", title: "Nursing vitals round", detail: "BP 154/92 · HR 96 · Temp 37.1 °C", kind: "record" },
          { id: "t2", date: "11 Aug", title: "Pattern highlight raised", detail: "Cardiovascular trend flagged for clinician double-check", kind: "observation" },
          { id: "t3", date: "09 Aug", title: "Lipid panel resulted", detail: "LDL 4.4 mmol/L · HDL 0.9 mmol/L", kind: "record" },
          { id: "t4", date: "04 Aug", title: "Admission", detail: "Presenting complaint: exertional chest tightness", kind: "order" },
        ],
        highlights: [
          {
            id: "h1",
            title: "Elevated cardiovascular risk trend over 6 months",
            detail:
              "Systolic BP rose monotonically across 6 consecutive readings while resting HR trended upward. Pattern surfaced for double-check — not a diagnosis.",
            severity: "critical",
            confidence: 0.86,
            window: "Mar – Aug 2026",
            sources: [
              { id: "r1", source: "Vitals chart · Ward 4B", captured: "12 Aug 07:14", value: "154/92 mmHg", method: "Cuff, automated", confidence: 0.99 },
              { id: "r2", source: "Vitals chart · Ward 4B", captured: "05 Jul 06:58", value: "148/90 mmHg", method: "Cuff, automated", confidence: 0.98 },
              { id: "r3", source: "Lab · Lipid panel", captured: "09 Aug 11:02", value: "LDL 4.4 mmol/L", method: "Analyser LX-9", confidence: 0.97 },
            ],
          },
          {
            id: "h2",
            title: "Medication adherence gap detected",
            detail: "Two consecutive antihypertensive administrations unrecorded in the eMAR. May be a charting gap.",
            severity: "caution",
            confidence: 0.61,
            window: "08 – 10 Aug",
            sources: [
              { id: "r4", source: "eMAR", captured: "09 Aug 20:00", value: "No entry", method: "System export", confidence: 0.61 },
              { id: "r5", source: "Pharmacy dispense log", captured: "08 Aug 09:30", value: "Dispensed 30 tabs", method: "Barcode scan", confidence: 0.95 },
            ],
          },
        ],
      },
      {
        id: "5117",
        ref: "Patient #5117",
        name: "J. Otieno",
        meta: ["41 yrs", "Ward 4B · Bed 03", "Admitted 10 Aug", "General medicine"],
        series: [
          {
            id: "temp",
            label: "Core temperature",
            unit: "°C",
            latest: "38.4",
            delta: "+1.1 in 48h",
            severity: "critical",
            reference: "Ref. range 36.1–37.5 °C",
            points: mk([36.8, 36.9, 37.0, 37.2, 37.9, 38.4]),
          },
          {
            id: "wbc",
            label: "White cell count",
            unit: "10⁹/L",
            latest: "14.2",
            delta: "+5.1 in 48h",
            severity: "caution",
            reference: "Ref. range 4.0–11.0",
            points: mk([6.4, 6.9, 7.1, 8.8, 11.6, 14.2]),
          },
          {
            id: "hr2",
            label: "Heart rate",
            unit: "bpm",
            latest: "104",
            delta: "+18 in 48h",
            severity: "caution",
            reference: "Ref. range 60–100 bpm",
            points: mk([72, 74, 79, 88, 97, 104]),
          },
        ],
        timeline: [
          { id: "t1", date: "13 Aug", title: "Temperature spike", detail: "38.4 °C recorded on evening round", kind: "record" },
          { id: "t2", date: "13 Aug", title: "Pattern highlight raised", detail: "Infection-risk marker combination flagged for review", kind: "observation" },
          { id: "t3", date: "12 Aug", title: "Blood culture ordered", detail: "Two sets, aerobic + anaerobic", kind: "order" },
        ],
        highlights: [
          {
            id: "h1",
            title: "Infection-risk marker cluster",
            detail: "Rising temperature, WBC and heart rate co-occur within 48h. Surfaced for clinician double-check against sepsis screening protocol.",
            severity: "critical",
            confidence: 0.79,
            window: "11 – 13 Aug",
            sources: [
              { id: "r1", source: "Vitals chart", captured: "13 Aug 18:40", value: "38.4 °C", method: "Tympanic", confidence: 0.96 },
              { id: "r2", source: "Lab · FBC", captured: "13 Aug 14:05", value: "WBC 14.2", method: "Analyser HM-4", confidence: 0.98 },
            ],
          },
        ],
      },
    ],
    macro: {
      kpis: [
        { id: "k1", label: "Bed occupancy", value: "88%", delta: "+6 pts WoW", severity: "caution", hint: "412 of 468 beds" },
        { id: "k2", label: "Sepsis screen positives", value: "31", delta: "+9 vs. last week", severity: "critical", hint: "Across 7 wards" },
        { id: "k3", label: "CT turnaround (median)", value: "42 min", delta: "−7 min WoW", severity: "stable", hint: "Order → report" },
        { id: "k4", label: "Avg. length of stay", value: "4.8 d", delta: "+0.3 d", severity: "signal", hint: "Rolling 30 days" },
      ],
      trend: {
        title: "Sepsis screen positives vs. CT turnaround",
        caption: "Aggregate ward signal — no individual records exposed at this scale.",
        primaryLabel: "Sepsis positives",
        secondaryLabel: "CT turnaround (min)",
        points: mk([18, 21, 19, 24, 27, 31], [56, 54, 51, 48, 45, 42]),
      },
      breakdownTitle: "Ward breakdown",
      rows: [
        { id: "w1", name: "Ward 4B · Cardiology", primary: "94% occupancy", secondary: "9 sepsis screens", severity: "critical" },
        { id: "w2", name: "Ward 2A · General medicine", primary: "88% occupancy", secondary: "7 sepsis screens", severity: "caution" },
        { id: "w3", name: "Ward 6C · Surgical", primary: "81% occupancy", secondary: "4 sepsis screens", severity: "signal" },
        { id: "w4", name: "Ward 1D · Maternity", primary: "72% occupancy", secondary: "1 sepsis screen", severity: "stable" },
      ],
      highlights: [
        {
          id: "mh1",
          title: "Ward 4B sepsis screen rate above 6-week band",
          detail: "Screen positives in Ward 4B exceed the rolling upper band for 3 consecutive days. Escalated for departmental double-check.",
          severity: "critical",
          confidence: 0.82,
          window: "10 – 13 Aug",
          sources: [
            { id: "r1", source: "Screening registry (aggregate)", captured: "13 Aug 23:59", value: "9 positives / 74 screens", method: "Nightly rollup", confidence: 0.94 },
            { id: "r2", source: "Bed management system", captured: "13 Aug 23:59", value: "94% occupancy", method: "ADT feed", confidence: 0.99 },
          ],
        },
      ],
    },
    prompts: {
      micro: ["Show BP trend since July", "Compare HR to admission baseline", "List sources behind the risk highlight"],
      macro: ["Which ward has the highest sepsis rate?", "CT turnaround by shift", "Occupancy forecast for next 7 days"],
    },
  },
  {
    id: "engineering",
    label: "Engineering",
    tagline: "Fleet reliability & asset telemetry",
    entityNoun: "Asset",
    systemNoun: "Fleet",
    compliance: "SOC 2 / ISO 27001",
    isolationScope: "Tenant: Northwind Industrial · Record scope: Plant 2",
    entities: [
      {
        id: "TB-118",
        ref: "Turbine TB-118",
        name: "Plant 2 · Line A",
        meta: ["Commissioned 2019", "Duty cycle 91%", "Last service 22 Jun"],
        series: [
          {
            id: "vib",
            label: "Bearing vibration",
            unit: "mm/s",
            latest: "6.8",
            delta: "+2.4 over 6 mo",
            severity: "critical",
            reference: "Alarm threshold 7.1 mm/s",
            points: mk([4.4, 4.6, 5.1, 5.8, 6.2, 6.8]),
          },
          {
            id: "temp",
            label: "Gearbox temp",
            unit: "°C",
            latest: "78",
            delta: "+6 over 6 mo",
            severity: "caution",
            reference: "Nominal < 75 °C",
            points: mk([69, 70, 72, 74, 76, 78]),
          },
          {
            id: "out",
            label: "Output efficiency",
            unit: "%",
            latest: "92.4",
            delta: "−1.8 pts",
            severity: "signal",
            reference: "Design point 94.2%",
            points: mk([94.2, 94.0, 93.6, 93.1, 92.8, 92.4]),
          },
        ],
        timeline: [
          { id: "t1", date: "13 Aug", title: "Telemetry ingest", detail: "Vibration 6.8 mm/s at 1500 rpm", kind: "record" },
          { id: "t2", date: "12 Aug", title: "Pattern highlight raised", detail: "Degradation curve matches bearing wear signature", kind: "observation" },
          { id: "t3", date: "22 Jun", title: "Scheduled service", detail: "Lubrication + alignment check", kind: "order" },
        ],
        highlights: [
          {
            id: "h1",
            title: "Bearing wear signature over 6 months",
            detail: "Vibration and gearbox temperature rise together at a rate consistent with progressive bearing wear. Flagged for engineer verification.",
            severity: "critical",
            confidence: 0.88,
            window: "Mar – Aug 2026",
            sources: [
              { id: "r1", source: "Sensor VIB-118-A", captured: "13 Aug 04:00", value: "6.8 mm/s", method: "Accelerometer, 1 min avg", confidence: 0.99 },
              { id: "r2", source: "Sensor TMP-118-G", captured: "13 Aug 04:00", value: "78 °C", method: "RTD probe", confidence: 0.98 },
            ],
          },
        ],
      },
    ],
    macro: {
      kpis: [
        { id: "k1", label: "Fleet availability", value: "96.2%", delta: "−0.8 pts", severity: "caution", hint: "142 assets" },
        { id: "k2", label: "Assets above alarm band", value: "7", delta: "+3 WoW", severity: "critical", hint: "Vibration + thermal" },
        { id: "k3", label: "Mean time to repair", value: "5.4 h", delta: "−0.6 h", severity: "stable", hint: "Rolling 30 days" },
        { id: "k4", label: "Unplanned stops", value: "12", delta: "+2", severity: "signal", hint: "This month" },
      ],
      trend: {
        title: "Alarm-band assets vs. availability",
        caption: "Fleet-level rollup across all plants in tenant scope.",
        primaryLabel: "Assets in alarm",
        secondaryLabel: "Availability (%)",
        points: mk([2, 3, 3, 5, 6, 7], [98.1, 97.8, 97.4, 97.0, 96.6, 96.2]),
      },
      breakdownTitle: "Plant breakdown",
      rows: [
        { id: "p1", name: "Plant 2 · Line A", primary: "4 assets in alarm", secondary: "94.1% availability", severity: "critical" },
        { id: "p2", name: "Plant 1 · Line C", primary: "2 assets in alarm", secondary: "96.8% availability", severity: "caution" },
        { id: "p3", name: "Plant 3 · Packaging", primary: "1 asset in alarm", secondary: "97.9% availability", severity: "signal" },
        { id: "p4", name: "Plant 4 · Utilities", primary: "0 assets in alarm", secondary: "99.1% availability", severity: "stable" },
      ],
      highlights: [
        {
          id: "mh1",
          title: "Alarm-band growth concentrated in Plant 2",
          detail: "Four of seven alarm-band assets sit on one line, suggesting a shared upstream cause. Surfaced for reliability review.",
          severity: "caution",
          confidence: 0.74,
          window: "Jul – Aug 2026",
          sources: [
            { id: "r1", source: "Fleet telemetry rollup", captured: "13 Aug 06:00", value: "4 / 7 assets", method: "Hourly aggregation", confidence: 0.93 },
          ],
        },
      ],
    },
    prompts: {
      micro: ["Show vibration trend since June", "Compare to sister asset TB-119", "What sources drive this highlight?"],
      macro: ["Which plant has the most alarm-band assets?", "MTTR by crew", "Availability trend this quarter"],
    },
  },
  {
    id: "government",
    label: "Government",
    tagline: "Casework & public service delivery",
    entityNoun: "Case",
    systemNoun: "Agency",
    compliance: "FedRAMP / PII",
    isolationScope: "Tenant: County Services · Record scope: District 7",
    entities: [
      {
        id: "C-88421",
        ref: "Case #C-88421",
        name: "Housing assistance review",
        meta: ["Opened 12 May", "District 7", "Caseworker: R. Njeri"],
        series: [
          {
            id: "days",
            label: "Days open",
            unit: "days",
            latest: "93",
            delta: "+31 vs. target",
            severity: "critical",
            reference: "Service target 62 days",
            points: mk([12, 30, 45, 61, 78, 93]),
          },
          {
            id: "touch",
            label: "Handoffs",
            unit: "count",
            latest: "6",
            delta: "+3 vs. median",
            severity: "caution",
            reference: "Median 3 handoffs",
            points: mk([1, 2, 3, 4, 5, 6]),
          },
          {
            id: "docs",
            label: "Documents verified",
            unit: "%",
            latest: "80",
            delta: "+20 pts",
            severity: "stable",
            reference: "Complete at 100%",
            points: mk([20, 40, 40, 60, 60, 80]),
          },
        ],
        timeline: [
          { id: "t1", date: "11 Aug", title: "Document verified", detail: "Proof of residency accepted", kind: "record" },
          { id: "t2", date: "07 Aug", title: "Pattern highlight raised", detail: "Case exceeds service-level target with repeated handoffs", kind: "observation" },
          { id: "t3", date: "12 May", title: "Case opened", detail: "Intake via district office", kind: "order" },
        ],
        highlights: [
          {
            id: "h1",
            title: "Service-level breach with handoff churn",
            detail: "Case is 31 days past target and has changed owner six times. Surfaced for supervisor double-check — no eligibility determination implied.",
            severity: "critical",
            confidence: 0.81,
            window: "May – Aug 2026",
            sources: [
              { id: "r1", source: "Case management system", captured: "13 Aug 09:12", value: "93 days open", method: "System field", confidence: 0.99 },
              { id: "r2", source: "Assignment audit log", captured: "02 Aug 15:40", value: "6 owner changes", method: "Event log", confidence: 0.97 },
            ],
          },
        ],
      },
    ],
    macro: {
      kpis: [
        { id: "k1", label: "Open caseload", value: "3,214", delta: "+128 MoM", severity: "caution", hint: "All districts" },
        { id: "k2", label: "Past service target", value: "412", delta: "+64 MoM", severity: "critical", hint: "12.8% of caseload" },
        { id: "k3", label: "Median resolution", value: "58 d", delta: "−3 d", severity: "stable", hint: "Rolling 90 days" },
        { id: "k4", label: "Appeals filed", value: "77", delta: "+5", severity: "signal", hint: "This quarter" },
      ],
      trend: {
        title: "Cases past target vs. median resolution",
        caption: "District rollup — individual case records stay isolated per district scope.",
        primaryLabel: "Past target",
        secondaryLabel: "Median days",
        points: mk([288, 305, 331, 358, 389, 412], [66, 64, 63, 61, 59, 58]),
      },
      breakdownTitle: "District breakdown",
      rows: [
        { id: "d1", name: "District 7", primary: "148 past target", secondary: "71 d median", severity: "critical" },
        { id: "d2", name: "District 3", primary: "96 past target", secondary: "62 d median", severity: "caution" },
        { id: "d3", name: "District 5", primary: "88 past target", secondary: "57 d median", severity: "signal" },
        { id: "d4", name: "District 1", primary: "40 past target", secondary: "49 d median", severity: "stable" },
      ],
      highlights: [
        {
          id: "mh1",
          title: "District 7 backlog outpacing intake growth",
          detail: "Past-target cases grew 43% while intake grew 9%, indicating a throughput constraint. Flagged for operations review.",
          severity: "caution",
          confidence: 0.77,
          window: "Q2 – Q3 2026",
          sources: [
            { id: "r1", source: "Case rollup warehouse", captured: "13 Aug 02:00", value: "148 past target", method: "Nightly ETL", confidence: 0.95 },
          ],
        },
      ],
    },
    prompts: {
      micro: ["Show days-open trend since May", "Who handled this case and when?", "Show sources behind this highlight"],
      macro: ["Which district has the largest backlog?", "Resolution time by service type", "Appeals trend this quarter"],
    },
  },
];

export const severityLabel: Record<Severity, string> = {
  stable: "Within range",
  caution: "Double-check",
  critical: "Priority review",
  signal: "Observation",
};
