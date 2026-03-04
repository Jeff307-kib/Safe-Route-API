import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

class AuthHelper {
    constructor(baseUrl = API_BASE_URL) {
        this.baseUrl = baseUrl;
        this.token = null;
        this.user = null;
    }

    async register(userData) {
        try {
            const response = await axios.post(`${this.baseUrl}/users/register`, userData);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data || error.message };
        }
    }

    async login(credentials) {
        try {
            const response = await axios.post(`${this.baseUrl}/users/login`, credentials);
            
            if (response.data.success) {
                this.token = response.data.data.token;
                this.user = response.data.data.user;
                return { success: true, data: response.data };
            }
            
            return { success: false, error: 'Invalid response format' };
        } catch (error) {
            return { success: false, error: error.response?.data || error.message };
        }
    }

    getAuthHeaders() {
        if (!this.token) {
            throw new Error('No authentication token available. Please login first.');
        }
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }

    async makeAuthenticatedRequest(method, endpoint, data = null) {
        const headers = this.getAuthHeaders();
        
        try {
            const config = {
                method,
                url: `${this.baseUrl}${endpoint}`,
                headers
            };

            if (data) {
                config.data = data;
            }

            const response = await axios(config);
            return { success: true, data: response.data, status: response.status };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data || error.message, 
                status: error.response?.status 
            };
        }
    }

    async findUserByPhone(phoneNumber) {
        try {
            const response = await axios.get(`${this.baseUrl}/users`, {
                headers: this.getAuthHeaders(),
                params: { phoneNumber }
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data || error.message };
        }
    }

    // Test method to create a test user and login
    async setupTestUser() {
        const testUser = {
            fullName: 'Test User',
            email: 'test@example.com',
            phoneNumber: '+1234567890',
            password: 'password123'
        };

        const contactUser = {
            fullName: 'Emergency Contact',
            email: 'contact@example.com',
            phoneNumber: '+1987654321',
            password: 'password123'
        };

        console.log('🔧 Setting up test users...');
        
        // Register main user (might fail if already exists)
        const registerResult = await this.register(testUser);
        if (registerResult.success) {
            console.log('✅ Main test user registered successfully');
        } else {
            console.log('ℹ️  Main test user might already exist, trying login...');
        }

        // Register contact user (might fail if already exists)
        const registerContactResult = await this.register(contactUser);
        if (registerContactResult.success) {
            console.log('✅ Contact user registered successfully');
        } else {
            console.log('ℹ️  Contact user might already exist');
        }

        // Login main user
        const loginResult = await this.login({
            phoneNumber: testUser.phoneNumber,
            password: testUser.password
        });

        if (loginResult.success) {
            console.log('✅ Login successful');
            console.log(`User ID: ${this.user.user_id}`);
            this.contactUser = contactUser; // Store contact user data
            return true;
        } else {
            console.log('❌ Login failed:', loginResult.error);
            return false;
        }
    }
}

// Create a test function that uses the auth helper
async function runAuthenticatedTest() {
    console.log('🚀 Authenticated Trip Emergency Contacts Test');
    console.log('==============================================');
    
    const auth = new AuthHelper();
    
    // Setup authentication
    const authSuccess = await auth.setupTestUser();
    if (!authSuccess) {
        console.log('❌ Authentication setup failed. Cannot proceed with tests.');
        return;
    }

    // Now test emergency contact creation
    console.log('\n🧪 Testing Emergency Contact Creation...');
    
    // For testing, let's try to find any existing user to use as emergency contact
    // We'll use user ID 1 (assuming it exists) or create a simple test
    let contactUserId = 1; // Try with user ID 1 first
    
    // If we're user 1, use user 2
    if (contactUserId === auth.user.user_id) {
        contactUserId = 2;
    }
    
    console.log(`✅ Using contact user ID: ${contactUserId}`);
    
    const contactData = {
        userId: auth.user.user_id,
        contactUserId: contactUserId,
        relationship: 'friend'
    };

    const createResult = await auth.makeAuthenticatedRequest('POST', '/emergency-contacts', contactData);
    
    if (createResult.success) {
        console.log('✅ Emergency contact created successfully');
        const createdContactId = createResult.data.data.id;
        console.log('Contact ID:', createdContactId);
        
        // Test getting user contacts
        console.log('\n🧪 Testing Get User Contacts...');
        const getContactsResult = await auth.makeAuthenticatedRequest('GET', `/emergency-contacts/user/${auth.user.user_id}`);
        
        if (getContactsResult.success) {
            console.log('✅ User contacts retrieved successfully');
            console.log(`Found ${getContactsResult.data.data.length} contacts`);
            console.log('User contacts:', getContactsResult.data.data.map(c => ({ id: c.id, name: c.name })));
            
            // Test trip creation with the actual emergency contact ID
            if (getContactsResult.data.data.length > 0) {
                await testTripCreation(auth, createdContactId);
            }
        } else {
            console.log('❌ Failed to get user contacts:', getContactsResult.error);
        }
    } else {
        console.log('❌ Failed to create emergency contact:', createResult.error);
    }
}

async function testTripCreation(auth, contactId) {
    console.log('\n🧪 Testing Trip Creation with Emergency Contact...');
    
    const tripData = {
        userId: auth.user.user_id,
        startLocation: { latitude: 40.7128, longitude: -74.0060 },
        destinationLocation: { latitude: 40.7589, longitude: -73.9851 },
        durationMinutes: 30,
        selectedContactIds: [contactId]
    };

    const tripResult = await auth.makeAuthenticatedRequest('POST', '/trips', tripData);
    
    if (tripResult.success) {
        console.log('✅ Trip created successfully with emergency contact');
        console.log('Trip ID:', tripResult.data.data.trip.trip_id);
        
        // Test getting trip contacts
        const tripId = tripResult.data.data.trip.trip_id;
        const getTripContactsResult = await auth.makeAuthenticatedRequest('GET', `/trips/${tripId}/emergency-contacts`);
        
        if (getTripContactsResult.success) {
            console.log('✅ Trip emergency contacts retrieved successfully');
            console.log('Contacts:', getTripContactsResult.data.data);
        } else {
            console.log('❌ Failed to get trip contacts:', getTripContactsResult.error);
        }
    } else {
        console.log('❌ Failed to create trip:', tripResult.error);
    }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runAuthenticatedTest().catch(console.error);
}

export { AuthHelper, runAuthenticatedTest };
