import type {
  Sport,
  RaceData,
  AthleteData,
  StrategyPreferences,
  PacingStrategy,
  CarbStrategy,
  HydrationStrategy,
  RiskFlag,
  CaffeinePlan,
  CaffeineDose,
  PreCompNutrition,
  DayNutrition,
  DayMeal,
  GITrainingPlan,
  GITrainingSession,
  StrategyOutput,
} from '../types/race';

const CHO_INTENSITY_MAP: [number, number][] = [
  [0.60, 0.6],
  [0.70, 1.0],
  [0.75, 1.2],
  [0.80, 1.6],
  [0.85, 2.0],
];

function interpolateCHOUse(intensityFraction: number): number {
  const clamped = Math.min(0.85, Math.max(0.60, intensityFraction));
  for (let i = 0; i < CHO_INTENSITY_MAP.length - 1; i++) {
    const [x0, y0] = CHO_INTENSITY_MAP[i];
    const [x1, y1] = CHO_INTENSITY_MAP[i + 1];
    if (clamped >= x0 && clamped <= x1) {
      const t = (clamped - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }
  return 2.0;
}

function estimateIntensity(sport: Sport, athlete: AthleteData, race: RaceData): number {
  const isCycling = sport.startsWith('cycling');
  if (isCycling && athlete.thresholdPower > 0 && athlete.cp > 0) {
    return athlete.thresholdPower / athlete.cp;
  }
  if (!isCycling && athlete.vvo2maxPace > 0) {
    const racePaceMinKm = race.expectedDurationMin / race.distance;
    return racePaceMinKm / athlete.vvo2maxPace;
  }
  const durationH = race.expectedDurationMin / 60;
  if (durationH <= 1) return 0.85;
  if (durationH <= 2) return 0.80;
  if (durationH <= 3) return 0.75;
  if (durationH <= 5) return 0.70;
  return 0.65;
}

function intensityZoneLabel(intensity: number): string {
  if (intensity >= 0.85) return 'Zone 5 – VO2max';
  if (intensity >= 0.80) return 'Zone 4 – Threshold';
  if (intensity >= 0.75) return 'Zone 3 – Tempo';
  if (intensity >= 0.70) return 'Zone 2 – Aerobic';
  return 'Zone 1 – Recovery/Easy';
}

function calcPacing(
  sport: Sport,
  athlete: AthleteData,
  race: RaceData,
  prefs: StrategyPreferences
): PacingStrategy {
  let intensityFraction = estimateIntensity(sport, athlete, race);
  if (prefs.target === 'safe') intensityFraction = Math.max(0.60, intensityFraction - 0.05);
  if (prefs.target === 'performance') intensityFraction = Math.min(0.90, intensityFraction + 0.02);
  const paceMinKm = race.expectedDurationMin / race.distance;
  let recommendation = '';
  if (prefs.target === 'performance') {
    recommendation = 'Start at race pace from km 1. Negative split if conditions allow. Push hard on final 20%.';
  } else if (prefs.target === 'finish_strong') {
    recommendation = 'Start 3-5% slower than target pace. Build gradually. Finish with your best effort in the last 25%.';
  } else {
    recommendation = 'Conservative start. Stay in aerobic zone. Focus on fueling and hydration over speed.';
  }
  return {
    estimatedPaceMinKm: Math.round(paceMinKm * 100) / 100,
    intensityPercent: Math.round(intensityFraction * 100),
    intensityZone: intensityZoneLabel(intensityFraction),
    recommendation,
  };
}

function calcCarbs(
  athlete: AthleteData,
  race: RaceData,
  prefs: StrategyPreferences,
  intensityFraction: number
): CarbStrategy {
  const durationH = race.expectedDurationMin / 60;
  const estimatedUseGMin = interpolateCHOUse(intensityFraction);

  // Recommended intake is an absolute target by duration and gut training status,
  // NOT proportional to endogenous CHO use.
  // Based on Jeukendrup (2014), Burke et al. (2011), Jentjens & Jeukendrup (2005).
  let recommendedIntakeGH: number;
  if (durationH < 0.75) {
    recommendedIntakeGH = 0;
  } else if (durationH < 1.5) {
    recommendedIntakeGH = 30;
  } else if (durationH < 2) {
    recommendedIntakeGH = intensityFraction >= 0.75 ? 60 : 45;
  } else if (durationH < 3) {
    recommendedIntakeGH = 90;
  } else {
    // >3h: 90g/h baseline, up to 120g/h for gut-trained athletes using 2:1 glucose:fructose mix.
    // Jeukendrup (2017) "Training the Gut" – 110-120g/h requires multi-transporter CHO.
    if (prefs.gutTrained && athlete.highCarbExperience === 'experienced') {
      recommendedIntakeGH = 110;
    } else if (prefs.gutTrained) {
      recommendedIntakeGH = 100;
    } else {
      recommendedIntakeGH = 90;
    }
  }
  const totalCarbsG = Math.round(recommendedIntakeGH * durationH);
  const choType = prefs.choType;
  const sources: string[] = [];

  const requiresMixedCHO = recommendedIntakeGH >= 90;

  if (choType === 'liquid') {
    sources.push('Isotonic sports drink (6-8% carb) as primary fuel source');
    if (recommendedIntakeGH >= 60) sources.push('Carb-electrolyte drink: 500-750mL per hour');
    if (requiresMixedCHO) sources.push('REQUIRED: Use maltodextrin + fructose (2:1 ratio) drink – single-source glucose drinks are capped at ~60g/h (Jentjens & Jeukendrup 2005)');
  } else if (choType === 'solid') {
    sources.push('Banana halves or dates every 45-60 min');
    sources.push('Rice cakes, energy bars, or homemade energy balls');
    if (recommendedIntakeGH > 60) sources.push('Note: solid food absorption is slower – test extensively before race day');
    if (requiresMixedCHO) sources.push('REQUIRED: Supplement solids with a fructose-containing drink to reach target via multiple intestinal transporters');
  } else if (choType === 'gel') {
    if (requiresMixedCHO) {
      sources.push('Isotonic gels: 1 gel every 20-25 min');
      sources.push('REQUIRED: Use maltodextrin:fructose (2:1) gels exclusively – glucose-only gels cannot sustain ≥90g/h absorption (Hulston et al. 2009)');
    } else {
      sources.push('Energy gel every 30-40 min');
      sources.push('Isotonic gels preferred – no extra water needed');
    }
  } else {
    sources.push('Primary: energy gels every 25-30 min');
    sources.push('Secondary: sports drink between gel doses');
    if (requiresMixedCHO) sources.push('REQUIRED: Mix must contain fructose (gel + fructose drink or 2:1 gels) to unlock absorption above 60g/h');
    if (durationH > 3) sources.push('Solid backup: banana, dates, or energy chews for variety');
  }

  if (prefs.caffeineYes) {
    sources.push('Caffeinated gel (100mg) at 65% and 85% of race duration');
  }

  let timing = '';
  if (durationH < 1.5) {
    timing = 'Start fueling at 20 min. Take fuel every 30-40 min. Small amounts only.';
  } else if (durationH < 3) {
    timing = 'First fuel at 15-20 min, then every 25-30 min. Ramp up if pace increases.';
  } else {
    timing = 'Fuel every 20-25 min from the start. Never wait until you feel depleted. Match carb intake to effort zones.';
  }

  return {
    estimatedCarbUseGMin: Math.round(estimatedUseGMin * 100) / 100,
    recommendedIntakeGH: Math.round(recommendedIntakeGH),
    totalCarbsG,
    sources,
    timing,
  };
}

function calcHydration(athlete: AthleteData, race: RaceData): HydrationStrategy {
  const durationH = race.expectedDurationMin / 60;
  let sweatRateLH: number;
  if (athlete.hasSweatRate && athlete.sweatRateLh > 0) {
    sweatRateLH = athlete.sweatRateLh;
  } else {
    // Sweat rate prediction incorporating body weight, temperature, and humidity.
    // Adapted from Gonzalez et al. (2012) J Appl Physiol 112(8):1300-10.
    // Base rate scales with body mass (heavier athletes produce more sweat to cool).
    // Reference point: 70kg athlete at 20°C neutral humidity ≈ 0.9 L/h at moderate intensity.
    const bodyWeightFactor = athlete.bodyWeightKg / 70;
    const tempFactor = 1 + Math.max(0, (race.temperature - 15) * 0.03);
    const humidityFactor = race.humidity > 60 ? 1 + (race.humidity - 60) * 0.005 : 1.0;
    sweatRateLH = 0.9 * bodyWeightFactor * tempFactor * humidityFactor;
  }
  const sweatRateClamped = Math.min(2.5, Math.max(0.4, sweatRateLH));
  const fluidIntakeLH = Math.round(sweatRateClamped * 0.7 * 10) / 10;
  const totalFluidL = Math.round(fluidIntakeLH * durationH * 10) / 10;
  const sodiumMgH = Math.round(fluidIntakeLH * 600);
  const totalSodiumMg = Math.round(sodiumMgH * durationH);
  const totalSweatL = sweatRateClamped * durationH;
  const fluidDeficitL = totalSweatL - totalFluidL;
  const projectedMassLossPct = Math.round((fluidDeficitL / athlete.bodyWeightKg) * 100 * 10) / 10;
  return {
    sweatRateLH: Math.round(sweatRateClamped * 100) / 100,
    fluidIntakeLH,
    totalFluidL,
    sodiumMgH,
    totalSodiumMg,
    projectedMassLossPct,
  };
}

function calcCaffeine(
  athlete: AthleteData,
  race: RaceData,
  prefs: StrategyPreferences
): CaffeinePlan {
  const durationH = race.expectedDurationMin / 60;
  const mgPerKg = prefs.target === 'performance' ? 5 : prefs.target === 'finish_strong' ? 4 : 3;
  const rawTotal = athlete.bodyWeightKg * mgPerKg;
  const totalMg = Math.round(rawTotal / 25) * 25;
  const preDoseMg = durationH > 2
    ? Math.round(totalMg * 0.55 / 25) * 25
    : totalMg;

  const midRaceDoses: CaffeineDose[] = [];
  if (durationH > 1.5) {
    const remaining = totalMg - preDoseMg;
    const midTimingMin = Math.round(race.expectedDurationMin * 0.55);
    midRaceDoses.push({
      label: `At ~55% of race (${midTimingMin} min in)`,
      timingMin: midTimingMin,
      mg: remaining,
    });
  }
  if (durationH > 4) {
    const lateDose = Math.round(totalMg * 0.15 / 25) * 25;
    midRaceDoses.push({
      label: `At ~80% of race (${Math.round(race.expectedDurationMin * 0.8)} min in)`,
      timingMin: Math.round(race.expectedDurationMin * 0.8),
      mg: lateDose,
    });
  }

  const sources: string[] = [
    `Pre-race: ${preDoseMg}mg – 45-60 min before start (coffee, caffeine gel, or tablet)`,
  ];
  midRaceDoses.forEach((d) => {
    sources.push(`${d.label}: ${d.mg}mg – caffeinated gel or cola at aid station`);
  });

  const notes = durationH < 1.5
    ? 'Single pre-race dose is optimal for short events. Only use caffeine if trained in practice.'
    : 'Spread doses across race to maintain alertness and glycogen-sparing effect. Avoid caffeine in the last 90 min before your expected finish to prevent sleep disruption post-race.';

  return { totalMg, mgPerKg, preDoseMg, preDoseMinBeforeStart: 60, midRaceDoses, sources, notes };
}

function buildDayPlan(
  dayLabel: string,
  carbsGkg: number,
  weightKg: number,
  isLoadingDay: boolean,
  isRaceDay = false
): DayNutrition {
  const totalCarbsG = Math.round(carbsGkg * weightKg);
  const proteinG = Math.round(weightKg * (isLoadingDay ? 1.5 : 1.8));
  const totalKcal = Math.round(totalCarbsG * 4 + proteinG * 4 + weightKg * 0.8 * 9);
  const meals: DayMeal[] = [];

  if (isRaceDay) {
    meals.push({ timing: '3-4h before start', description: 'Oatmeal with banana and honey, or white rice bowl, or white toast with jam. Low fiber, moderate protein, minimal fat.', carbsG: Math.round(totalCarbsG * 0.6) });
    meals.push({ timing: '60-90min before start', description: 'Small carb top-up: energy gel, 200mL sports drink, banana, or white bread with honey.', carbsG: Math.round(totalCarbsG * 0.25) });
    meals.push({ timing: '15-20min before gun', description: 'Optional: single gel or 100-150mL carb drink to top up glycogen stores.', carbsG: Math.round(totalCarbsG * 0.15) });
  } else if (isLoadingDay) {
    const perMeal = Math.round(totalCarbsG / 5);
    meals.push({ timing: 'Breakfast', description: 'Oatmeal, banana, white rice porridge, fruit juice, low-fiber bread with jam.', carbsG: perMeal });
    meals.push({ timing: 'Mid-morning snack', description: 'Energy bars, rice crackers, fruit smoothie, dates, white rice cakes.', carbsG: perMeal });
    meals.push({ timing: 'Lunch', description: 'Large white rice or pasta bowl with chicken or fish. No raw vegetables or salad.', carbsG: perMeal });
    meals.push({ timing: 'Afternoon snack', description: 'Sports drink, banana, rice cakes, or fruit juice.', carbsG: perMeal });
    meals.push({ timing: 'Dinner', description: 'Pasta or white rice with lean protein and low-fiber sauce. Avoid high-fat, high-fiber foods and legumes.', carbsG: perMeal });
  } else {
    const perMeal = Math.round(totalCarbsG / 4);
    meals.push({ timing: 'Breakfast', description: 'Oats or muesli, fruit, yogurt, whole grain bread.', carbsG: perMeal });
    meals.push({ timing: 'Lunch', description: 'Balanced meal: carbs, lean protein, and vegetables.', carbsG: perMeal });
    meals.push({ timing: 'Snack', description: 'Fruit, energy bar, or light carb snack.', carbsG: perMeal });
    meals.push({ timing: 'Dinner', description: 'Pasta, rice, or potato with lean protein and vegetables.', carbsG: perMeal });
  }

  const notes = isLoadingDay
    ? 'Avoid high-fiber foods, cruciferous vegetables, legumes, and excess fat. Choose easily digestible carbs. Drink 500mL extra water per day.'
    : 'Maintain normal eating patterns. Reduce training load as per taper. Prioritize sleep and stress management.';

  return { dayLabel, carbsGkg, totalCarbsG, proteinG, totalKcal, meals, notes };
}

function calcPreComp(
  athlete: AthleteData,
  race: RaceData,
  prefs: StrategyPreferences
): PreCompNutrition {
  const durationH = race.expectedDurationMin / 60;
  const loadingNeeded = durationH >= 1.5;
  const tapering = prefs.trainingVolume !== 'low';
  const days = prefs.preCompDays;
  const plan: DayNutrition[] = [];
  const baseCarbsGkg = prefs.trainingVolume === 'high' ? 5 : prefs.trainingVolume === 'moderate' ? 4.5 : 4;

  if (days === 0) {
    // The athlete opted out of pre-race days; keep race-day guidance below.
  } else if (loadingNeeded) {
    if (days >= 3) {
      plan.push(buildDayPlan('D-3 (3 days out)', baseCarbsGkg, athlete.bodyWeightKg, false));
      plan.push(buildDayPlan('D-2 (2 days out)', baseCarbsGkg + 2.5, athlete.bodyWeightKg, true));
      plan.push(buildDayPlan('D-1 (day before)', baseCarbsGkg + 4, athlete.bodyWeightKg, true));
    } else if (days === 2) {
      plan.push(buildDayPlan('D-2 (2 days out)', baseCarbsGkg + 1.5, athlete.bodyWeightKg, false));
      plan.push(buildDayPlan('D-1 (day before)', baseCarbsGkg + 4, athlete.bodyWeightKg, true));
    } else {
      plan.push(buildDayPlan('D-1 (day before)', baseCarbsGkg + 4, athlete.bodyWeightKg, true));
    }
  } else {
    plan.push(buildDayPlan('D-1 (day before)', baseCarbsGkg, athlete.bodyWeightKg, false));
  }

  plan.push(buildDayPlan('Race Day', 2.5, athlete.bodyWeightKg, false, true));

  const raceDayCarbs = Math.round(2.5 * athlete.bodyWeightKg);
  const raceBreakfast = {
    timingBeforeStart: '2.5-3 hours before start',
    description: `White rice or oatmeal, banana, white toast with honey. Low fiber, moderate protein, minimal fat. Target ~${raceDayCarbs}g carbs. Nothing new – use foods tested in training.`,
    carbsG: raceDayCarbs,
  };

  const notes = days === 0
    ? 'No pre-race nutrition planning selected. Race-day nutrition guidance is still included.'
    : loadingNeeded
    ? `${days}-day CHO loading protocol. Prioritize carb density over volume. Reduce fiber, fat, and raw vegetables. Expect 0.5-1.5kg weight gain from glycogen and water storage – completely normal. Stay well hydrated.`
    : 'Short race: CHO loading is not necessary. Focus on a quality pre-race meal and being well hydrated.';

  return { choLoadingDays: loadingNeeded ? days : 0, tapering, plan, raceBreakfast, notes };
}

function calcGITraining(
  carbs: CarbStrategy,
  prefs: StrategyPreferences
): GITrainingPlan | undefined {
  if (!prefs.giTrainingWanted) return undefined;
  const targetGH = carbs.recommendedIntakeGH;
  const weeks = targetGH >= 90 ? 6 : targetGH >= 75 ? 5 : 4;
  const progressionSteps = [40, 60, 75, 90, targetGH, targetGH];
  const sessions: GITrainingSession[] = [];

  for (let w = 1; w <= weeks; w++) {
    const intake = progressionSteps[w - 1] ?? targetGH;
    const fluidMlH = intake < 60 ? 500 : intake < 90 ? 600 : 700;
    const duration = w <= 2 ? '60 min' : w <= 4 ? '75-90 min' : '90-120 min';
    const sessionData: [string, string][] = [
      ['Easy aerobic run/ride at 65-70% HRmax', 'Introduce gut loading. Focus on tolerating liquid carbs. Sports drink or dilute gel solution.'],
      ['Steady effort at 70-75% HRmax', 'Increase to gel + drink combo. Note any GI discomfort. Switch products if needed.'],
      ['Tempo segments (3×15min) with fueling during effort', 'Practice fueling during higher intensities. Use your actual race-day products.'],
      ['Race-simulation effort at 75-85% HRmax', 'Full race-day fueling protocol. Test all products, timing, and quantities.'],
      ['Long session at target race pace', 'Final dress rehearsal. Use exact race-day products and timing. Log all observations.'],
      ['Race-simulation confidence session', 'Gut fully trained. Focus on smooth execution. Build race-day confidence.'],
    ];
    const [format, notes] = sessionData[w - 1] ?? sessionData[sessionData.length - 1];
    sessions.push({ week: w, intakeGH: intake, fluidMlH, duration, format, notes });
  }

  return {
    weeks,
    targetGH,
    sessions,
    notes: `Progressive ${weeks}-week protocol. Start 6-8 weeks before race day. Use your actual race nutrition products in every session. Keep a tolerance log. Reduce intake if GI symptoms last more than 20 min post-session.`,
  };
}

function calcRisks(
  carbs: CarbStrategy,
  hydration: HydrationStrategy,
  athlete: AthleteData,
  race: RaceData,
  prefs: StrategyPreferences
): RiskFlag[] {
  const risks: RiskFlag[] = [];
  if (hydration.projectedMassLossPct > 3) {
    risks.push({ level: 'critical', message: `Projected body mass loss of ${hydration.projectedMassLossPct}% – well above safe threshold. Increase fluid intake or plan more aid station stops.` });
  } else if (hydration.projectedMassLossPct > 2) {
    risks.push({ level: 'warning', message: `Projected body mass loss of ${hydration.projectedMassLossPct}% – above 2% threshold. Performance may be meaningfully impaired. Prioritize hydration.` });
  }
  if (carbs.recommendedIntakeGH >= 90 && !prefs.gutTrained) {
    risks.push({ level: 'warning', message: `High carbohydrate intake (${carbs.recommendedIntakeGH}g/h) recommended but gut training not confirmed. Build up in training before relying on this target on race day.` });
  }
  if (carbs.recommendedIntakeGH >= 90 && (prefs.choType === 'solid')) {
    risks.push({ level: 'critical', message: `Target intake of ${carbs.recommendedIntakeGH}g/h cannot be achieved with solid food alone. Intestinal glucose transporters saturate at ~60g/h. You must include a fructose source (drink or 2:1 gels) to reach this target (Jentjens & Jeukendrup 2005).` });
  }
  if (hydration.fluidIntakeLH > hydration.sweatRateLH * 1.1) {
    risks.push({ level: 'warning', message: `Fluid intake may exceed sweat rate. Risk of hyponatremia – drink to thirst, not to a schedule, and maintain sodium intake.` });
  }
  if (race.temperature > 30 && hydration.fluidIntakeLH < 0.8) {
    risks.push({ level: 'critical', message: `Extreme heat (${race.temperature}°C) with insufficient fluid plan. Heat illness risk is very high. Reduce pace target and significantly increase fluid intake.` });
  } else if (race.temperature > 28) {
    risks.push({ level: 'warning', message: `High temperature (${race.temperature}°C) – heat stress is likely. Pre-cool before start, monitor HR continuously, increase sodium intake.` });
  }
  if (race.altitude > 2000) {
    risks.push({ level: 'warning', message: `High altitude (${race.altitude}m) – VO2max may be reduced ~${Math.round((race.altitude - 1500) / 100)}%. Adjust pace expectations downward.` });
  }
  if (athlete.giIssuesHistory && carbs.recommendedIntakeGH > 60) {
    risks.push({ level: 'warning', message: `GI issues history noted. Test all products in training. Prefer liquid carb sources. Avoid solid foods after 50% of race.` });
  }
  if (race.humidity > 75 && race.temperature > 25) {
    risks.push({ level: 'warning', message: `High humidity (${race.humidity}%) + heat reduces evaporative cooling. True fluid needs may be higher than calculated.` });
  }
  return risks;
}

export function calculateRaceStrategy(
  sport: Sport,
  raceData: RaceData,
  athleteData: AthleteData,
  preferences: StrategyPreferences
): StrategyOutput {
  const intensityFraction = estimateIntensity(sport, athleteData, raceData);
  const adjustedIntensity =
    preferences.target === 'safe'
      ? Math.max(0.60, intensityFraction - 0.05)
      : preferences.target === 'performance'
      ? Math.min(0.90, intensityFraction + 0.02)
      : intensityFraction;

  const pacing = calcPacing(sport, athleteData, raceData, preferences);
  const carbs = calcCarbs(athleteData, raceData, preferences, adjustedIntensity);
  const hydration = calcHydration(athleteData, raceData);
  const caffeineFull = calcCaffeine(athleteData, raceData, preferences);
  const caffeine: CaffeinePlan = preferences.caffeineYes
    ? caffeineFull
    : { ...caffeineFull, totalMg: 0, sources: [], notes: 'Caffeine not included in this plan.' };
  const preComp = calcPreComp(athleteData, raceData, preferences);
  const giTraining = calcGITraining(carbs, preferences);
  const risks = calcRisks(carbs, hydration, athleteData, raceData, preferences);

  return { pacing, carbs, hydration, caffeine, preComp, giTraining, risks, generatedAt: new Date().toISOString() };
}
