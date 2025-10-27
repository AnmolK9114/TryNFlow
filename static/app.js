// TRYnFLOW SaaS Platform JavaScript

// Application Data
const appData = {
  "brands": [
    {
      "id": 1,
      "name": "StyleCraft Fashion",
      "logo": "https://via.placeholder.com/100x50/ff0000/ffffff?text=SC",
      "category": "Premium Fashion",
      "subscribers": 15420,
      "monthly_revenue": 125000,
      "try_on_sessions": 8945,
      "conversion_rate": 24.5,
      "growth_rate": 18.2
    },
    {
      "id": 2, 
      "name": "Urban Threads",
      "logo": "https://via.placeholder.com/100x50/000000/ffffff?text=UT",
      "category": "Streetwear",
      "subscribers": 9880,
      "monthly_revenue": 89000,
      "try_on_sessions": 12450,
      "conversion_rate": 19.8,
      "growth_rate": 22.1
    },
    {
      "id": 3,
      "name": "Elegant Essentials", 
      "logo": "https://via.placeholder.com/100x50/cc0000/ffffff?text=EE",
      "category": "Business Wear",
      "subscribers": 7230,
      "monthly_revenue": 156000,
      "try_on_sessions": 5670,
      "conversion_rate": 31.2,
      "growth_rate": 15.7
    }
  ],
  "products": [
    {
      "id": 1,
      "name": "Classic White Shirt",
      "brand": "StyleCraft Fashion", 
      "category": "Tops",
      "price": 89.99,
      "image": "https://via.placeholder.com/300x400/f0f0f0/333333?text=White+Shirt",
      "try_on_count": 456,
      "conversion_rate": 28.5,
      "colors": ["White", "Light Blue", "Pink"],
      "sizes": ["XS", "S", "M", "L", "XL"]
    },
    {
      "id": 2,
      "name": "Denim Jacket",
      "brand": "Urban Threads",
      "category": "Outerwear", 
      "price": 129.99,
      "image": "https://via.placeholder.com/300x400/4169E1/ffffff?text=Denim+Jacket",
      "try_on_count": 892,
      "conversion_rate": 22.1,
      "colors": ["Classic Blue", "Black", "Light Wash"],
      "sizes": ["S", "M", "L", "XL", "XXL"]
    },
    {
      "id": 3,
      "name": "Business Blazer",
      "brand": "Elegant Essentials",
      "category": "Blazers",
      "price": 199.99,
      "image": "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Blazer",
      "try_on_count": 234,
      "conversion_rate": 35.7,
      "colors": ["Black", "Navy", "Charcoal"],
      "sizes": ["XS", "S", "M", "L", "XL"]
    }
  ],
  "analytics": {
    "total_brands": 127,
    "total_users": 45230,
    "monthly_try_ons": 156780,
    "platform_revenue": 2340000,
    "growth_metrics": {
      "user_growth": 23.5,
      "revenue_growth": 34.2,
      "brand_growth": 18.9
    },
    "popular_categories": [
      {"name": "Tops", "percentage": 35.2},
      {"name": "Dresses", "percentage": 24.8}, 
      {"name": "Outerwear", "percentage": 18.6},
      {"name": "Pants", "percentage": 21.4}
    ]
  }
};

// Application State
let currentSection = 'landing';
let currentDashboardView = 'overview';
let selectedProduct = null;
let userPhoto = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  console.log('TRYnFLOW app initializing...');
  
  initializeNavigation();
  initializeDashboard();
  initializeTryOn();
  initializeStylist();
  initializeAnalytics();
  initializeModals();
  
  // Show landing section by default
  showSection('landing');
  console.log('TRYnFLOW app initialized successfully');
});

// Navigation Management
function initializeNavigation() {
  console.log('Initializing navigation...');
  
  // Main navigation items
  const navItems = document.querySelectorAll('.nav-item[data-section]');
  console.log('Found nav items:', navItems.length);
  
  navItems.forEach((item, index) => {
    const section = item.getAttribute('data-section');
    console.log(`Setting up nav item ${index}: ${section}`);
    
    item.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log(`Navigation clicked: ${section}`);
      
      showSection(section);
      updateNavActive(this);
    });
  });

  // Handle buttons with data-section attributes
  const sectionButtons = document.querySelectorAll('button[data-section]');
  console.log('Found section buttons:', sectionButtons.length);
  
  sectionButtons.forEach((btn, index) => {
    const section = btn.getAttribute('data-section');
    console.log(`Setting up section button ${index}: ${section}`);
    
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log(`Section button clicked: ${section}`);
      
      showSection(section);
    });
  });

  // Handle Get Started button
  const getStartedBtns = document.querySelectorAll('.btn--primary:not([data-section])');
  getStartedBtns.forEach(btn => {
    if (btn.textContent.includes('Get Started') || btn.textContent.includes('Start Free Trial')) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Get Started clicked');
        startOnboarding();
      });
    }
  });

  console.log('Navigation initialization complete');
}

function showSection(sectionId) {
  console.log(`Showing section: ${sectionId}`);
  
  // Hide all sections
  const allSections = document.querySelectorAll('.section');
  console.log(`Found ${allSections.length} sections`);
  
  allSections.forEach(section => {
    section.classList.remove('active');
    section.style.display = 'none';
  });
  
  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    console.log(`Activating section: ${sectionId}`);
    targetSection.classList.add('active');
    targetSection.style.display = 'block';
    currentSection = sectionId;
    
    // Initialize section-specific functionality
    if (sectionId === 'analytics') {
      setTimeout(() => {
        console.log('Initializing analytics charts...');
        initializeCharts();
      }, 100);
    }
    
    if (sectionId === 'dashboard') {
      setTimeout(() => {
        console.log('Initializing dashboard charts...');
        initializeDashboardCharts();
      }, 100);
    }
  } else {
    console.error(`Section not found: ${sectionId}`);
  }
}

function updateNavActive(activeItem) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  if (activeItem) {
    activeItem.classList.add('active');
  }
}

// Dashboard Management
function initializeDashboard() {
  console.log('Initializing dashboard...');
  
  const sidebarItems = document.querySelectorAll('.sidebar-item[data-dashboard]');
  console.log('Found sidebar items:', sidebarItems.length);
  
  sidebarItems.forEach((item, index) => {
    const view = item.getAttribute('data-dashboard');
    console.log(`Setting up sidebar item ${index}: ${view}`);
    
    item.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log(`Dashboard view clicked: ${view}`);
      
      showDashboardView(view);
      updateSidebarActive(this);
    });
  });
  
  console.log('Dashboard initialization complete');
}

function showDashboardView(viewId) {
  console.log(`Showing dashboard view: ${viewId}`);
  
  const allViews = document.querySelectorAll('.dashboard-view');
  allViews.forEach(view => {
    view.classList.remove('active');
    view.style.display = 'none';
  });
  
  const targetView = document.getElementById(viewId);
  if (targetView) {
    console.log(`Activating dashboard view: ${viewId}`);
    targetView.classList.add('active');
    targetView.style.display = 'block';
    currentDashboardView = viewId;
  } else {
    console.error(`Dashboard view not found: ${viewId}`);
  }
}

function updateSidebarActive(activeItem) {
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.classList.remove('active');
  });
  if (activeItem) {
    activeItem.classList.add('active');
  }
}

function initializeDashboardCharts() {
  console.log('Initializing dashboard charts...');
  
  // Revenue Chart
  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx) {
    try {
      new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            label: 'Revenue',
            data: [28000, 32000, 35000, 31250],
            borderColor: '#1FB8CD',
            backgroundColor: 'rgba(31, 184, 205, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { display: false },
            y: { display: false }
          },
          elements: {
            point: { radius: 0 }
          }
        }
      });
    } catch (e) {
      console.error('Error creating revenue chart:', e);
    }
  }

  // Sessions Chart
  const sessionsCtx = document.getElementById('sessionsChart');
  if (sessionsCtx) {
    try {
      new Chart(sessionsCtx, {
        type: 'bar',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            label: 'Sessions',
            data: [2100, 2400, 2300, 2236],
            backgroundColor: '#FFC185',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { display: false },
            y: { display: false }
          }
        }
      });
    } catch (e) {
      console.error('Error creating sessions chart:', e);
    }
  }

  // Conversion Chart
  const conversionCtx = document.getElementById('conversionChart');
  if (conversionCtx) {
    try {
      new Chart(conversionCtx, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            label: 'Conversion Rate',
            data: [21.4, 23.8, 25.2, 24.5],
            borderColor: '#B4413C',
            backgroundColor: 'rgba(180, 65, 60, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { display: false },
            y: { display: false }
          },
          elements: {
            point: { radius: 0 }
          }
        }
      });
    } catch (e) {
      console.error('Error creating conversion chart:', e);
    }
  }

  // Users Chart
  const usersCtx = document.getElementById('usersChart');
  if (usersCtx) {
    try {
      new Chart(usersCtx, {
        type: 'doughnut',
        data: {
          labels: ['New Users', 'Returning Users'],
          datasets: [{
            data: [30, 70],
            backgroundColor: ['#5D878F', '#ECEBD5'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          cutout: '70%'
        }
      });
    } catch (e) {
      console.error('Error creating users chart:', e);
    }
  }
}

// Virtual Try-On Management
function initializeTryOn() {
  console.log('Initializing try-on functionality...');
  
  // Product selection
  const productItems = document.querySelectorAll('.product-item.selectable');
  productItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      selectProduct(this);
    });
  });

  // Category filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      setActiveFilter(this);
      filterProducts(this.getAttribute('data-category'));
    });
  });

  
  // View controls
  const viewBtns = document.querySelectorAll('.view-btn');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      setActiveOption(this, '.view-btn');
    });
  });

  // Photo upload
  async function runTryOn() {
  const userFile = document.getElementById("userUpload").files[0];
  const garmentFile = document.getElementById("garmentUpload").files[0];
  const resultContainer = document.getElementById("resultImage");

  if (!userFile || !garmentFile) {
    alert("Please upload both user and garment images.");
    return;
  }

  // Show loading message
  document.querySelector('.results-content').innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Processing your try-on...</p>
    </div>
  `;

  try {
    const formData = new FormData();
    formData.append("user_image", userFile);
    formData.append("garment_image", garmentFile);

    const response = await fetch("http://127.0.0.1:8000/tryon", {
  method: "POST",
  body: formData,
});

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    // Display the final result
    document.querySelector('.results-content').innerHTML = `
      <div class="try-on-result">
        <img src="${imageUrl}" alt="Virtual Try-On Result" 
             style="max-width:100%; border-radius:12px; box-shadow:0 0 10px rgba(0,0,0,0.3);" />
      </div>
    `;
  } catch (error) {
    console.error("❌ Try-on failed:", error);
    document.querySelector('.results-content').innerHTML = `
      <p style="color:red;">Error processing your try-on. Check console logs.</p>
    `;
  }
}

/*function selectProduct(productElement) {
  document.querySelectorAll('.product-item.selectable').forEach(item => {
    item.classList.remove('selected');
  });
  productElement.classList.add('selected');
  
  const productId = productElement.getAttribute('data-product');
  selectedProduct = productId;
  
  // Simulate try-on process
  simulateTryOnProcess();
}*/

function setActiveFilter(filterBtn) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  filterBtn.classList.add('active');
}

function filterProducts(category) {
  const products = document.querySelectorAll('.product-item.selectable');
  products.forEach(product => {
    if (category === 'all') {
      product.style.display = 'flex';
    } else {
      // Simple show/hide based on category - in real app would use data attributes
      product.style.display = 'flex';
    }
  });
}

function setActiveOption(option, selector) {
  document.querySelectorAll(selector).forEach(item => {
    item.classList.remove('active');
  });
  option.classList.add('active');
}

function changeProductColor(color) {
  // Simulate color change - in real app would update product image
  console.log('Changing product color to:', color);
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      userPhoto = e.target.result;
      updateModelViewer(userPhoto);
    };
    reader.readAsDataURL(file);
  }
}

function updateModelViewer(imageSrc) {
  const modelContainer = document.querySelector('.model-container');
  const placeholder = document.querySelector('.model-placeholder');
  
  if (modelContainer && placeholder) {
    placeholder.innerHTML = `
      <div style="position: relative; width: 100%; height: 400px;">
        <img src="${imageSrc}" alt="User Photo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(220, 38, 38, 0.9); color: white; padding: 8px 16px; border-radius: 4px; font-size: 14px;">
          AI Processing...
        </div>
      </div>
    `;
    
    // Simulate AI processing
    setTimeout(() => {
      simulateTryOnResult();
    }, 2000);
  }
}

/*function simulateTryOnProcess() {
  const resultsContent = document.querySelector('.results-content');
  if (resultsContent) {
    resultsContent.innerHTML = `
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>Processing your try-on...</p>
      </div>
    `;
    
    setTimeout(() => {
      simulateTryOnResult();
    }, 3000);
  }
} */

/*function simulateTryOnResult() {
  const resultsContent = document.querySelector('.results-content');
  if (resultsContent) {
    resultsContent.innerHTML = `
      <div class="try-on-result">
        <div style="background: linear-gradient(145deg, rgba(220, 38, 38, 0.1), rgba(31, 184, 205, 0.1)); 
                    border: 1px solid rgba(220, 38, 38, 0.2); border-radius: 8px; 
                    padding: 20px; text-align: center; color: white;">
          <h4 style="margin: 0 0 12px 0; color: #1FB8CD;">Try-On Complete!</h4>
          <p style="margin: 0 0 16px 0; color: #ccc;">Your virtual try-on has been processed successfully</p>
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button class="btn btn--primary btn--sm" onclick="saveLook()">Save Look</button>
            <button class="btn btn--outline btn--sm" onclick="shareLook()">Share</button>
          </div>
        </div>
      </div>
    `;
  }
} */

/*async function triggerUpload() {
  const fileInput = document.getElementById('photoUpload');
  fileInput.click();

  fileInput.onchange = async () => {
    const userImage = fileInput.files[0];
    const garmentImage = document.querySelector('.product-item.selectable.active img');

    if (!userImage || !garmentImage) {
      alert("Please upload your photo and select a garment first!");
      return;
    }

    const response = await fetch(garmentImage.src);
    const garmentBlob = await response.blob();
    const formData = new FormData();

    formData.append("user_image", userImage);
    formData.append("garment_image", garmentBlob, "garment.png");

    document.querySelector('.loading-state').style.display = 'block';

    const res = await fetch("/tryon", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);
      document.querySelector('.result-preview').innerHTML =
        `<img src="${imageUrl}" alt="Try-on Result" style="width:100%;border-radius:10px;">`;
    } else {
      alert("Try-on failed. Please check backend logs!");
    }

    document.querySelector('.loading-state').style.display = 'none';
  };
}
*/
function saveLook() {
  showNotification('Look saved to your collection!', 'success');
}
function showNotification(message, type = "info") {
  alert(`${type.toUpperCase()}: ${message}`);
}
function shareLook() {
  showNotification('Share link copied to clipboard!', 'success');
}


// Analytics Management
function initializeAnalytics() {
  console.log('Analytics initialized - charts will load when section is shown');
}

function initializeCharts() {
  console.log('Initializing analytics charts...');
  
  // Revenue Growth Chart
  const revenueGrowthCtx = document.getElementById('revenueGrowthChart');
  if (revenueGrowthCtx) {
    try {
      new Chart(revenueGrowthCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Platform Revenue',
            data: [1800000, 1950000, 2100000, 2200000, 2280000, 2340000],
            borderColor: '#1FB8CD',
            backgroundColor: 'rgba(31, 184, 205, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#1FB8CD',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              labels: { color: '#ccc' }
            }
          },
          scales: {
            x: { 
              ticks: { color: '#888' },
              grid: { color: 'rgba(255,255,255,0.1)' }
            },
            y: { 
              ticks: { 
                color: '#888',
                callback: function(value) {
                  return '$' + (value / 1000000).toFixed(1) + 'M';
                }
              },
              grid: { color: 'rgba(255,255,255,0.1)' }
            }
          }
        }
      });
    } catch (e) {
      console.error('Error creating revenue growth chart:', e);
    }
  }

  // Categories Chart
  const categoriesCtx = document.getElementById('categoriesChart');
  if (categoriesCtx) {
    try {
      new Chart(categoriesCtx, {
        type: 'doughnut',
        data: {
          labels: ['Tops', 'Dresses', 'Outerwear', 'Pants'],
          datasets: [{
            data: [35.2, 24.8, 18.6, 21.4],
            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { 
                color: '#ccc',
                padding: 20
              }
            }
          }
        }
      });
    } catch (e) {
      console.error('Error creating categories chart:', e);
    }
  }

  // Engagement Chart
  const engagementCtx = document.getElementById('engagementChart');
  if (engagementCtx) {
    try {
      new Chart(engagementCtx, {
        type: 'bar',
        data: {
          labels: ['Try-Ons', 'Saves', 'Shares', 'Purchases'],
          datasets: [{
            label: 'User Actions',
            data: [156780, 89432, 23456, 34567],
            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { 
              ticks: { color: '#888' },
              grid: { display: false }
            },
            y: { 
              ticks: { 
                color: '#888',
                callback: function(value) {
                  return (value / 1000).toFixed(0) + 'K';
                }
              },
              grid: { color: 'rgba(255,255,255,0.1)' }
            }
          }
        }
      });
    } catch (e) {
      console.error('Error creating engagement chart:', e);
    }
  }
}

// Modal Management
function initializeModals() {
  console.log('Initializing modals...');
  
  const modalCloses = document.querySelectorAll('.modal-close');
  modalCloses.forEach(close => {
    close.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const modal = this.closest('.modal');
      if (modal) {
        closeModal(modal.id);
      }
    });
  });

  // Close modals on backdrop click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });
}

function showModal(modalId) {
  console.log(`Showing modal: ${modalId}`);
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeModal(modalId) {
  console.log(`Closing modal: ${modalId}`);
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
  }
}

function showUploadModal() {
  showModal('uploadModal');
}

function showAddProductModal() {
  showNotification('Product form would open here', 'info');
}

// Onboarding Flow
function startOnboarding() {
  console.log('Starting onboarding...');
  showModal('onboardingModal');
}

function nextStep() {
  const currentStep = document.querySelector('.step.active');
  const nextStepElement = currentStep ? currentStep.nextElementSibling : null;
  
  if (nextStepElement && nextStepElement.classList.contains('step')) {
    currentStep.classList.remove('active');
    nextStepElement.classList.add('active');
  } else {
    // Complete onboarding
    closeModal('onboardingModal');
    showSection('dashboard');
    showNotification('Welcome to TRYnFLOW! Your brand has been set up successfully.', 'success');
  }
}

// Utility Functions
function showNotification(message, type = 'info') {
  console.log(`Notification: ${message} (${type})`);
  
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <div style="position: fixed; top: 100px; right: 20px; z-index: 3000; 
                background: ${type === 'success' ? '#1FB8CD' : type === 'error' ? '#B4413C' : '#5D878F'}; 
                color: white; padding: 12px 20px; border-radius: 8px; 
                box-shadow: 0 4px 12px rgba(0,0,0,0.3); 
                transform: translateX(100%); transition: transform 0.3s ease;">
      ${message}
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    const notificationEl = notification.firstElementChild;
    if (notificationEl) {
      notificationEl.style.transform = 'translateX(0)';
    }
  }, 100);
  
  // Animate out and remove
  setTimeout(() => {
    const notificationEl = notification.firstElementChild;
    if (notificationEl) {
      notificationEl.style.transform = 'translateX(100%)';
    }
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// API Simulation Functions
function simulateAPICall(endpoint, data = null) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: data || {},
        message: `${endpoint} processed successfully`
      });
    }, Math.random() * 1000 + 500);
  });
}

function simulateFileUpload(file) {
  return new Promise((resolve) => {
    const progress = { loaded: 0, total: file.size };
    const interval = setInterval(() => {
      progress.loaded += file.size * 0.1;
      if (progress.loaded >= progress.total) {
        clearInterval(interval);
        resolve({
          success: true,
          url: URL.createObjectURL(file),
          filename: file.name
        });
      }
    }, 200);
  });
}

// Live Demo Features
function simulateLiveData() {
  setInterval(() => {
    // Update random metrics
    const metrics = document.querySelectorAll('.metric-value');
    metrics.forEach(metric => {
      if (Math.random() > 0.95) { // 5% chance of update
        const currentValue = parseInt(metric.textContent.replace(/[^\d]/g, ''));
        const change = Math.floor(Math.random() * 10) - 5; // Random change -5 to +5
        const newValue = Math.max(0, currentValue + change);
        
        if (metric.textContent.includes('$')) {
          metric.textContent = formatCurrency(newValue);
        } else if (metric.textContent.includes('%')) {
          metric.textContent = newValue.toFixed(1) + '%';
        } else {
          metric.textContent = formatNumber(newValue);
        }
      }
    });
  }, 5000);
}

// Initialize live demo features
document.addEventListener('DOMContentLoaded', function() {
  // Start live data simulation after delay
  setTimeout(simulateLiveData, 3000);
});

// Export functions for global use
window.showSection = showSection;
window.showModal = showModal;
window.closeModal = closeModal;
window.showUploadModal = showUploadModal;
window.showAddProductModal = showAddProductModal;
window.startOnboarding = startOnboarding;
window.nextStep = nextStep;
window.triggerUpload = triggerUpload;
window.saveLook = saveLook;
window.shareLook = shareLook;}