// Trip management functionality
class TripManager {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('tripsLink').addEventListener('click', () => this.showTripsSection());
        document.getElementById('addTripBtn').addEventListener('click', () => this.showTripModal());
        document.getElementById('cancelTripBtn').addEventListener('click', () => this.hideTripModal());
        document.getElementById('tripForm').addEventListener('submit', (e) => this.handleTripSubmit(e));
    }

    showTripsSection() {
        // Hide all other sections
        document.querySelectorAll('main > div').forEach(section => section.style.display = 'none');
        // Clear the trips table before showing the section
        const tripsTable = document.getElementById('tripsTable');
        if (tripsTable) {
            tripsTable.innerHTML = '';
        }
        document.getElementById('tripsSection').style.display = 'block';
        this.loadTrips();
    }

    async loadTrips() {
        try {
            const tripsTable = document.getElementById('tripsTable');
            if (!tripsTable || tripsTable.closest('div').style.display === 'none') {
                return; // Don't load if the section is not visible
            }
            const response = await fetch('/api/trips');
            const trips = await response.json();
            this.renderTripsTable(trips);
        } catch (error) {
            console.error('Error loading trips:', error);
        }
    }

    renderTripsTable(trips) {
        const table = `
            <table class="min-w-full">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${trips.map(trip => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">${trip.tripId}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${trip.driver.name}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${trip.vehicle.model} - ${trip.vehicle.plateNumber}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${trip.customer.name}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${trip.status}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${new Date(trip.startTime).toLocaleString()}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <button onclick="tripManager.editTrip(${trip.tripId})" class="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                                <button onclick="tripManager.deleteTrip(${trip.tripId})" class="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('tripsTable').innerHTML = table;
    }

    async loadFormData() {
        try {
            // Load drivers, vehicles, and customers for the form dropdowns
            const [drivers, vehicles, customers] = await Promise.all([
                fetch('/api/drivers').then(res => res.json()),
                fetch('/api/vehicles').then(res => res.json()),
                fetch('/api/customers').then(res => res.json())
            ]);

            console.log('Loaded data:', { drivers, vehicles, customers });

            const driverSelect = document.getElementById('driverId');
            const vehicleSelect = document.getElementById('vehicleId');
            const customerSelect = document.getElementById('customerId');

            // Add empty option as default
            driverSelect.innerHTML = '<option value="">Select a driver</option>' + 
                drivers.map(driver => 
                    `<option value="${driver.driverId}">${driver.name}</option>`
                ).join('');

            vehicleSelect.innerHTML = '<option value="">Select a vehicle</option>' + 
                vehicles.map(vehicle => 
                    `<option value="${vehicle.vehicleId}">${vehicle.model} - ${vehicle.plateNumber}</option>`
                ).join('');

            customerSelect.innerHTML = '<option value="">Select a customer</option>' + 
                customers.map(customer => 
                    `<option value="${customer.customerId}">${customer.name}</option>`
                ).join('');
        } catch (error) {
            console.error('Error loading form data:', error);
        }
    }

    showTripModal(trip = null) {
        const modal = document.getElementById('tripModal');
        const form = document.getElementById('tripForm');
        const title = document.getElementById('tripModalTitle');

        title.textContent = trip ? 'Edit Trip' : 'Add New Trip';
        form.reset();

        if (trip) {
            // Populate form with trip data
            form.dataset.tripId = trip.tripId;
            document.getElementById('driverId').value = trip.driver.driverId;
            document.getElementById('vehicleId').value = trip.vehicle.vehicleId;
            document.getElementById('customerId').value = trip.customer.customerId;
            document.getElementById('status').value = trip.status;
            document.getElementById('startTime').value = trip.startTime.slice(0, 16);
            if (trip.endTime) document.getElementById('endTime').value = trip.endTime.slice(0, 16);
            if (trip.distance) document.getElementById('distance').value = trip.distance;
        } else {
            delete form.dataset.tripId;
        }

        this.loadFormData();
        modal.classList.remove('hidden');
    }

    hideTripModal() {
        document.getElementById('tripModal').classList.add('hidden');
    }

    async handleTripSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const tripId = form.dataset.tripId;
        
        const tripData = {
            driver: { driverId: parseInt(form.driverId.value) },
            vehicle: { vehicleId: parseInt(form.vehicleId.value) },
            customer: { customerId: parseInt(form.customerId.value) },
            status: form.status.value,
            startTime: form.startTime.value,
            endTime: form.endTime.value || null,
            distance: form.distance.value ? parseFloat(form.distance.value) : null
        };

        try {
            const url = tripId ? `/api/trips/${tripId}` : '/api/trips';
            const method = tripId ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tripData)
            });

            if (response.ok) {
                this.hideTripModal();
                this.loadTrips();
            } else {
                console.error('Error saving trip:', await response.text());
            }
        } catch (error) {
            console.error('Error saving trip:', error);
        }
    }

    async editTrip(tripId) {
        try {
            const response = await fetch(`/api/trips/${tripId}`);
            const trip = await response.json();
            this.showTripModal(trip);
        } catch (error) {
            console.error('Error loading trip for edit:', error);
        }
    }

    async deleteTrip(tripId) {
        if (confirm('Are you sure you want to delete this trip?')) {
            try {
                const response = await fetch(`/api/trips/${tripId}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    this.loadTrips();
                } else {
                    console.error('Error deleting trip:', await response.text());
                }
            } catch (error) {
                console.error('Error deleting trip:', error);
            }
        }
    }
}

// Initialize the trip manager
const tripManager = new TripManager(); 