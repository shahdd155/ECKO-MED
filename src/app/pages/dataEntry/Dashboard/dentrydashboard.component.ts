import { Component, OnInit } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';

interface ChartSeries {
  name: string;
  value: number;
}

interface ChartData {
  name: string;
  series: ChartSeries[];
}

interface ExpenseData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-dentrydashboard',
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './dentrydashboard.component.html',
  styleUrl: './dentrydashboard.component.scss'
})
export class DentrydashboardComponent implements OnInit {
  userName = 'Loading...'; 
  totalPatients = 0;
  totalLabResults = 0;
  maleCount = 0;
  femaleCount = 0;
  isLoading = true;

  // Line chart data for Patient Overview
  patientOverviewData: ChartData[] = [];
  colorScheme = {
    name: 'customLineScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#374151', '#f59e42']
  };

  // Donut chart data for Expenses
  expensesData: ExpenseData[] = [];
  expensesColorScheme = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#f59e42', '#374151']
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.userName = data.userName;
        this.totalPatients = data.totalPatients;
        this.totalLabResults = data.totalLabResults;
        this.patientOverviewData = data.patientOverviewData;
        this.expensesData = data.expensesData;
        this.maleCount = data.genderStats?.male || 0;
        this.femaleCount = data.genderStats?.female || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    });
  }

  getPeakValue(): number {
    if (this.patientOverviewData.length === 0) return 0;
    const currentMonthData = this.patientOverviewData[0]?.series || [];
    return Math.max(...currentMonthData.map((item: ChartSeries) => item.value));
  }

  getMedicationValue(): number {
    const medicationItem = this.expensesData.find(item => item.name === 'Medications');
    return medicationItem?.value || 0;
  }

  getScansValue(): number {
    const scansItem = this.expensesData.find(item => item.name === 'Scans and tests');
    return scansItem?.value || 0;
  }
}
