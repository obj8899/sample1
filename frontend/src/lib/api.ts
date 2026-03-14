const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface PredictionInput {
  equipment_age: number
  compressor_runtime: number
  power_consumption: number
  cooling_efficiency: number
  ambient_temp: number
  maintenance_interval: number
  discharge_temp: number
}

export interface PredictionOutput {
  leak_probability: number
  risk_score: number
  risk_category: string
  risk_level: number
  maintenance_recommendation: string
  energy_inefficiency: number
  compressor_health: number
  feature_contributions: Record<string, number>
  analytics: {
    monthly_energy_loss_kwh: number
    estimated_co2_kg: number
    maintenance_cost_risk_usd: number
    system_lifespan_remaining_years: number
    cooling_performance_index: number
    pressure_variance_estimate: number
  }
}

export interface Building {
  id: string
  name: string
  lat: number
  lng: number
  equipment_age: number
  leak_probability: number
  risk_score: number
  risk_level: number
  cooling_efficiency: number
  compressor_runtime: number
  last_maintenance: number
  floors: number
}

export async function runPrediction(data: PredictionInput): Promise<PredictionOutput> {
  const response = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
  return response.json()
}

export async function getBuildings(): Promise<{ buildings: Building[]; total: number }> {
  const response = await fetch(`${API_BASE}/buildings`)
  if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
  return response.json()
}

// Mock prediction for demo when backend isn't running
export function mockPrediction(data: PredictionInput): PredictionOutput {
  const prob = Math.min(0.98, Math.max(0.02,
    0.25 * (data.equipment_age / 20) +
    0.20 * ((data.compressor_runtime - 40) / 60) +
    0.15 * ((100 - data.cooling_efficiency) / 70) +
    0.15 * ((data.discharge_temp - 40) / 80) +
    0.10 * (data.maintenance_interval / 24) +
    0.10 * ((data.ambient_temp - 15) / 30) +
    0.05 * ((data.power_consumption - 1.5) / 13.5)
  ))

  const risk_score = Math.round(prob * 1000) / 10
  let risk_category = 'LOW RISK'
  let risk_level = 0
  if (prob > 0.65) { risk_category = 'HIGH RISK'; risk_level = 2 }
  else if (prob > 0.35) { risk_category = 'MEDIUM RISK'; risk_level = 1 }

  const compressor_health = Math.max(0, Math.min(100, 100 - data.compressor_runtime * 0.4 - data.equipment_age * 2))
  const energy_inefficiency = Math.max(0, Math.min(100, (100 - data.cooling_efficiency) * 0.8 + prob * 20))

  return {
    leak_probability: Math.round(prob * 10000) / 10000,
    risk_score,
    risk_category,
    risk_level,
    maintenance_recommendation: risk_level === 2
      ? 'IMMEDIATE ACTION REQUIRED: Schedule emergency maintenance within 24-48 hours. Refrigerant leak detected with high confidence.'
      : risk_level === 1
      ? `URGENT: Schedule maintenance within 2 weeks. System shows elevated leak risk indicators.`
      : 'OPTIMAL: System operating at peak efficiency. Continue standard maintenance schedule.',
    energy_inefficiency: Math.round(energy_inefficiency * 10) / 10,
    compressor_health: Math.round(compressor_health * 10) / 10,
    feature_contributions: {
      'Equipment Age': Math.round(data.equipment_age / 20 * 25 * 10) / 10,
      'Compressor Runtime': Math.round((data.compressor_runtime - 40) / 60 * 20 * 10) / 10,
      'Cooling Efficiency': Math.round((100 - data.cooling_efficiency) / 70 * 15 * 10) / 10,
      'Discharge Temperature': Math.round((data.discharge_temp - 40) / 80 * 15 * 10) / 10,
      'Maintenance Interval': Math.round(data.maintenance_interval / 24 * 10 * 10) / 10,
      'Ambient Temperature': Math.round((data.ambient_temp - 15) / 30 * 10 * 10) / 10,
      'Power Consumption': Math.round((data.power_consumption - 1.5) / 13.5 * 5 * 10) / 10,
    },
    analytics: {
      monthly_energy_loss_kwh: Math.round(energy_inefficiency * 0.15 * 730 * 10) / 10,
      estimated_co2_kg: Math.round(energy_inefficiency * 0.15 * 730 * 0.4 * 10) / 10,
      maintenance_cost_risk_usd: Math.round(prob * 15000),
      system_lifespan_remaining_years: Math.round(Math.max(0, 20 - data.equipment_age) * (1 - prob * 0.5) * 10) / 10,
      cooling_performance_index: Math.round(data.cooling_efficiency * (1 - prob * 0.3) * 10) / 10,
      pressure_variance_estimate: Math.round((prob * 45 + 5) * 10) / 10,
    },
  }
}

// Mock buildings data
export function mockBuildings(): Building[] {
  const buildingTypes = ['Shopping Mall', 'Office Complex', 'Data Center', 'Hospital', 'Cold Storage', 'Hotel', 'Industrial Plant', 'Residential Tower']
  const baseLat = 19.076, baseLng = 72.877
  const buildings: Building[] = []

  for (let i = 0; i < 40; i++) {
    const age = 1 + Math.random() * 17
    const efficiency = 35 + Math.random() * 60
    const runtime = 45 + Math.random() * 53
    const discharge = 45 + Math.random() * 70
    let prob = 0.25 * (age / 18) + 0.20 * ((runtime - 45) / 53) + 0.15 * ((100 - efficiency) / 65) + 0.15 * ((discharge - 45) / 70) + (Math.random() - 0.5) * 0.2
    prob = Math.min(0.98, Math.max(0.02, prob))
    buildings.push({
      id: `BLD-${1000 + i}`,
      name: `${buildingTypes[i % buildingTypes.length]} ${String.fromCharCode(65 + i % 26)}`,
      lat: baseLat + (Math.random() - 0.5) * 0.16,
      lng: baseLng + (Math.random() - 0.5) * 0.16,
      equipment_age: Math.round(age * 10) / 10,
      leak_probability: Math.round(prob * 1000) / 1000,
      risk_score: Math.round(prob * 1000) / 10,
      risk_level: prob < 0.35 ? 0 : prob < 0.65 ? 1 : 2,
      cooling_efficiency: Math.round(efficiency * 10) / 10,
      compressor_runtime: Math.round(runtime * 10) / 10,
      last_maintenance: Math.floor(1 + Math.random() * 19),
      floors: Math.floor(3 + Math.random() * 42),
    })
  }
  return buildings
}
