import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as yaml from 'js-yaml';
import { HttpClient } from '@angular/common/http';
import { PortfolioData } from '../../models/portfolioData.enum';
import { CvData } from '../../models/cvData.enum';
import { VariousContentConfig } from '../../models/various_Data.enum';

@Injectable({
  providedIn: 'root',
})
export class HousesDataService {
  constructor(private http: HttpClient) {}


  private portfolioUrl = 'assets/texts/portfolio_data.yaml'; // URL to the YAML file
  private portfolioData: PortfolioData | undefined;
  private cvDataUrl: string = 'assets/texts/cv_data.yaml';
  private cvData: CvData | undefined;
  private variousDataUrl = 'assets/texts/various_data.yaml';
  private variousData: VariousContentConfig | undefined;

  public loadHousesData() {
    //preload config file for avoiding bug with asynchonus data with the preload() and create() working way of phaser.
    this.loadYamlData<PortfolioData>(this.portfolioUrl).subscribe((data) => {
      this.portfolioData = data;
    });
    this.loadYamlData<CvData>(this.cvDataUrl).subscribe((data) => {
      this.cvData = data;
    });
    this.loadYamlData<VariousContentConfig>(this.variousDataUrl).subscribe((data) => {
      this.variousData = data;
    });
  }

  private loadYamlData<T>(url: string): Observable<T> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      map((yamlText: string) => {
        return yaml.load(yamlText) as T;
      })
    );
  }

    getPortfolioData(): PortfolioData | undefined {
      return this.portfolioData;
    }
  
    getCvData(): CvData | undefined {
      return this.cvData;
    }
  
    getVariousData(): VariousContentConfig | undefined {
      return this.variousData;
    }
}
