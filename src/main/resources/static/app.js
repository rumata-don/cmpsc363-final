// Dashboard initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
});

function initializeDashboard() {
    // Add dashboard card animations
    const cards = document.querySelectorAll('.bg-white.rounded-lg');
    cards.forEach(card => {
        card.classList.add('dashboard-card');
    });

    // Initialize sidebar navigation
    const navItems = document.querySelectorAll('nav a');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('bg-gray-100'));
            // Add active class to clicked item
            item.classList.add('bg-gray-100');

            // Get all sections
            const sections = {
                customersSection: document.getElementById('customersSection'),
                driversSection: document.getElementById('driversSection'),
                vehiclesSection: document.getElementById('vehiclesSection'),
                tripsSection: document.getElementById('tripsSection')
            };

            // Hide all sections first and clear trips table
            Object.values(sections).forEach(section => {
                if (section) {
                    section.style.display = 'none';
                    // Clear trips table if it exists
                    if (section.id === 'tripsSection') {
                        const tripsTable = section.querySelector('#tripsTable');
                        if (tripsTable) {
                            tripsTable.innerHTML = '';
                        }
                    }
                }
            });

            // Show the selected section
            switch(item.id) {
                case 'customersLink':
                    if (sections.customersSection) {
                        sections.customersSection.style.display = 'block';
                        if (window.customerManager) {
                            window.customerManager.loadCustomers();
                        }
                    }
                    break;
                case 'driversLink':
                    if (sections.driversSection) {
                        sections.driversSection.style.display = 'block';
                        if (window.driverManager) {
                            window.driverManager.loadDrivers();
                        }
                    }
                    break;
                case 'vehiclesLink':
                    if (sections.vehiclesSection) {
                        sections.vehiclesSection.style.display = 'block';
                        if (window.vehicleManager) {
                            window.vehicleManager.loadVehicles();
                        }
                    }
                    break;
                case 'tripsLink':
                    if (sections.tripsSection) {
                        sections.tripsSection.style.display = 'block';
                        if (window.tripManager) {
                            window.tripManager.loadTrips();
                        }
                    }
                    break;
            }
        });
    });

    // Example function to update dashboard data
    updateDashboardData();
}

function updateDashboardData() {
    // This function will be used to fetch and update dashboard data
    console.log('Dashboard data updated');
} 