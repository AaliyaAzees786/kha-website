// Initialize Contentful client
const client = contentful.createClient({
    space: 'wv6uydlm1qhl',
    accessToken: 'tOgS7tqVk2csnqP8jpTP6exImf9R7lNloU6Ba1gqVZw'
});

// Function to create event cards
function createEventCard(imageUrl, date) {
    console.log('Creating card with image URL:', imageUrl); // Debug log
    return `
        <div class="event-card">
            <img src="${imageUrl}" alt="Event flyer" onerror="console.error('Image failed to load:', this.src)">
            <div class="event-date">${new Date(date).toLocaleDateString()}</div>
        </div>
    `;
}
// Function to open the modal and display the image
function openModal(imageUrl) {
    const modal = document.getElementById('poster-modal');
    const modalImage = document.getElementById('modal-image');
    modalImage.src = imageUrl;
    modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('poster-modal');
    modal.style.display = 'none';
}

// Modify createEventCard to include onclick event for images
function createEventCard(imageUrl, date) {
    console.log('Creating card with image URL:', imageUrl); // Debug log
    return `
        <div class="event-card">
            <img src="${imageUrl}" alt="Event flyer" onclick="openModal('${imageUrl}')" onerror="console.error('Image failed to load:', this.src)">
            <div class="event-date">${new Date(date).toLocaleDateString()}</div>
        </div>
    `;
}


// Function to load events
async function loadEvents() {
    const upcomingEvents = document.querySelector('.events-section:first-of-type .events-grid');
    const pastEvents = document.querySelector('.events-section:last-of-type .events-grid');

    try {
        // Fetch entries of content type 'kha-events'
        const response = await client.getEntries({
            content_type: 'khaEvents' // Note: content type names are case-sensitive
        });

        console.log('Contentful Response:', response); // Debug log

        // Get current date for comparison
        const currentDate = new Date();

        // Process events and split into upcoming and past
        const events = response.items.map(item => {
            console.log('Processing item:', item); // Debug log
            
            // Get the image URL from the linked asset
            let imageUrl = null;
            if (item.fields.eventPoster && item.fields.eventPoster.fields) {
                imageUrl = 'https:' + item.fields.eventPoster.fields.file.url;
            } else if (item.fields.eventPoster && item.fields.eventPoster.fields) {
                // Try alternative field name
                imageUrl = 'https:' + item.fields.eventPoster.fields.file.url;
            }

            console.log('Extracted image URL:', imageUrl); // Debug log

            return {
                image: imageUrl,
                date: new Date(item.fields.date || item.fields.eventDate), // Try both field names
                title: item.fields.title
            };
        });

        console.log('Processed events:', events); // Debug log

        // Filter events into upcoming and past
        const upcomingEventsList = events.filter(event => event.date >= currentDate);
        const pastEventsList = events.filter(event => event.date < currentDate);

        // Sort events by date
        upcomingEventsList.sort((a, b) => a.date - b.date);
        pastEventsList.sort((a, b) => b.date - a.date);

        // Render upcoming events
        if (upcomingEvents) {
            upcomingEvents.innerHTML = upcomingEventsList
                .map(event => event.image ? createEventCard(event.image, event.date) : '')
                .join('');
            console.log('Rendered upcoming events:', upcomingEventsList.length); // Debug log
        }
        if(upcomingEventsList.length == 0){
           document.getElementById('events').textContent = "COMING SOON!!"
        }

        // Render past events
        if (pastEvents) {
            pastEvents.innerHTML = pastEventsList
                .map(event => event.image ? createEventCard(event.image, event.date) : '')
                .join('');
            console.log('Rendered past events:', pastEventsList.length); // Debug log
        }

    } catch (error) {
        console.error('Error fetching events from Contentful:', error);
        const errorMessage = '<div>Error loading events</div>';
        if (upcomingEvents) upcomingEvents.innerHTML = errorMessage;
        if (pastEvents) pastEvents.innerHTML = errorMessage;
    }
}

// Load events when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (typeof contentful === 'undefined') {
        console.error('Contentful SDK not loaded. Please include the Contentful script in your HTML.');
        return;
    }
    loadEvents();
});