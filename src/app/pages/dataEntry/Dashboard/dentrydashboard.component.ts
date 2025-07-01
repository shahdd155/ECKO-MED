import { Component, OnInit } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { DataEntryService, DashboardData } from '../../../core/services/DataEntry/DataEntry.service';

interface ChartData {
  name: string;
  series: { name: string; value: number }[];
}

@Component({
  selector: 'app-dentrydashboard',
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './dentrydashboard.component.html',
  styleUrls: ['./dentrydashboard.component.scss']
})
export class DentrydashboardComponent implements OnInit {
  userName = 'Loading...';
  totalPatients = 0;
  totalLabResults = 0;
  maleCount = 0;
  femaleCount = 0;
  
  // Change percentages
  totalPatientsPercent = '0%';
  malePatientsPercent = '0%';
  femalePatientsPercent = '0%';
  labTestsPercent = '0%';

  isLoading = true;
  timeframe: 'weekly' | 'monthly' = 'weekly';

  // Line chart data for Patient Overview
  patientOverviewData: ChartData[] = [];
  colorScheme = {
    name: 'customLineScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#374151', '#f59e42']
  };

  constructor(private dataEntryService: DataEntryService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    const dataObservable = this.timeframe === 'weekly' 
      ? this.dataEntryService.getWeeklyDashboard() 
      : this.dataEntryService.getMonthlyDashboard();

    dataObservable.subscribe({
      next: (data: DashboardData) => {
        const currentPeriod = this.timeframe === 'weekly' ? data.currentWeek : data.currentMonth;
        const changeFromLastPeriod = this.timeframe === 'weekly' ? data.changeFromLastWeek : data.changeFromLastMonth;
        
        this.userName = data.dataEntryName;
        this.totalPatients = currentPeriod.totalPatients;
        this.totalLabResults = currentPeriod.labTests;
        this.maleCount = currentPeriod.malePatients;
        this.femaleCount = currentPeriod.femalePatients;

        this.totalPatientsPercent = changeFromLastPeriod.totalPatientsPercent;
        this.malePatientsPercent = changeFromLastPeriod.malePatientsPercent;
        this.femalePatientsPercent = changeFromLastPeriod.femalePatientsPercent;
        this.labTestsPercent = changeFromLastPeriod.labTestsPercent;

        this.patientOverviewData = this.formatChartData(data.dailyBreakdown);
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    });
  }

  formatChartData(dailyBreakdown: any): ChartData[] {
    const currentPeriodData = this.timeframe === 'weekly' ? dailyBreakdown.currentWeek : dailyBreakdown.currentMonth;
    const lastPeriodData = this.timeframe === 'weekly' ? dailyBreakdown.lastWeek : dailyBreakdown.lastMonth;

    const currentSeries = {
      name: `This ${this.timeframe === 'weekly' ? 'Week' : 'Month'}`,
      series: Object.keys(currentPeriodData).map(day => ({
        name: day,
        value: currentPeriodData[day]
      }))
    };

    const lastSeries = {
      name: `Last ${this.timeframe === 'weekly' ? 'Week' : 'Month'}`,
      series: Object.keys(lastPeriodData).map(day => ({
        name: day,
        value: lastPeriodData[day]
      }))
    };
    
    return [currentSeries, lastSeries];
  }

  setTimeframe(timeframe: string): void {
    if (timeframe === 'weekly' || timeframe === 'monthly') {
      this.timeframe = timeframe;
      this.loadDashboardData();
    }
  }

  getPeakValue(): number {
    if (this.patientOverviewData.length === 0) return 0;
    const currentMonthData = this.patientOverviewData[0]?.series || [];
    return Math.max(0, ...currentMonthData.map(item => item.value));
  }
}
