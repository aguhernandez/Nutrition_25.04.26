import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  courseGradeAdjustment,
  estimateRaceTime,
  minettiCostRatio,
  type EstimatorCourse,
  type RaceReference,
} from './racePerformanceEstimator.ts';

const flatRef = (id: string, distanceKm: number, durationMin: number): RaceReference => ({
  id,
  label: id,
  date: '2025-01-01',
  distanceKm,
  durationMin,
  elevationGainM: 0,
});

const references: RaceReference[] = [
  flatRef('10k', 10, 45),
  flatRef('half', 21.0975, 100),
];

const flatMarathon: EstimatorCourse = {
  sport: 'running',
  distanceKm: 42.195,
  elevationGainM: 0,
};

function downhillProfile(gradePct: number, distanceKm: number) {
  const steps = 10;
  return Array.from({ length: steps + 1 }, (_, i) => {
    const km = (distanceKm * i) / steps;
    return { km, elevationM: 2000 + gradePct * km * 1000 };
  });
}

describe('minettiCostRatio', () => {
  it('is 1 on flat ground', () => {
    assert.equal(Math.round(minettiCostRatio(0) * 1e9) / 1e9, 1);
  });

  it('limits the domain to plus or minus 30 percent', () => {
    assert.equal(minettiCostRatio(0.6), minettiCostRatio(0.3));
    assert.equal(minettiCostRatio(-0.6), minettiCostRatio(-0.3));
  });

  it('costs more uphill and less on moderate descents', () => {
    assert.ok(minettiCostRatio(0.1) > 1);
    assert.ok(minettiCostRatio(-0.1) < 1);
  });
});

describe('estimateRaceTime', () => {
  it('reproduces a reference race exactly when the target equals it', () => {
    const result = estimateRaceTime({ ...flatMarathon, distanceKm: 10 }, references);
    assert.equal(result.finishTimeMin, 45);
    assert.equal(result.state, 'individualized');
  });

  it('predicts a flat marathon from two references with no limits', () => {
    const result = estimateRaceTime(flatMarathon, references);
    assert.equal(result.state, 'individualized');
    assert.ok(result.finishTimeMin! > 200 && result.finishTimeMin! < 240);
    assert.equal(result.snapshot.references.length, 2);
    assert.equal(result.snapshot.exponent! > 1 && result.snapshot.exponent! < 1.3, true);
  });

  it('is deterministic for identical inputs', () => {
    const first = estimateRaceTime(flatMarathon, references);
    const second = estimateRaceTime(flatMarathon, [...references].reverse());
    assert.deepEqual(first.snapshot, second.snapshot);
    assert.equal(first.finishTimeMin, second.finishTimeMin);
  });

  it('marks trail running as limited with a technical-profile warning', () => {
    const result = estimateRaceTime({ ...flatMarathon, sport: 'trail_running' }, references);
    assert.equal(result.state, 'limited');
    assert.ok(result.warnings.some((w) => w.includes('técnico')));
  });

  it('flags high altitude as limited', () => {
    const result = estimateRaceTime({ ...flatMarathon, maxAltitudeM: 3000 }, references);
    assert.equal(result.state, 'limited');
    assert.ok(result.warnings.some((w) => w.includes('Altitud')));
  });

  it('makes a steady descent faster than flat with a Minetti note', () => {
    const course: EstimatorCourse = {
      ...flatMarathon,
      distanceKm: 10,
      elevationGainM: 0,
      elevationPoints: downhillProfile(-0.05, 10),
    };
    const flat = estimateRaceTime({ ...flatMarathon, distanceKm: 10 }, references);
    const down = estimateRaceTime(course, references);
    assert.ok(down.finishTimeMin! < flat.finishTimeMin!);
    assert.ok(down.warnings.some((w) => w.includes('Minetti')));
    assert.equal(down.state, 'individualized');
  });

  it('limits a steep descent beyond 30 percent', () => {
    const course: EstimatorCourse = {
      ...flatMarathon,
      distanceKm: 10,
      elevationPoints: downhillProfile(-0.4, 10),
    };
    const result = estimateRaceTime(course, references);
    assert.equal(result.state, 'limited');
    assert.ok(result.warnings.some((w) => w.includes('±30%')));
  });

  it('requires a manual target with fewer than two references', () => {
    const result = estimateRaceTime(flatMarathon, [flatRef('10k', 10, 45)]);
    assert.equal(result.state, 'manual_required');
    assert.equal(result.finishTimeMin, null);
  });

  it('requires a manual target when references share a distance', () => {
    const result = estimateRaceTime(flatMarathon, [flatRef('a', 10, 45), flatRef('b', 10, 46)]);
    assert.equal(result.state, 'manual_required');
    assert.equal(result.finishTimeMin, null);
  });

  it('requires a manual target when the distance is missing', () => {
    const result = estimateRaceTime({ ...flatMarathon, distanceKm: 0 }, references);
    assert.equal(result.state, 'manual_required');
  });

  it('requires a manual target for non-running sports', () => {
    const result = estimateRaceTime({ ...flatMarathon, sport: 'cycling_road' }, references);
    assert.equal(result.state, 'manual_required');
  });

  it('ignores references without a positive duration or distance', () => {
    const result = estimateRaceTime(flatMarathon, [flatRef('10k', 10, 45), flatRef('bad', 21, 0), flatRef('none', 0, 90)]);
    assert.equal(result.state, 'manual_required');
  });
});

describe('courseGradeAdjustment', () => {
  it('returns a neutral factor without a profile', () => {
    const adjustment = courseGradeAdjustment(undefined);
    assert.equal(adjustment.factor, 1);
    assert.equal(adjustment.hasProfile, false);
  });
});
