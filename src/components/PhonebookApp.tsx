import { useState } from 'react';

type Contact = {
  id: number;
  name: string;
  phone: string;
};

export default function PhonebookApp() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [form, setForm] = useState({ name: '', phone: '' });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '' });

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;
    const [, area, prefix, line] = match;
    let formatted = '';
    if (area) formatted += `(${area}`;
    if (area && area.length === 3) formatted += `) `;
    if (prefix) formatted += prefix;
    if (prefix && prefix.length === 3) formatted += `-`;
    if (line) formatted += line;
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatPhoneNumber(rawValue);
    setForm({ ...form, phone: formatted });
  };

  const handleEditPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatPhoneNumber(rawValue);
    setEditForm({ ...editForm, phone: formatted });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContacts([...contacts, { id: Date.now(), ...form }]);
    setForm({ name: '', phone: '' });
  };

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setEditForm({ name: contact.name, phone: contact.phone });
    setShowEditModal(true);
  };

  const handleDelete = (contact: Contact) => {
    setSelectedContact(contact);
    setShowDeleteModal(true);
  };

  return (
    <div className="phonebook-app">
      <h2>📒 Phonebook</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={handlePhoneChange}
          pattern="\(\d{3}\) \d{3}-\d{4}"
          maxLength={14}
          required
        />
        <button type="submit">Add Contact</button>
      </form>

      {/* CONTACT LIST */}
      <ul>
        {contacts.map((c) => (
          <li key={c.id}>
            <div>
              <strong>{c.name}</strong>
              <br />
              <span>{c.phone}</span>
            </div>
            <div>
              <button className="edit" onClick={() => handleEdit(c)}>
                ✏️
              </button>
              <button className="delete" onClick={() => handleDelete(c)}>
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* ✏️ EDIT MODAL */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Contact</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedContact) {
                  setContacts(
                    contacts.map((c) =>
                      c.id === selectedContact.id
                        ? { ...c, ...editForm }
                        : c
                    )
                  );
                  setSelectedContact(null);
                  setShowEditModal(false);
                }
              }}
            >
              <input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                required
              />
              <input
                type="tel"
                value={editForm.phone}
                onChange={handleEditPhoneChange}
                required
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ❌ DELETE MODAL */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to delete this contact?</h3>
            <p>{selectedContact?.name}</p>
            <div className="modal-actions">
              <button
                onClick={() => {
                  if (selectedContact) {
                    setContacts(
                      contacts.filter((c) => c.id !== selectedContact.id)
                    );
                    setShowDeleteModal(false);
                    setSelectedContact(null);
                  }
                }}
              >
                Yes, Delete
              </button>
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
