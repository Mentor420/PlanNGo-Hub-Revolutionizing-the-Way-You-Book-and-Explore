import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { CabCardDetails } from '../model/cabcard-details';
import { Employee } from '../model/employee';

@Injectable({ providedIn: 'root' })
export class AdminCabService {
  private apiUrl = 'http://localhost:3000/7';
  private employeeApiUrl = 'http://localhost:3000/7';

  constructor(private http: HttpClient) {}


  createNewCab(cabData: CabCardDetails): Observable<CabCardDetails> {
    return from(fetch(this.apiUrl).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
      const updatedData = {...data, CabCardDetailsList: [...data.CabCardDetailsList, cabData]};
      return fetch(this.apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      }).then(res => {
        if(!res.ok)
        {
             throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return cabData;
      })
    }));
  }

  createEmployee(employeeData: Employee): Observable<Employee> {
    return from(fetch(this.employeeApiUrl).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        const updatedData = {...data, UserDetails: [...data.UserDetails, employeeData]};
        return fetch(this.employeeApiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        }).then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return employeeData;
        });
    }));
}


   getCabCount(){
    return this.http.get<CabCardDetails[]>(this.apiUrl)
  }

  getEmployeeCount(){
    return this.http.get<Employee[]>(this.apiUrl)
  }
  getEmployeeList(): Observable<any> {
  return this.http.get(this.apiUrl)
}
  
  updateEmployee(employeeId: string, employeeData: Employee): Promise<Employee> {
    return this.http.put<Employee>(`${this.employeeApiUrl}/${employeeId}`, employeeData).toPromise().then(employee => {
      if (!employee) {
        throw new Error('Employee not found');
      }
      return employee;
    });
  }
  
  deleteEmployee(employeeId: string): Promise<void> {
     return this.http.delete<void>(`${this.employeeApiUrl}/${employeeId}`).toPromise();
  }
}
