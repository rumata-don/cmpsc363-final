class DriverManager {
    constructor() {
        this.bindEvents();
        this.currentDriver = null;
    }

    bindEvents() {
        document.getElementById('driversLink').addEventListener('click', () => this.loadDrivers());
        document.getElementById('addDriverBtn').addEventListener('click', () => this.showDriverModal());
        document.getElementById('driverForm').addEventListener('submit', (e) => this.handleDriverSubmit(e));
    }

    async loadDrivers() {
        try {
            const response = await fetch('/api/drivers');
            const drivers = await response.json();
            this.displayDrivers(drivers);
        } catch (error) {
            console.error('Error loading drivers:', error);
            alert('Failed to load drivers');
        }
    }

    displayDrivers(drivers) {
        const table = document.getElementById('driversTable');
        table.innerHTML = `
            <table class="min-w-full">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="px-4 py-2">Name</th>
                        <th class="px-4 py-2">License Number</th>
                        <th class="px-4 py-2">Phone</th>
                        <th class="px-4 py-2">Rating</th>
                        <th class="px-4 py-2">License Expiry</th>
                        <th class="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${drivers.map(driver => this.createDriverRow(driver)).join('')}
                </tbody>
            </table>
        `;
    }

    createDriverRow(driver) {
        return `
            <tr class="border-b">
                <td class="px-4 py-2">${driver.name}</td>
                <td class="px-4 py-2">${driver.licenseNumber}</td>
                <td class="px-4 py-2">${driver.phoneNumber}</td>
                <td class="px-4 py-2">${driver.rating || 'N/A'}</td>
                <td class="px-4 py-2">${driver.driverLicense ? driver.driverLicense.licenseExpiry : 'N/A'}</td>
                <td class="px-4 py-2">
                    <button onclick="driverManager.editDriver(${driver.driverId})" 
                            class="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                        Edit
                    </button>
                    <button onclick="driverManager.deleteDriver(${driver.driverId})"
                            class="bg-red-500 text-white px-2 py-1 rounded">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }

    showDriverModal(driver = null) {
        this.currentDriver = driver;
        const modal = document.getElementById('driverModal');
        const form = document.getElementById('driverForm');
        const title = document.getElementById('modalTitle');

        title.textContent = driver ? 'Edit Driver' : 'Add New Driver';
        
        form.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
                    <input type="text" name="name" required
                           class="w-full px-3 py-2 border rounded"
                           value="${driver ? driver.name : ''}">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">License Number</label>
                    <input type="text" name="licenseNumber" required
                           class="w-full px-3 py-2 border rounded"
                           value="${driver ? driver.licenseNumber : ''}">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                    <input type="tel" name="phoneNumber" required
                           class="w-full px-3 py-2 border rounded"
                           value="${driver ? driver.phoneNumber : ''}">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Rating</label>
                    <input type="number" name="rating" step="0.01" min="0" max="5"
                           class="w-full px-3 py-2 border rounded"
                           value="${driver && driver.rating ? driver.rating : ''}">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">License Expiry</label>
                    <input type="date" name="licenseExpiry" required
                           class="w-full px-3 py-2 border rounded"
                           value="${driver && driver.driverLicense ? driver.driverLicense.licenseExpiry : ''}">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">License Class</label>
                    <input type="text" name="licenseClass" required
                           class="w-full px-3 py-2 border rounded"
                           value="${driver && driver.driverLicense ? driver.driverLicense.licenseClass : ''}">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Medical Certificate Expiry</label>
                    <input type="date" name="medicalCertificateExpiry" required
                           class="w-full px-3 py-2 border rounded"
                           value="${driver && driver.driverLicense ? driver.driverLicense.medicalCertificateExpiry : ''}">
                </div>
            </div>
            <div class="flex justify-end mt-4">
                <button type="button" onclick="driverManager.closeModal()"
                        class="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                    Cancel
                </button>
                <button type="submit"
                        class="bg-blue-500 text-white px-4 py-2 rounded">
                    ${driver ? 'Update' : 'Add'} Driver
                </button>
            </div>
        `;

        modal.classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('driverModal').classList.add('hidden');
        this.currentDriver = null;
    }

    async handleDriverSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const driverData = {
            name: formData.get('name'),
            licenseNumber: formData.get('licenseNumber'),
            phoneNumber: formData.get('phoneNumber'),
            rating: formData.get('rating') ? parseFloat(formData.get('rating')) : null,
            hireDate: this.currentDriver ? this.currentDriver.hireDate : new Date().toISOString().split('T')[0],
            driverLicense: {
                licenseExpiry: formData.get('licenseExpiry'),
                licenseClass: formData.get('licenseClass'),
                medicalCertificateExpiry: formData.get('medicalCertificateExpiry')
            }
        };

        if (this.currentDriver) {
            driverData.driverId = this.currentDriver.driverId;
            driverData.driverLicense.driverId = this.currentDriver.driverId;
        }

        try {
            const response = await fetch(`/api/drivers${this.currentDriver ? `/${this.currentDriver.driverId}` : ''}`, {
                method: this.currentDriver ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(driverData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to save driver: ${errorData}`);
            }

            this.closeModal();
            this.loadDrivers();
        } catch (error) {
            console.error('Error saving driver:', error);
            alert(error.message || 'Failed to save driver');
        }
    }

    async editDriver(driverId) {
        try {
            const response = await fetch(`/api/drivers/${driverId}`);
            const driver = await response.json();
            this.showDriverModal(driver);
        } catch (error) {
            console.error('Error loading driver:', error);
            alert('Failed to load driver details');
        }
    }

    async deleteDriver(driverId) {
        if (!confirm('Are you sure you want to delete this driver?')) return;

        try {
            const response = await fetch(`/api/drivers/${driverId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete driver');

            this.loadDrivers();
        } catch (error) {
            console.error('Error deleting driver:', error);
            alert('Failed to delete driver');
        }
    }
}

// Initialize the driver manager
window.driverManager = new DriverManager(); 