export default class ContactHelper {
    
    static formatContactResponse(contact) {
        return {
            id: contact.id || contact.contact_id,
            name: contact.full_name || contact.name,
            phone: contact.phone_number || contact.phone,
            relationship: contact.relationship,
            createdAt: contact.created_at
        };
    }

     //Transforms tripId and [id1, id2] into [[tripId, id1], [tripId, id2]]
    
    static prepareBulkTripContacts(tripId, contactIds) {
        if (!Array.isArray(contactIds)) return [];
        return contactIds.map(contactId => [tripId, contactId]);
    }
}