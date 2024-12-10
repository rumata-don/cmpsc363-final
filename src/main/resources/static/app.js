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
                vehiclesSection: document.getElementById('vehiclesSection')
            };

            // Hide all sections first
            Object.values(sections).forEach(section => {
                if (section) section.style.display = 'none';
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