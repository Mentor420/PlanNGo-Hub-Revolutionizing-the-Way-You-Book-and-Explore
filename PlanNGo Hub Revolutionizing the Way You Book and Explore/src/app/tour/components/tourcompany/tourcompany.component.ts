import {Component, OnInit} from '@angular/core';
import {TourService} from "../../services/tour.service";
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../../authentication/services/services/auth.service";
import {AddtoursComponent} from "../addtours/addtours.component";
@Component({
    selector: 'app-tourcompany',
    standalone: true,
    imports: [
        NgForOf,
        NgIf,
        ReactiveFormsModule,
        AddtoursComponent
    ],
    templateUrl: './tourcompany.component.html',
    styleUrl: './tourcompany.component.css'
})
export class TourcompanyComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private tourService: TourService,
        private authService: AuthService
    ) {
        this.tourCompanyForm = this.fb.group({
            nameOfCompany: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.required]],
            address: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            website: ['', [Validators.required]],
            registrationId: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]]
        });
    }
    tourCompanyForm: FormGroup;
    companies: any;
    crud = 0;
    finalRecord: any[] = [];
    finalCompanies: any[] = [];
    records: any[] = [];
    // Add these methods as needed
    addPreviousValue() {}
    editcrud() { this.crud = 2; }
    createcrud() { this.crud = 1; }
    viewcrud() { this.crud = 0; }
    tourData: any = {
        id: '',
        name: '',
        price: 0,
        duration: '1 day',
        description: '',
        description2: '',
        image: '',
        images: [],
        destination: '',
        departure: '',
        departureTime: '',
        returnTime: '',
        dressCode: '',
        center: {
            latitude: 0,
            longitude: 0
        },
        tourcompany: ''
    };
    openForm(){
        this.crud = 2
        console.log()
    }
    handleTourUpdate(formValue: any) {
        if (this.crud === 2) {
            this.tourData = formValue;
        } else {
            this.tourData.id = Math.random().toString(36).substr(2, 9);
            this.finalRecord.push(this.tourData);
        }
    }
    onSubmit() {
        if (this.tourCompanyForm.valid) {
            console.log('Form submitted:', this.tourCompanyForm.value);
            // Add your form submission logic here
            this.tourService.addTourCompany([...this.companies, this.tourCompanyForm.value]).subscribe(
                (response) => {
                    console.log('Tour company created successfully!', response);
                    this.tourCompanyForm.reset();
                },
                (error) => {
                    console.error('Error creating tour company:', error);
                }
            );
        }
    }

    onUpdate(){
        // Update Tours
        const tourdata=this.tourData
        this.tourService.updateTour(tourdata).subscribe(
            (response) => {
                this.companies = response;
                console.log(response);
            },
            (error) => {
                console.error('Error fetching tour companies:', error);
            }
        );
    }
    ngOnInit(): void {
        // Verify Service Provider
        this.authService.getUserDetails().subscribe(data => {
            const users = data.users || []; // Fix property access
            users.forEach((company: any) => {
                if (company.email === localStorage.getItem('email') && company.role === "Service Provider") {
                    this.finalCompanies.push(company);
                }
            });
            console.log(this.finalCompanies[0] || 'No service provider found'); // Add null check

            // Get Tours
            this.tourService.getTours().subscribe(
                (response) => {
                    console.log(response.a);
                    console.log(this.finalCompanies,'a');
                    // Add check for finalCompanies
                        response.a.forEach((fcompany: any) => {
                            this.finalCompanies.forEach(company => {
                                if (fcompany.serviceprovider == company.fullName) {
                                    this.records.push(fcompany);
                                }
                            });

                        });
                        console.log(this.finalCompanies,'a');
                },
                (error) => {
                    console.error('Error fetching tour companies:', error);
                }
            );
        });
    }
    protected readonly Validators = Validators;
}
