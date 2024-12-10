class VehicleManager {
    constructor() {
        this.vehiclesTable = document.getElementById('vehiclesTable');
        this.maintenanceRecordsTable = document.getElementById('maintenanceRecordsTable');
        this.addVehicleBtn = document.getElementById('addVehicleBtn');
        this.vehicleModal = document.getElementById('vehicleModal');
        this.maintenanceModal = document.getElementById('maintenanceModal');
        this.vehicleForm = document.getElementById('vehicleForm');
        this.maintenanceForm = document.getElementById('maintenanceForm');
        this.currentVehicleId = null;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        if (this.addVehicleBtn) {
            this.addVehicleBtn.addEventListener('click', () => this.showVehicleModal('add'));
        }
        if (this.vehicleForm) {
            this.vehicleForm.addEventListener('submit', (e) => this.handleVehicleSubmit(e));
        }
        if (this.maintenanceForm) {
            this.maintenanceForm.addEventListener('submit', (e) => this.handleMaintenanceSubmit(e));
        }
    }

    async loadVehicles() {
        try {
            const response = await fetch('/api/vehicles');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const vehicles = await response.json();
            console.log('Loaded vehicles:', vehicles);
            this.renderVehiclesTable(vehicles);
        } catch (error) {
            console.error('Error loading vehicles:', error);
            this.renderVehiclesTable([]);
        }
    }

    renderVehiclesTable(vehicles) {
        if (!Array.isArray(vehicles)) {
            console.error('Vehicles data is not an array:', vehicles);
            vehicles = [];
        }

        const table = `
            <table class="min-w-full">
                <thead>
                    <tr>
                        <th class="px-6 py-3 border-b text-center">Plate Number</th>
                        <th class="px-6 py-3 border-b text-center">Model</th>
                        <th class="px-6 py-3 border-b text-center">Year</th>
                        <th class="px-6 py-3 border-b text-center">Status</th>
                        <th class="px-6 py-3 border-b text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${vehicles.length === 0 ? `
                        <tr>
                            <td colspan="5" class="px-6 py-4 border-b text-center">
                                No vehicles found. Click "Add New Vehicle" to create one.
                            </td>
                        </tr>
                    ` : vehicles.map(vehicle => `
                        <tr>
                            <td class="px-6 py-4 border-b text-center">${vehicle.plateNumber}</td>
                            <td class="px-6 py-4 border-b text-center">${vehicle.model}</td>
                            <td class="px-6 py-4 border-b text-center">${vehicle.year}</td>
                            <td class="px-6 py-4 border-b text-center">${vehicle.status}</td>
                            <td class="px-6 py-4 border-b text-center">
                                <button onclick="vehicleManager.showVehicleModal('edit', ${JSON.stringify(vehicle).replace(/"/g, '&quot;')})" 
                                        class="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                                <button onclick="vehicleManager.deleteVehicle(${vehicle.vehicleId})" 
                                        class="text-red-600 hover:text-red-800 mr-2">Delete</button>
                                <button onclick="vehicleManager.loadMaintenanceRecords(${vehicle.vehicleId})" 
                                        class="text-green-600 hover:text-green-800">Maintenance</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <p class="text-sm text-gray-600 mt-2 italic">* To view maintenance records, click the "Maintenance" button for the desired vehicle.</p>
        `;
        
        if (this.vehiclesTable) {
            this.vehiclesTable.innerHTML = table;
        } else {
            console.error('Vehicles table element not found');
        }
    }

    async loadMaintenanceRecords(vehicleId) {
        this.currentVehicleId = vehicleId;
        try {
            const response = await fetch(`/api/maintenance-records/vehicle/${vehicleId}`);
            if (!response.ok) {
                throw new Error('Failed to load maintenance records');
            }
            const records = await response.json();
            const recordsArray = Array.isArray(records) ? records : [records].filter(r => r != null);
            this.renderMaintenanceRecordsTable(recordsArray, vehicleId);
        } catch (error) {
            console.error('Error loading maintenance records:', error);
            this.renderMaintenanceRecordsTable([], vehicleId);
        }
    }

    renderMaintenanceRecordsTable(records, vehicleId) {
        const table = `
            <div class="flex justify-between items-center mb-4">
                <h4 class="text-lg font-semibold">Maintenance History</h4>
                <button onclick="vehicleManager.showMaintenanceModal('add', ${vehicleId})" 
                        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Add Maintenance Record
                </button>
            </div>
            <table class="min-w-full">
                <thead>
                    <tr>
                        <th class="px-6 py-3 border-b text-center">Service Date</th>
                        <th class="px-6 py-3 border-b text-center">Description</th>
                        <th class="px-6 py-3 border-b text-center">Cost</th>
                        <th class="px-6 py-3 border-b text-center">Next Service</th>
                        <th class="px-6 py-3 border-b text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${records.length === 0 ? `
                        <tr>
                            <td colspan="5" class="px-6 py-4 border-b text-center">
                                No maintenance records found
                            </td>
                        </tr>
                    ` : records.map(record => `
                        <tr>
                            <td class="px-6 py-4 border-b text-center">${record.serviceDate}</td>
                            <td class="px-6 py-4 border-b text-center">${record.description}</td>
                            <td class="px-6 py-4 border-b text-center">$${record.cost}</td>
                            <td class="px-6 py-4 border-b text-center">${record.nextServiceDate}</td>
                            <td class="px-6 py-4 border-b text-center">
                                <button onclick="vehicleManager.showMaintenanceModal('edit', ${vehicleId}, ${JSON.stringify(record).replace(/"/g, '&quot;')})" 
                                        class="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                                <button onclick="vehicleManager.deleteMaintenanceRecord(${record.recordId})" 
                                        class="text-red-600 hover:text-red-800">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        this.maintenanceRecordsTable.innerHTML = table;
        this.maintenanceRecordsTable.style.display = 'block';
    }

    showVehicleModal(mode, vehicle = null) {
        const modalTitle = document.getElementById('vehicleModalTitle');
        const form = this.vehicleForm;
        
        // Clear previous form
        form.innerHTML = '';
        
        modalTitle.textContent = mode === 'add' ? 'Add New Vehicle' : 'Edit Vehicle';
        
        // Create form fields
        const formContent = `
            <input type="hidden" name="vehicleId" value="${vehicle?.vehicleId || ''}">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Plate Number</label>
                <input type="text" name="plateNumber" value="${vehicle?.plateNumber || ''}"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Model</label>
                <input type="text" name="model" value="${vehicle?.model || ''}"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Year</label>
                <input type="number" name="year" value="${vehicle?.year || ''}"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Status</label>
                <select name="status" 
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required>
                    <option value="ACTIVE" ${vehicle?.status === 'ACTIVE' ? 'selected' : ''}>Active</option>
                    <option value="MAINTENANCE" ${vehicle?.status === 'MAINTENANCE' ? 'selected' : ''}>Maintenance</option>
                    <option value="RETIRED" ${vehicle?.status === 'RETIRED' ? 'selected' : ''}>Retired</option>
                </select>
            </div>
            <div class="flex items-center justify-between mt-6">
                <button type="submit" 
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    ${mode === 'add' ? 'Add Vehicle' : 'Update Vehicle'}
                </button>
                <button type="button" onclick="vehicleManager.closeVehicleModal()"
                    class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Cancel
                </button>
            </div>
        `;
        
        form.innerHTML = formContent;
        this.vehicleModal.classList.remove('hidden');
    }

    closeVehicleModal() {
        this.vehicleModal.classList.add('hidden');
    }

    async handleVehicleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const vehicleData = {
            plateNumber: formData.get('plateNumber'),
            model: formData.get('model'),
            year: parseInt(formData.get('year')),
            status: formData.get('status')
        };

        const vehicleId = formData.get('vehicleId');
        
        try {
            const url = vehicleId ? `/api/vehicles/${vehicleId}` : '/api/vehicles';
            const method = vehicleId ? 'PUT' : 'POST';
            
            if (vehicleId) {
                vehicleData.vehicleId = parseInt(vehicleId);
            }
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vehicleData)
            });

            if (!response.ok) {
                throw new Error('Failed to save vehicle');
            }

            this.closeVehicleModal();
            this.loadVehicles();
        } catch (error) {
            console.error('Error saving vehicle:', error);
            alert('Failed to save vehicle. Please try again.');
        }
    }

    async deleteVehicle(vehicleId) {
        if (!confirm('Are you sure you want to delete this vehicle?')) {
            return;
        }
        
        try {
            const response = await fetch(`/api/vehicles/${vehicleId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete vehicle');
            }

            this.loadVehicles();
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            alert('Failed to delete vehicle. Please try again.');
        }
    }

    showMaintenanceModal(mode, vehicleId, record = null) {
        const modalTitle = document.getElementById('maintenanceModalTitle');
        const form = this.maintenanceForm;
        
        form.innerHTML = '';
        modalTitle.textContent = mode === 'add' ? 'Add Maintenance Record' : 'Edit Maintenance Record';
        
        const formContent = `
            <input type="hidden" name="recordId" value="${record?.recordId || ''}">
            <input type="hidden" name="vehicleId" value="${vehicleId}">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Service Date</label>
                <input type="date" name="serviceDate" value="${record?.serviceDate || ''}"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea name="description" 
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required>${record?.description || ''}</textarea>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Cost</label>
                <input type="number" step="0.01" name="cost" value="${record?.cost || ''}"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Next Service Date</label>
                <input type="date" name="nextServiceDate" value="${record?.nextServiceDate || ''}"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required>
            </div>
            <div class="flex items-center justify-between mt-6">
                <button type="submit" 
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    ${mode === 'add' ? 'Add Record' : 'Update Record'}
                </button>
                <button type="button" onclick="vehicleManager.closeMaintenanceModal()"
                    class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Cancel
                </button>
            </div>
        `;
        
        form.innerHTML = formContent;
        this.maintenanceModal.classList.remove('hidden');
    }

    closeMaintenanceModal() {
        this.maintenanceModal.classList.add('hidden');
    }

    async handleMaintenanceSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const maintenanceData = {
            serviceDate: formData.get('serviceDate'),
            description: formData.get('description'),
            cost: parseFloat(formData.get('cost')),
            nextServiceDate: formData.get('nextServiceDate'),
            vehicle: {
                vehicleId: parseInt(formData.get('vehicleId'))
            }
        };

        const recordId = formData.get('recordId');
        
        try {
            const url = recordId ? `/api/maintenance-records/${recordId}` : '/api/maintenance-records';
            const method = recordId ? 'PUT' : 'POST';
            
            if (recordId) {
                maintenanceData.recordId = parseInt(recordId);
            }
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(maintenanceData)
            });

            if (!response.ok) {
                throw new Error('Failed to save maintenance record');
            }

            this.closeMaintenanceModal();
            this.loadMaintenanceRecords(maintenanceData.vehicle.vehicleId);
        } catch (error) {
            console.error('Error saving maintenance record:', error);
            alert('Failed to save maintenance record. Please try again.');
        }
    }

    async deleteMaintenanceRecord(recordId) {
        if (!confirm('Are you sure you want to delete this maintenance record?')) {
            return;
        }
        
        try {
            const response = await fetch(`/api/maintenance-records/${recordId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete maintenance record');
            }

            if (this.currentVehicleId) {
                this.loadMaintenanceRecords(this.currentVehicleId);
            }
        } catch (error) {
            console.error('Error deleting maintenance record:', error);
            alert('Failed to delete maintenance record. Please try again.');
        }
    }
}

// Initialize the vehicle manager and make it globally available
window.vehicleManager = new VehicleManager(); 