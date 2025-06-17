document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const templateList = document.getElementById('templateList');
    const previewPane = document.getElementById('previewPane');
    const templateEditForm = document.getElementById('templateEditForm');
    const previewButton = document.getElementById('previewButton');
    const saveButton = document.getElementById('saveButton');
    
    // Form elements
    const templateTitle = document.getElementById('templateTitle');
    const mainImageUrl = document.getElementById('mainImageUrl');
    const emailContent = document.getElementById('emailContent');
    const buttonText = document.getElementById('buttonText');
    const buttonUrl = document.getElementById('buttonUrl');
    
    // Current template data
    let currentTemplate = null;
    let templates = [];
    
    // Fetch templates from the templates directory
    async function fetchTemplates() {
        try {
            // In a real application, this would be an API call
            // For now, we'll use a hardcoded list of templates
            templates = [
                {
                    id: 'template1',
                    name: 'Newsletter Template',
                    thumbnail: 'https://res.cloudinary.com/dokv06kao/image/upload/v1749534642/pixieset_logos/fbe2e634415c6028cee4c48b0e9926dd-large.jpg',
                    path: 'templates/template1.html'
                },
                {
                    id: 'template2',
                    name: 'Promotion Template',
                    thumbnail: 'https://res.cloudinary.com/dokv06kao/image/upload/v1749534642/pixieset_logos/ff0ddffea0d6ecfe56848aaa58f76771-large.jpg',
                    path: 'templates/template2.html'
                }
            ];
            
            renderTemplateList();
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    }
    
    // Render the template list
    function renderTemplateList() {
        templateList.innerHTML = '';
        
        templates.forEach(template => {
            const templateItem = document.createElement('div');
            templateItem.className = 'template-item';
            templateItem.dataset.id = template.id;
            
            templateItem.innerHTML = `
                <img src="${template.thumbnail}" alt="${template.name}">
                <h3>${template.name}</h3>
            `;
            
            templateItem.addEventListener('click', () => selectTemplate(template));
            
            templateList.appendChild(templateItem);
        });
    }
    
    // Select a template
    async function selectTemplate(template) {
        // Clear any previous selection
        document.querySelectorAll('.template-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Mark this template as selected
        document.querySelector(`.template-item[data-id="${template.id}"]`).classList.add('selected');
        
        try {
            // In a real application, this would fetch the template HTML
            // For now, we'll load it based on the template ID
            let templateHtml = '';
            
            if (template.id === 'template1') {
                templateHtml = await loadTemplate1();
            } else if (template.id === 'template2') {
                templateHtml = await loadTemplate2();
            }
            
            // Set current template and update the preview
            currentTemplate = {
                ...template,
                html: templateHtml
            };
            
            // Show the edit form
            templateEditForm.classList.remove('hidden');
            
            // Extract default values from the template
            const parser = new DOMParser();
            const doc = parser.parseFromString(templateHtml, 'text/html');
            
            // Populate form with template values
            templateTitle.value = doc.querySelector('.email-header h1')?.textContent || '';
            mainImageUrl.value = doc.querySelector('.email-image')?.src || '';
            emailContent.value = doc.querySelector('.email-text')?.textContent || '';
            buttonText.value = doc.querySelector('.email-button')?.textContent || '';
            buttonUrl.value = doc.querySelector('.email-button')?.href || '';
            
            // Update preview
            updatePreview();
            
        } catch (error) {
            console.error('Error loading template:', error);
        }
    }
    
    // Update the preview based on form values
    function updatePreview() {
        if (!currentTemplate) return;
        
        // Clone the template HTML
        let updatedHtml = currentTemplate.html;
        
        // Parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(updatedHtml, 'text/html');
        
        // Update values
        const headerTitle = doc.querySelector('.email-header h1');
        if (headerTitle) headerTitle.textContent = templateTitle.value;
        
        const image = doc.querySelector('.email-image');
        if (image && mainImageUrl.value) image.src = mainImageUrl.value;
        
        const content = doc.querySelector('.email-text');
        if (content) content.textContent = emailContent.value;
        
        const button = doc.querySelector('.email-button');
        if (button) {
            button.textContent = buttonText.value;
            button.href = buttonUrl.value;
        }
        
        // Update preview
        previewPane.innerHTML = doc.body.innerHTML;
    }
    
    // Save the template
    function saveTemplate() {
        if (!currentTemplate) return;
        
        // In a real application, this would save to the server
        alert('Template saved successfully!');
        
        // Here you would implement the actual save functionality
        console.log('Template data to save:', {
            id: currentTemplate.id,
            title: templateTitle.value,
            imageUrl: mainImageUrl.value,
            content: emailContent.value,
            buttonText: buttonText.value,
            buttonUrl: buttonUrl.value
        });
    }
    
    // Template loaders (simulating fetching templates)
    async function loadTemplate1() {
        return `
        <div class="email-template">
            <div class="email-header">
                <h1>Monthly Newsletter</h1>
            </div>
            <div class="email-content">
                <img class="email-image" src="https://res.cloudinary.com/dokv06kao/image/upload/v1749534642/pixieset_logos/fbe2e634415c6028cee4c48b0e9926dd-large.jpg" alt="Newsletter Header">
                <div class="email-text">
                    Welcome to our monthly newsletter! Here you'll find all the latest updates and news about our products and services.
                </div>
                <a href="https://example.com" class="email-button">Read More</a>
            </div>
            <div class="email-footer">
                © 2025 Your Company. All rights reserved.
            </div>
        </div>
        `;
    }
    
    async function loadTemplate2() {
        return `
        <div class="email-template">
            <div class="email-header">
                <h1>Special Promotion</h1>
            </div>
            <div class="email-content">
                <img class="email-image" src="https://res.cloudinary.com/dokv06kao/image/upload/v1749534642/pixieset_logos/ff0ddffea0d6ecfe56848aaa58f76771-large.jpg" alt="Promotion Banner">
                <div class="email-text">
                    Don't miss out on our limited-time offer! Get 25% off on all products until the end of the month.
                </div>
                <a href="https://example.com/promo" class="email-button">Shop Now</a>
            </div>
            <div class="email-footer">
                © 2025 Your Company. All rights reserved.
            </div>
        </div>
        `;
    }
    
    // Event listeners
    previewButton.addEventListener('click', updatePreview);
    saveButton.addEventListener('click', saveTemplate);
    
    // Initialize
    fetchTemplates();
});