import { Cases } from './cases.model';
import { Deaths } from './deaths.model';
import { Tests } from './tests.model';

export class Statistics {
  continent: string;
  country: string;
  population: number;
  cases: Cases;
  deaths: Deaths;
  tests: Tests;
  day: string;
  time: string;
}
