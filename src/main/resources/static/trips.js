// Trip management functionality
class TripManager {
    constructor() {
        console.log('TripManager initialized');
        this.bindEvents();
        this.selectedTripId = null;
        this.initializePaymentModal();
    }

    initializePaymentModal() {
        console.log('Initializing payment modal');
        const paymentModalHtml = `
            <div id="paymentModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
                <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div class="mt-3">
                        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Payment Details</h3>
                        <form id="paymentForm" class="space-y-4">
                            <div>
                                <label for="paymentAmount" class="block text-sm font-medium text-gray-700">Amount</label>
                                <input type="number" step="0.01" id="paymentAmount" name="paymentAmount" required
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            </div>
                            <div>
                                <label for="paymentMethod" class="block text-sm font-medium text-gray-700">Payment Method</label>
                                <select id="paymentMethod" name="paymentMethod" required
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    <option value="CASH">Cash</option>
                                    <option value="CREDIT_CARD">Credit Card</option>
                                    <option value="DEBIT_CARD">Debit Card</option>
                                    <option value="DIGITAL_WALLET">Digital Wallet</option>
                                </select>
                            </div>
                            <div class="flex justify-end space-x-3 mt-5">
                                <button type="button" id="cancelPaymentBtn"
                                    class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                                    Cancel
                                </button>
                                <button type="submit"
                                    class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                    Save Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if it exists
        const existingModal = document.getElementById('paymentModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add the modal to the document
        document.body.insertAdjacentHTML('beforeend', paymentModalHtml);
        
        // Bind event listeners
        const cancelBtn = document.getElementById('cancelPaymentBtn');
        const paymentForm = document.getElementById('paymentForm');
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                console.log('Cancel payment clicked');
                this.hidePaymentModal();
            });
        }
        
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                console.log('Payment form submitted');
                this.handlePaymentSubmit(e);
            });
        }
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
            console.log('Loaded trips:', trips); // Debug log
            if (!Array.isArray(trips) || trips.length === 0) {
                console.warn('No trips loaded or trips is not an array:', trips);
            }
            this.renderTripsTable(trips);
        } catch (error) {
            console.error('Error loading trips:', error);
        }
    }

    renderTripsTable(trips) {
        if (!Array.isArray(trips)) {
            console.error('Expected trips to be an array, got:', typeof trips);
            return;
        }

        console.log('Rendering trips table with', trips.length, 'trips'); // Debug log
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
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${trips.map(trip => {
                        console.log('Rendering trip:', trip); // Debug log for each trip
                        return `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">${trip.tripId}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${trip.driver ? trip.driver.name : 'N/A'}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${trip.vehicle ? `${trip.vehicle.model} - ${trip.vehicle.plateNumber}` : 'N/A'}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${trip.customer ? trip.customer.name : 'N/A'}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${trip.status}</td>
                            <td class="px-6 py-4 whitespace-nowrap">${new Date(trip.startTime).toLocaleString()}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="payment-status" data-trip-id="${trip.tripId}">Loading...</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <button onclick="tripManager.editTrip(${trip.tripId})" class="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                                <button onclick="tripManager.deleteTrip(${trip.tripId})" class="text-red-600 hover:text-red-900 mr-2">Delete</button>
                                <button onclick="tripManager.showPaymentModal(${trip.tripId})" class="text-green-600 hover:text-green-900">Payment</button>
                            </td>
                        </tr>
                    `}).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('tripsTable').innerHTML = table;

        // After rendering, check payment status for each trip
        trips.forEach(trip => {
            this.checkPaymentStatus(trip.tripId);
        });
    }

    async checkPaymentStatus(tripId) {
        try {
            const response = await fetch(`/api/payments/trip/${tripId}`);
            const statusElement = document.querySelector(`.payment-status[data-trip-id="${tripId}"]`);
            if (!statusElement) return;

            if (response.ok) {
                const payment = await response.json();
                statusElement.textContent = `Paid (${payment.paymentMethod})`;
                statusElement.classList.add('text-green-600');
            } else {
                statusElement.textContent = 'Not Paid';
                statusElement.classList.add('text-red-600');
            }
        } catch (error) {
            console.error(`Error checking payment status for trip ${tripId}:`, error);
            const statusElement = document.querySelector(`.payment-status[data-trip-id="${tripId}"]`);
            if (statusElement) {
                statusElement.textContent = 'Error';
                statusElement.classList.add('text-red-600');
            }
        }
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

    showPaymentModal(tripId) {
        console.log('Showing payment modal for trip:', tripId);
        this.selectedTripId = tripId;
        const modal = document.getElementById('paymentModal');
        
        if (!modal) {
            console.error('Payment modal not found');
            this.initializePaymentModal();
            return;
        }

        const form = document.getElementById('paymentForm');
        if (form) {
            form.reset();
            // Store the payment ID if we're updating an existing payment
            form.dataset.paymentId = '';
        }

        // Highlight the selected trip
        const rows = document.querySelectorAll('#tripsTable tbody tr');
        rows.forEach(row => {
            if (row.cells[0].textContent === tripId.toString()) {
                row.classList.add('bg-yellow-100');
            } else {
                row.classList.remove('bg-yellow-100');
            }
        });

        try {
            // Check if payment exists for this trip
            fetch(`/api/payments/trip/${tripId}`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Payment not found');
                })
                .then(payment => {
                    document.getElementById('paymentAmount').value = payment.amount;
                    document.getElementById('paymentMethod').value = payment.paymentMethod;
                    // Store the existing payment ID for updating
                    form.dataset.paymentId = payment.paymentId;
                })
                .catch(error => {
                    console.log('No existing payment found:', error);
                    form.dataset.paymentId = '';
                });
        } catch (error) {
            console.error('Error loading payment:', error);
        }

        modal.classList.remove('hidden');
    }

    hidePaymentModal() {
        console.log('Hiding payment modal');
        const modal = document.getElementById('paymentModal');
        if (modal) {
            modal.classList.add('hidden');
        }
        // Remove highlight from selected trip
        const rows = document.querySelectorAll('#tripsTable tbody tr');
        rows.forEach(row => row.classList.remove('bg-yellow-100'));
        this.selectedTripId = null;
    }

    async handlePaymentSubmit(event) {
        event.preventDefault();
        const form = event.target;
        
        // Only include the necessary fields for payment
        const paymentData = {
            paymentId: form.dataset.paymentId || Math.floor(Math.random() * 10000),
            tripId: this.selectedTripId,
            amount: parseFloat(form.paymentAmount.value),
            paymentMethod: form.paymentMethod.value,
            paymentDate: new Date().toISOString()
        };

        console.log('Submitting payment data:', paymentData);

        try {
            // If we have an existing payment ID, use PUT to update, otherwise POST to create
            const method = form.dataset.paymentId ? 'PUT' : 'POST';
            const url = form.dataset.paymentId 
                ? `/api/payments/${paymentData.paymentId}/${paymentData.tripId}`
                : '/api/payments';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            });

            if (response.ok) {
                this.hidePaymentModal();
                // Show success message
                alert('Payment saved successfully!');
                // Refresh the trips table to show updated payment status
                this.loadTrips();
            } else {
                const errorText = await response.text();
                console.error('Error saving payment:', errorText);
                alert('Failed to save payment. Please try again.');
            }
        } catch (error) {
            console.error('Error saving payment:', error);
            alert('Failed to save payment. Please try again.');
        }
    }
}

// Initialize the trip manager
const tripManager = new TripManager(); 