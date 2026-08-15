import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultContactsData from '../data/contacts.json';

export interface Contact {
  id: string;
  fullName: string;
  specialty?: string;
  licenseNumber?: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  province?: string;
  notes?: string;
  createdAt: string;
  timestamp: number;
}

interface ContactsContextType {
  contacts: Contact[];
  addContact: (contactData: Omit<Contact, 'id' | 'createdAt' | 'timestamp'>) => Contact;
  updateContact: (id: string, updatedData: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  saveContactFromOrder: (orderData: {
    fullName: string;
    phone: string;
    email?: string;
    specialty?: string;
    licenseNumber?: string;
    address?: string;
    city?: string;
    province?: string;
  }) => Contact;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const ContactsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getDeletedContactIds = (): Set<string> => {
    try {
      const saved = localStorage.getItem('latmedical_deleted_contact_ids');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  };

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const deletedIds = getDeletedContactIds();
    const isV1 = localStorage.getItem('latmedical_contacts_v1');
    if (!isV1) {
      localStorage.setItem('latmedical_contacts_v1', 'true');
      const filteredDefaults = (defaultContactsData as Contact[]).filter(c => !deletedIds.has(c.id));
      localStorage.setItem('latmedical_contacts', JSON.stringify(filteredDefaults));
      return filteredDefaults;
    }
    const saved = localStorage.getItem('latmedical_contacts');
    const initial: Contact[] = saved ? JSON.parse(saved) : (defaultContactsData as Contact[]);
    return initial.filter(c => c && c.id && !deletedIds.has(c.id));
  });

  // Sync contacts remotely
  useEffect(() => {
    fetch(`/api/data/contacts.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const deletedIds = getDeletedContactIds();
          setContacts((prev) => {
            const map = new Map<string, Contact>();
            prev.forEach((c) => {
              if (c && c.id && !deletedIds.has(c.id)) map.set(c.id, c);
            });
            data.forEach((c: Contact) => {
              if (c && c.id && !deletedIds.has(c.id)) map.set(c.id, c);
            });
            const merged = Array.from(map.values());
            localStorage.setItem('latmedical_contacts', JSON.stringify(merged));
            return merged;
          });
        }
      })
      .catch((err) => console.error('Error syncing remote contacts:', err));
  }, []);

  useEffect(() => {
    localStorage.setItem('latmedical_contacts', JSON.stringify(contacts));
    fetch('/api/save-contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contacts, null, 2)
    }).catch((err) => console.error('Error saving contacts:', err));
  }, [contacts]);

  const addContact = (contactData: Omit<Contact, 'id' | 'createdAt' | 'timestamp'>): Contact => {
    const newId = `CNT-${Math.floor(100000 + Math.random() * 900000)}`;
    const deletedIds = getDeletedContactIds();
    if (deletedIds.has(newId)) {
      deletedIds.delete(newId);
      localStorage.setItem('latmedical_deleted_contact_ids', JSON.stringify(Array.from(deletedIds)));
    }

    const newContact: Contact = {
      ...contactData,
      id: newId,
      createdAt: new Date().toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      timestamp: Date.now()
    };

    setContacts((prev) => [newContact, ...prev]);
    return newContact;
  };

  const updateContact = (id: string, updatedData: Partial<Contact>) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
  };

  const deleteContact = (id: string) => {
    const deletedIds = getDeletedContactIds();
    deletedIds.add(id);
    localStorage.setItem('latmedical_deleted_contact_ids', JSON.stringify(Array.from(deletedIds)));

    setContacts((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      localStorage.setItem('latmedical_contacts', JSON.stringify(updated));
      return updated;
    });
  };

  // Automatically creates or updates contact when a client places an order
  const saveContactFromOrder = (orderData: {
    fullName: string;
    phone: string;
    email?: string;
    specialty?: string;
    licenseNumber?: string;
    address?: string;
    city?: string;
    province?: string;
  }): Contact => {
    const trimmedName = orderData.fullName.trim();
    if (!trimmedName) {
      throw new Error('El nombre del cliente no puede estar vacío');
    }

    // Try to match by phone or normalized full name
    const existingIndex = contacts.findIndex(
      (c) =>
        (orderData.phone && orderData.phone.replace(/\D/g, '') !== '' && c.phone && c.phone.replace(/\D/g, '') === orderData.phone.replace(/\D/g, '')) ||
        c.fullName.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (existingIndex >= 0) {
      const existing = contacts[existingIndex];
      const updated: Contact = {
        ...existing,
        fullName: trimmedName,
        phone: orderData.phone || existing.phone,
        email: orderData.email || existing.email,
        specialty: orderData.specialty || existing.specialty,
        licenseNumber: orderData.licenseNumber || existing.licenseNumber,
        address: orderData.address || existing.address,
        city: orderData.city || existing.city,
        province: orderData.province || existing.province
      };

      setContacts((prev) =>
        prev.map((c, idx) => (idx === existingIndex ? updated : c))
      );
      return updated;
    } else {
      return addContact({
        fullName: trimmedName,
        phone: orderData.phone || '',
        email: orderData.email || undefined,
        specialty: orderData.specialty || 'Médico / Clínica B2B',
        licenseNumber: orderData.licenseNumber || undefined,
        address: orderData.address || undefined,
        city: orderData.city || 'CABA',
        province: orderData.province || 'Buenos Aires',
        notes: 'Registrado automáticamente desde pedido B2B'
      });
    }
  };

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        addContact,
        updateContact,
        deleteContact,
        saveContactFromOrder
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error('useContacts debe utilizarse dentro de un ContactsProvider');
  }
  return context;
};
