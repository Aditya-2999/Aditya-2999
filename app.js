// Global State Management
let currentView = 'gnews';
let searchKeywords = [];
let excludeKeywords = [];
let newsResults = [];
let insightsGenerated = false;
let projects = [];
let emailGroups = [
    { id: 1, name: 'Leadership', emails: ['ceo@company.com', 'cto@company.com'] },
    { id: 2, name: 'Marketing', emails: ['marketing@company.com', 'social@company.com'] },
    { id: 3, name: 'Development', emails: ['dev@company.com', 'qa@company.com'] }
];

// Sample News Data (expanded from provided data)
const sampleNewsData = [
    {
        headline: "Tesla to build new Gigafactory in India",
        link: "https://example.com/tesla-india",
        source: "TechCrunch",
        published: "2025-07-10"
    },
    {
        headline: "Apple unveils AI-powered news summarizer",
        link: "https://example.com/apple-ai-news",
        source: "The Verge",
        published: "2025-07-12"
    },
    {
        headline: "Google faces antitrust probe over Search dominance",
        link: "https://example.com/google-antitrust",
        source: "Reuters",
        published: "2025-07-13"
    },
    {
        headline: "Microsoft announces new AI partnership with OpenAI",
        link: "https://example.com/microsoft-openai",
        source: "TechCrunch",
        published: "2025-07-14"
    },
    {
        headline: "Amazon Web Services launches new cloud computing initiative",
        link: "https://example.com/aws-cloud",
        source: "AWS News",
        published: "2025-07-15"
    },
    {
        headline: "Meta introduces advanced VR headset for enterprise",
        link: "https://example.com/meta-vr",
        source: "The Verge",
        published: "2025-07-11"
    },
    {
        headline: "Netflix reports record subscriber growth in Q2",
        link: "https://example.com/netflix-growth",
        source: "Financial Times",
        published: "2025-07-09"
    },
    {
        headline: "SpaceX successfully launches Starship mission to Mars",
        link: "https://example.com/spacex-mars",
        source: "Space News",
        published: "2025-07-08"
    },
    {
        headline: "Nvidia announces breakthrough in quantum computing",
        link: "https://example.com/nvidia-quantum",
        source: "TechCrunch",
        published: "2025-07-07"
    },
    {
        headline: "Twitter implements new content moderation policies",
        link: "https://example.com/twitter-moderation",
        source: "Reuters",
        published: "2025-07-06"
    }
];

// Companies and keywords for insights generation
const companies = ['Tesla', 'Apple', 'Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'SpaceX', 'Nvidia', 'Twitter'];
const keywords = ['AI', 'technology', 'innovation', 'business', 'growth', 'development', 'partnership', 'launch', 'breakthrough', 'policy'];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    populateEmailGroups();
    loadProjects();
});

function initializeApp() {
    // Set initial date range (last week)
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    document.getElementById('end-date').value = today.toISOString().split('T')[0];
    document.getElementById('start-date').value = lastWeek.toISOString().split('T')[0];
    
    // Load initial view
    showView('gnews');
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const route = this.dataset.route;
            navigateToView(route);
        });
    });

    // Keywords input
    document.getElementById('keywords-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addKeyword(this.value.trim(), 'keywords');
            this.value = '';
        }
    });

    // Exclude keywords input
    document.getElementById('exclude-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addKeyword(this.value.trim(), 'exclude');
            this.value = '';
        }
    });

    // Date presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            setDatePreset(this.dataset.preset);
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Modal close on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
            }
        });
    });
}

function navigateToView(route) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-route="${route}"]`).classList.add('active');
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'source-addition': 'Source Addition',
        'projects': 'Projects',
        'email-groups': 'Email Groups',
        'gnews': 'Google News Analytics'
    };
    document.querySelector('.page-title').textContent = titles[route] || 'Infopulse';
    
    // Show correct view
    showView(route);
    currentView = route;
}

function showView(viewName) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.add('hidden');
    });
    document.getElementById(`${viewName}-view`).classList.remove('hidden');
    
    // Load view-specific data
    if (viewName === 'projects') {
        renderProjects();
    } else if (viewName === 'email-groups') {
        renderEmailGroups();
    }
}

function addKeyword(keyword, type) {
    if (!keyword) return;
    
    const container = type === 'keywords' ? 'keywords-chips' : 'exclude-chips';
    const array = type === 'keywords' ? searchKeywords : excludeKeywords;
    
    if (!array.includes(keyword)) {
        array.push(keyword);
        renderKeywordChips(container, array, type);
    }
}

function removeKeyword(keyword, type) {
    const array = type === 'keywords' ? searchKeywords : excludeKeywords;
    const index = array.indexOf(keyword);
    if (index > -1) {
        array.splice(index, 1);
        const container = type === 'keywords' ? 'keywords-chips' : 'exclude-chips';
        renderKeywordChips(container, array, type);
    }
}

function renderKeywordChips(containerId, keywords, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = keywords.map(keyword => `
        <div class="keyword-chip ${type === 'exclude' ? 'exclude' : ''}">
            <span>${keyword}</span>
            <span class="chip-remove" onclick="removeKeyword('${keyword}', '${type}')">×</span>
        </div>
    `).join('');
}

function setDatePreset(preset) {
    const today = new Date();
    let startDate, endDate = today;
    
    switch (preset) {
        case 'latest':
            startDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
            break;
        case 'yesterday':
            startDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
            endDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
            break;
        case 'week':
            startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'quarter':
            startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
        case 'year':
            startDate = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
        default:
            startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    
    document.getElementById('start-date').value = startDate.toISOString().split('T')[0];
    document.getElementById('end-date').value = endDate.toISOString().split('T')[0];
}

function searchNews() {
    if (searchKeywords.length === 0) {
        alert('Please add at least one search keyword');
        return;
    }
    
    // Show loading state
    const tableBody = document.getElementById('news-results');
    tableBody.innerHTML = '<tr><td colspan="8" class="loading">Searching news...</td></tr>';
    
    // Simulate API call delay
    setTimeout(() => {
        // Filter and process news data
        newsResults = generateNewsResults();
        renderNewsResults();
        
        // Enable action buttons
        document.getElementById('generate-insights-btn').disabled = false;
        document.getElementById('download-csv-btn').disabled = false;
        document.getElementById('save-project-btn').disabled = false;
        
        // Make sure buttons are visible
        document.getElementById('generate-insights-btn').style.display = 'inline-flex';
        document.getElementById('download-csv-btn').style.display = 'inline-flex';
        document.getElementById('save-project-btn').style.display = 'inline-flex';
        
        // Reset insights state
        insightsGenerated = false;
        hideInsightsColumns();
        closeInsightsDrawer();
    }, 1000);
}

function generateNewsResults() {
    // Generate more realistic news results based on keywords
    const results = [];
    const availableNews = [...sampleNewsData];
    
    // Add keyword-specific news
    searchKeywords.forEach(keyword => {
        const keywordNews = availableNews.filter(news => 
            news.headline.toLowerCase().includes(keyword.toLowerCase()) ||
            news.source.toLowerCase().includes(keyword.toLowerCase())
        );
        results.push(...keywordNews);
    });
    
    // Add some random news to reach a good number
    while (results.length < 15 && availableNews.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableNews.length);
        const news = availableNews.splice(randomIndex, 1)[0];
        if (!results.find(r => r.headline === news.headline)) {
            results.push(news);
        }
    }
    
    // Filter out excluded keywords
    const filtered = results.filter(news => {
        return !excludeKeywords.some(exclude => 
            news.headline.toLowerCase().includes(exclude.toLowerCase())
        );
    });
    
    return filtered.slice(0, 20); // Limit to 20 results
}

function renderNewsResults() {
    const tableBody = document.getElementById('news-results');
    
    if (newsResults.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="empty-state">No news found matching your criteria</td></tr>';
        return;
    }
    
    tableBody.innerHTML = newsResults.map(news => `
        <tr>
            <td><a href="${news.link}" target="_blank" class="headline-link">${news.headline}</a></td>
            <td>${news.source}</td>
            <td>${formatDate(news.published)}</td>
            <td class="insights-column hidden"></td>
            <td class="insights-column hidden"></td>
            <td class="insights-column hidden"></td>
            <td class="insights-column hidden"></td>
            <td class="insights-column hidden"></td>
        </tr>
    `).join('');
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function generateInsights() {
    if (newsResults.length === 0) return;
    
    // Show loading state
    const button = document.getElementById('generate-insights-btn');
    button.disabled = true;
    button.textContent = 'Generating...';
    
    setTimeout(() => {
        // Generate insights for each news item
        newsResults = newsResults.map(news => ({
            ...news,
            insights: generateNewsInsights(news)
        }));
        
        // Show insights columns
        showInsightsColumns();
        
        // Update table with insights
        updateTableWithInsights();
        
        // Show insights drawer
        showInsightsDrawer();
        
        // Update button
        button.disabled = false;
        button.textContent = 'Generate Insights';
        insightsGenerated = true;
        
        // Ensure action buttons remain visible and enabled
        document.getElementById('download-csv-btn').disabled = false;
        document.getElementById('save-project-btn').disabled = false;
        document.getElementById('download-csv-btn').style.display = 'inline-flex';
        document.getElementById('save-project-btn').style.display = 'inline-flex';
    }, 2000);
}

function generateNewsInsights(news) {
    // Generate realistic insights
    const sentiments = ['Positive', 'Negative', 'Neutral'];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    
    // Generate company tags
    const relevantCompanies = companies.filter(company => 
        news.headline.toLowerCase().includes(company.toLowerCase())
    );
    const additionalCompanies = companies.filter(c => !relevantCompanies.includes(c))
        .slice(0, Math.floor(Math.random() * 3));
    const companyTags = [...relevantCompanies, ...additionalCompanies];
    
    // Generate keyword tags
    const relevantKeywords = keywords.filter(keyword => 
        news.headline.toLowerCase().includes(keyword.toLowerCase())
    );
    const additionalKeywords = keywords.filter(k => !relevantKeywords.includes(k))
        .slice(0, Math.floor(Math.random() * 4));
    const keywordTags = [...relevantKeywords, ...additionalKeywords];
    
    return {
        summary: generateSummary(news.headline),
        companies: companyTags.slice(0, 5),
        keywords: keywordTags.slice(0, 6),
        impactScore: Math.floor(Math.random() * 100) + 1,
        sentiment: sentiment
    };
}

function generateSummary(headline) {
    const summaryTemplates = [
        "Breaking news about market developments and industry trends.",
        "Latest updates on technology advancement and business growth.",
        "Important announcement regarding strategic partnerships and innovations.",
        "Key developments in the industry with significant market impact.",
        "Major business news affecting stakeholders and market conditions."
    ];
    
    return summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)];
}

function showInsightsColumns() {
    document.querySelectorAll('.insights-column').forEach(col => {
        col.classList.remove('hidden');
    });
}

function hideInsightsColumns() {
    document.querySelectorAll('.insights-column').forEach(col => {
        col.classList.add('hidden');
    });
}

function updateTableWithInsights() {
    const tableBody = document.getElementById('news-results');
    tableBody.innerHTML = newsResults.map(news => `
        <tr>
            <td><a href="${news.link}" target="_blank" class="headline-link">${news.headline}</a></td>
            <td>${news.source}</td>
            <td>${formatDate(news.published)}</td>
            <td class="insights-column">${news.insights.summary}</td>
            <td class="insights-column">
                <div class="company-tags">
                    ${news.insights.companies.map(company => `<span class="tag">${company}</span>`).join('')}
                </div>
            </td>
            <td class="insights-column">
                <div class="keyword-tags">
                    ${news.insights.keywords.map(keyword => `<span class="tag">${keyword}</span>`).join('')}
                </div>
            </td>
            <td class="insights-column">
                <div class="impact-score">
                    <span>${news.insights.impactScore}</span>
                    <div class="impact-bar">
                        <div class="impact-fill" style="width: ${news.insights.impactScore}%"></div>
                    </div>
                </div>
            </td>
            <td class="insights-column">
                <span class="sentiment-badge sentiment-${news.insights.sentiment.toLowerCase()}">
                    ${news.insights.sentiment}
                </span>
            </td>
        </tr>
    `).join('');
}

function showInsightsDrawer() {
    const drawer = document.getElementById('insights-drawer');
    drawer.classList.remove('hidden');
    
    // Generate aggregate insights
    setTimeout(() => {
        generateAggregateInsights();
    }, 100);
}

function closeInsightsDrawer() {
    document.getElementById('insights-drawer').classList.add('hidden');
}

function generateAggregateInsights() {
    if (!insightsGenerated || newsResults.length === 0) return;
    
    // Sentiment distribution
    const sentimentCounts = { Positive: 0, Negative: 0, Neutral: 0 };
    newsResults.forEach(news => {
        if (news.insights) {
            sentimentCounts[news.insights.sentiment]++;
        }
    });
    
    // Create sentiment chart
    const sentimentChart = document.getElementById('sentiment-chart');
    if (sentimentChart) {
        const sentimentCtx = sentimentChart.getContext('2d');
        
        new Chart(sentimentCtx, {
            type: 'doughnut',
            data: {
                labels: ['Positive', 'Negative', 'Neutral'],
                datasets: [{
                    data: [sentimentCounts.Positive, sentimentCounts.Negative, sentimentCounts.Neutral],
                    backgroundColor: ['#22c55e', '#ef4444', '#6b7280']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Top companies
    const companyCounts = {};
    newsResults.forEach(news => {
        if (news.insights) {
            news.insights.companies.forEach(company => {
                companyCounts[company] = (companyCounts[company] || 0) + 1;
            });
        }
    });
    
    const topCompanies = Object.entries(companyCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    
    const topCompaniesList = document.getElementById('top-companies-list');
    if (topCompaniesList) {
        topCompaniesList.innerHTML = topCompanies.map(([company, count]) => `
            <div class="company-item">
                <span class="company-name">${company}</span>
                <span class="company-count">${count}</span>
            </div>
        `).join('');
    }
    
    // Impact score distribution
    const impactChart = document.getElementById('impact-chart');
    if (impactChart) {
        const impactCtx = impactChart.getContext('2d');
        
        const impactScores = newsResults.map(news => news.insights ? news.insights.impactScore : 0);
        
        new Chart(impactCtx, {
            type: 'bar',
            data: {
                labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
                datasets: [{
                    label: 'Impact Score Distribution',
                    data: [
                        impactScores.filter(s => s <= 20).length,
                        impactScores.filter(s => s > 20 && s <= 40).length,
                        impactScores.filter(s => s > 40 && s <= 60).length,
                        impactScores.filter(s => s > 60 && s <= 80).length,
                        impactScores.filter(s => s > 80).length
                    ],
                    backgroundColor: '#3b82f6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function showColumnSelectDialog() {
    const dialog = document.getElementById('column-select-dialog');
    const checkboxes = document.getElementById('column-checkboxes');
    
    const columns = [
        { id: 'headline', label: 'Headline', checked: true },
        { id: 'source', label: 'Source', checked: true },
        { id: 'published', label: 'Published Date', checked: true },
        { id: 'summary', label: 'Summary', checked: insightsGenerated },
        { id: 'companies', label: 'Companies', checked: insightsGenerated },
        { id: 'keywords', label: 'Keywords', checked: insightsGenerated },
        { id: 'impactScore', label: 'Impact Score', checked: insightsGenerated },
        { id: 'sentiment', label: 'Sentiment', checked: insightsGenerated }
    ];
    
    checkboxes.innerHTML = columns.map(col => `
        <div class="column-item">
            <input type="checkbox" id="col-${col.id}" ${col.checked ? 'checked' : ''}>
            <label for="col-${col.id}">${col.label}</label>
        </div>
    `).join('');
    
    dialog.classList.remove('hidden');
}

function closeColumnSelectDialog() {
    document.getElementById('column-select-dialog').classList.add('hidden');
}

function downloadSelectedColumns() {
    const selectedColumns = [];
    document.querySelectorAll('#column-checkboxes input:checked').forEach(input => {
        selectedColumns.push(input.id.replace('col-', ''));
    });
    
    if (selectedColumns.length === 0) {
        alert('Please select at least one column');
        return;
    }
    
    // Prepare data for CSV
    const csvData = newsResults.map(news => {
        const row = {};
        selectedColumns.forEach(col => {
            switch (col) {
                case 'headline':
                    row.headline = news.headline;
                    break;
                case 'source':
                    row.source = news.source;
                    break;
                case 'published':
                    row.published = news.published;
                    break;
                case 'summary':
                    row.summary = news.insights ? news.insights.summary : '';
                    break;
                case 'companies':
                    row.companies = news.insights ? news.insights.companies.join(', ') : '';
                    break;
                case 'keywords':
                    row.keywords = news.insights ? news.insights.keywords.join(', ') : '';
                    break;
                case 'impactScore':
                    row.impactScore = news.insights ? news.insights.impactScore : '';
                    break;
                case 'sentiment':
                    row.sentiment = news.insights ? news.insights.sentiment : '';
                    break;
            }
        });
        return row;
    });
    
    // Generate CSV
    const csv = Papa.unparse(csvData);
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `news-results-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    closeColumnSelectDialog();
}

function showSaveProjectDialog() {
    const dialog = document.getElementById('save-project-dialog');
    
    // Set default values
    document.getElementById('project-name').value = '';
    document.getElementById('project-description').value = '';
    document.getElementById('project-start-date').value = document.getElementById('start-date').value;
    document.getElementById('project-end-date').value = document.getElementById('end-date').value;
    document.getElementById('project-subject').value = 'News Insights Report';
    
    // Populate email groups
    const emailSelect = document.getElementById('project-email-group');
    emailSelect.innerHTML = emailGroups.map(group => 
        `<option value="${group.id}">${group.name}</option>`
    ).join('');
    
    dialog.classList.remove('hidden');
}

function closeSaveProjectDialog() {
    document.getElementById('save-project-dialog').classList.add('hidden');
}

function saveProject() {
    const name = document.getElementById('project-name').value.trim();
    if (!name) {
        alert('Please enter a project name');
        return;
    }
    
    const project = {
        id: Date.now(),
        name: name,
        description: document.getElementById('project-description').value,
        startDate: document.getElementById('project-start-date').value,
        endDate: document.getElementById('project-end-date').value,
        frequency: document.getElementById('project-frequency').value,
        emailGroupId: parseInt(document.getElementById('project-email-group').value),
        subject: document.getElementById('project-subject').value,
        keywords: [...searchKeywords],
        excludeKeywords: [...excludeKeywords],
        createdAt: new Date().toISOString(),
        lastRun: null,
        nextRun: calculateNextRun(document.getElementById('project-frequency').value)
    };
    
    projects.push(project);
    saveProjects();
    
    closeSaveProjectDialog();
    
    // Navigate to projects view
    navigateToView('projects');
    
    // Show success message
    alert('Project saved successfully!');
}

function calculateNextRun(frequency) {
    const now = new Date();
    switch (frequency) {
        case 'daily':
            return new Date(now.getTime() + 24 * 60 * 60 * 1000);
        case 'weekdays':
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            if (tomorrow.getDay() === 6) { // Saturday
                return new Date(now.getTime() + 48 * 60 * 60 * 1000); // Monday
            } else if (tomorrow.getDay() === 0) { // Sunday
                return new Date(now.getTime() + 24 * 60 * 60 * 1000); // Monday
            }
            return tomorrow;
        case 'weekly':
            return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        case 'monthly':
            return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        default:
            return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
}

function renderProjects() {
    const container = document.getElementById('projects-list');
    
    if (projects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📁</div>
                <h3>No projects yet</h3>
                <p>Create your first project from the GNews Source page</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = projects.map(project => `
        <div class="project-card">
            <h4>${project.name}</h4>
            <p>${project.description || 'No description'}</p>
            <div class="project-meta">
                <span><strong>Frequency:</strong> ${project.frequency}</span>
                <span><strong>Keywords:</strong> ${project.keywords.join(', ')}</span>
                <span><strong>Next Run:</strong> ${formatDate(project.nextRun)}</span>
            </div>
            <div class="project-actions">
                <button class="btn btn--secondary btn--sm" onclick="runProject(${project.id})">Run Now</button>
                <button class="btn btn--outline btn--sm" onclick="deleteProject(${project.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function runProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Simulate running the project
    console.log(`Running project: ${project.name}`);
    console.log(`Keywords: ${project.keywords.join(', ')}`);
    console.log(`Email Group: ${emailGroups.find(g => g.id === project.emailGroupId)?.name}`);
    
    // Update last run time
    project.lastRun = new Date().toISOString();
    project.nextRun = calculateNextRun(project.frequency);
    
    saveProjects();
    renderProjects();
    
    alert(`Project "${project.name}" executed successfully! Check console for details.`);
}

function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        projects = projects.filter(p => p.id !== projectId);
        saveProjects();
        renderProjects();
    }
}

function saveProjects() {
    localStorage.setItem('infopulse-projects', JSON.stringify(projects));
}

function loadProjects() {
    const saved = localStorage.getItem('infopulse-projects');
    if (saved) {
        projects = JSON.parse(saved);
    }
}

function populateEmailGroups() {
    // This would normally load from API
    renderEmailGroups();
}

function renderEmailGroups() {
    const container = document.getElementById('email-groups-list');
    
    container.innerHTML = emailGroups.map(group => `
        <div class="email-group-item">
            <div class="email-group-info">
                <h4>${group.name}</h4>
                <p>${group.emails.join(', ')}</p>
            </div>
            <div class="email-group-actions">
                <button class="btn btn--outline btn--sm" onclick="deleteEmailGroup(${group.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function showEmailGroupDialog() {
    const dialog = document.getElementById('email-group-dialog');
    document.getElementById('group-name').value = '';
    document.getElementById('group-emails').value = '';
    dialog.classList.remove('hidden');
}

function closeEmailGroupDialog() {
    document.getElementById('email-group-dialog').classList.add('hidden');
}

function saveEmailGroup() {
    const name = document.getElementById('group-name').value.trim();
    const emails = document.getElementById('group-emails').value.trim();
    
    if (!name || !emails) {
        alert('Please fill in all fields');
        return;
    }
    
    const emailList = emails.split(',').map(email => email.trim()).filter(email => email);
    
    const group = {
        id: Date.now(),
        name: name,
        emails: emailList
    };
    
    emailGroups.push(group);
    renderEmailGroups();
    closeEmailGroupDialog();
}

function deleteEmailGroup(groupId) {
    if (confirm('Are you sure you want to delete this email group?')) {
        emailGroups = emailGroups.filter(g => g.id !== groupId);
        renderEmailGroups();
    }
}

// Auto-save functionality simulation
setInterval(() => {
    projects.forEach(project => {
        if (new Date() >= new Date(project.nextRun)) {
            console.log(`Auto-running project: ${project.name}`);
            runProject(project.id);
        }
    });
}, 60000); // Check every minute