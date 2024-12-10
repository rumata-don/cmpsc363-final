class CustomerManager {
    constructor() {
        this.customersContainer = document.createElement('div');
        this.customersContainer.id = 'customersSection';
        this.customersContainer.style.display = 'none';
        this.customersContainer.className = 'customers-section';
        this.initializeCustomerSection();
    }

    initializeCustomerSection() {
        this.customersContainer.innerHTML = `
            <div class="mb-8">
                <h2 class="text-2xl font-bold mb-4">Customer Management</h2>
                
                <!-- Search and Filter Section -->
                <div class="mb-6 bg-white p-4 rounded-lg shadow">
                    <div class="flex flex-col space-y-4">
                        <!-- Search Bar -->
                        <div class="flex space-x-4">
                            <div class="flex-1">
                                <input type="text" id="searchInput" placeholder="Search by name, email, phone, or ID..." 
                                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <button id="searchButton" class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
                                Search
                            </button>
                        </div>
                        
                        <!-- Filter Buttons -->
                        <div class="flex space-x-4">
                            <button id="showAllCustomers" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                                All Customers
                            </button>
                            <button id="showRegularCustomers" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Regular Customers
                            </button>
                            <button id="showCorporateCustomers" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                Corporate Customers
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex space-x-4 mb-6">
                    <button id="createRegularCustomer" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add Regular Customer
                    </button>
                    <button id="createCorporateCustomer" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Add Corporate Customer
                    </button>
                </div>

                <!-- Form Container -->
                <div id="customerFormContainer" class="hidden mb-6"></div>

                <!-- Customers List -->
                <div id="customersList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
            </div>
        `;

        const main = document.querySelector('main');
        if (main) {
            main.appendChild(this.customersContainer);
            this.setupEventListeners();
            this.loadCustomers();
        } else {
            console.error('Main content area not found');
        }
    }

    setupEventListeners() {
        const regularBtn = document.getElementById('createRegularCustomer');
        const corporateBtn = document.getElementById('createCorporateCustomer');
        const searchBtn = document.getElementById('searchButton');
        const searchInput = document.getElementById('searchInput');
        const showAllBtn = document.getElementById('showAllCustomers');
        const showRegularBtn = document.getElementById('showRegularCustomers');
        const showCorporateBtn = document.getElementById('showCorporateCustomers');
        
        if (regularBtn) {
            regularBtn.addEventListener('click', () => this.showCustomerForm('regular'));
        }
        if (corporateBtn) {
            corporateBtn.addEventListener('click', () => this.showCustomerForm('corporate'));
        }
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => this.searchCustomers(searchInput.value));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchCustomers(searchInput.value);
                }
            });
        }

        // Filter buttons event listeners
        if (showAllBtn) {
            showAllBtn.addEventListener('click', () => this.loadCustomers());
        }
        if (showRegularBtn) {
            showRegularBtn.addEventListener('click', () => this.loadRegularCustomers());
        }
        if (showCorporateBtn) {
            showCorporateBtn.addEventListener('click', () => this.loadCorporateCustomers());
        }
    }

    async searchCustomers(query) {
        if (!query) {
            this.loadCustomers();
            return;
        }

        try {
            const response = await fetch(`/api/customers/search?query=${encodeURIComponent(query.trim())}`);
            if (!response.ok) {
                throw new Error('Failed to search customers');
            }
            const customers = await response.json();
            this.displayCustomers(customers);
        } catch (error) {
            console.error('Error searching customers:', error);
            alert('Failed to search customers. Please try again.');
        }
    }

    showCustomerForm(type, customer = null) {
        const formContainer = document.getElementById('customerFormContainer');
        const isRegular = type === 'regular';
        const isUpdate = customer !== null;
        
        formContainer.innerHTML = `
            <form id="customerForm" class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-4">${isUpdate ? 'Update' : 'New'} ${isRegular ? 'Regular' : 'Corporate'} Customer</h3>
                <div class="grid grid-cols-1 gap-4">
                    <input type="hidden" name="customerId" value="${customer?.customerId || ''}">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" required value="${customer?.name || ''}"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="tel" name="phoneNumber" required value="${customer?.phoneNumber || ''}"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" required value="${customer?.email || ''}"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    </div>
                    ${isRegular ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Membership Level</label>
                            <select name="membershipLevel" 
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                ${['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'].map(level => 
                                    `<option value="${level}" ${customer?.membershipLevel === level ? 'selected' : ''}>${level}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Loyalty Points</label>
                            <input type="number" name="loyaltyPoints" value="${customer?.loyaltyPoints || 0}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        </div>
                    ` : `
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Company Name</label>
                            <input type="text" name="companyName" required value="${customer?.companyName || ''}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Billing Address</label>
                            <textarea name="billingAddress" required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">${customer?.billingAddress || ''}</textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Credit Limit</label>
                            <input type="number" name="creditLimit" required value="${customer?.creditLimit || ''}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        </div>
                    `}
                </div>
                <div class="mt-4 flex justify-between">
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        ${isUpdate ? 'Update' : 'Create'} Customer
                    </button>
                    ${isUpdate ? `
                        <button type="button" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" id="deleteCustomerBtn">
                            Delete Customer
                        </button>
                    ` : ''}
                </div>
            </form>
        `;

        formContainer.classList.remove('hidden');
        
        const form = document.getElementById('customerForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCustomerSubmit(e.target, type, isUpdate);
        });

        const deleteBtn = document.getElementById('deleteCustomerBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteCustomer(customer.customerId));
        }
    }

    async handleCustomerSubmit(form, type, isUpdate) {
        const formData = new FormData(form);
        const customerData = {};
        formData.forEach((value, key) => {
            if (key === 'creditLimit') {
                customerData[key] = parseFloat(value);
            } else if (key === 'loyaltyPoints') {
                customerData[key] = parseInt(value) || 0;
            } else {
                customerData[key] = value;
            }
        });

        try {
            let url;
            if (isUpdate) {
                url = `/api/customers/${type}/${customerData.customerId}`;
            } else {
                url = `/api/customers/${type}`;
            }

            const response = await fetch(url, {
                method: isUpdate ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || (isUpdate ? 'Failed to update customer' : 'Failed to create customer'));
            }

            form.reset();
            document.getElementById('customerFormContainer').classList.add('hidden');
            this.loadCustomers();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    }

    async deleteCustomer(customerId) {
        if (!confirm('Are you sure you want to delete this customer?')) {
            return;
        }

        try {
            const response = await fetch(`/api/customers/${customerId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                document.getElementById('customerFormContainer').classList.add('hidden');
                this.loadCustomers();
            } else {
                throw new Error('Failed to delete customer');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            alert('Failed to delete customer. Please try again.');
        }
    }

    async loadCustomers() {
        try {
            const [regularResponse, corporateResponse] = await Promise.all([
                fetch('/api/customers/regular'),
                fetch('/api/customers/corporate')
            ]);

            const regularCustomers = await regularResponse.json();
            const corporateCustomers = await corporateResponse.json();

            this.displayCustomers([...regularCustomers, ...corporateCustomers]);
        } catch (error) {
            console.error('Error loading customers:', error);
            alert('Failed to load customers. Please try again.');
        }
    }

    async loadRegularCustomers() {
        try {
            const response = await fetch('/api/customers/regular');
            if (!response.ok) {
                throw new Error('Failed to load regular customers');
            }
            const customers = await response.json();
            this.displayCustomers(customers);
        } catch (error) {
            console.error('Error loading regular customers:', error);
            alert('Failed to load regular customers. Please try again.');
        }
    }

    async loadCorporateCustomers() {
        try {
            const response = await fetch('/api/customers/corporate');
            if (!response.ok) {
                throw new Error('Failed to load corporate customers');
            }
            const customers = await response.json();
            this.displayCustomers(customers);
        } catch (error) {
            console.error('Error loading corporate customers:', error);
            alert('Failed to load corporate customers. Please try again.');
        }
    }

    displayCustomers(customers) {
        const customersList = document.getElementById('customersList');
        if (!customers || customers.length === 0) {
            customersList.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <p class="text-gray-500 text-lg">No customers found</p>
                </div>
            `;
            return;
        }
        
        customersList.innerHTML = customers.map(customer => `
            <div class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h3 class="text-lg font-semibold">${customer.name}</h3>
                <p class="text-sm text-gray-600">${customer.companyName ? 'Corporate' : 'Regular'} Customer</p>
                <p class="text-sm text-gray-600">ID: ${customer.customerId}</p>
                <div class="mt-2">
                    <p>Phone: ${customer.phoneNumber}</p>
                    <p>Email: ${customer.email}</p>
                    ${customer.companyName ? `
                        <p>Company: ${customer.companyName}</p>
                        <p>Credit Limit: $${customer.creditLimit}</p>
                        <p>Billing Address: ${customer.billingAddress}</p>
                    ` : `
                        <p>Membership: ${customer.membershipLevel}</p>
                        <p>Loyalty Points: ${customer.loyaltyPoints || 0}</p>
                    `}
                </div>
                <button onclick="customerManager.showCustomerForm('${customer.companyName ? 'corporate' : 'regular'}', ${JSON.stringify(customer).replace(/"/g, '&quot;')})"
                    class="mt-3 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                    Edit
                </button>
            </div>
        `).join('');
    }

    show() {
        this.customersContainer.style.display = 'block';
        this.loadCustomers();
    }

    hide() {
        this.customersContainer.style.display = 'none';
    }
}

// Initialize customer management when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.customerManager = new CustomerManager();
    // Show customers section by default since it's the only section now
    const customersSection = document.getElementById('customersSection');
    if (customersSection) {
        customersSection.style.display = 'block';
    }
}); 