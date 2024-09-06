import { useState } from 'react';

interface UserFormData {
  companyName: string;
  taxId: string;
  address: string;
  contactPhone: string;
  companyEmail: string;
  website?: string;
  legalRepresentative: string;
  legalRepId: string;
  legalRepEmail: string;
  legalRepPhone: string;
  associatedPartner?: string;
}

const UserForm: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>({
    companyName: '',
    taxId: '',
    address: '',
    contactPhone: '',
    companyEmail: '',
    website: '',
    legalRepresentative: '',
    legalRepId: '',
    legalRepEmail: '',
    legalRepPhone: '',
    associatedPartner: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Guardar el companyName en localStorage
    if (name === 'companyName') {
      localStorage.setItem('companyName', value);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const URL = import.meta.env.VITE_APP_API_EXPRESS;
      const response = await fetch(`${URL}/installer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      window.alert('User Created')
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">PROFILE INSTALLER</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Tax ID (NIT)</label>
          <input
            type="text"
            name="taxId"
            value={formData.taxId}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Contact Phone</label>
          <input
            type="text"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Company Email</label>
          <input
            type="email"
            name="companyEmail"
            value={formData.companyEmail}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Website (Optional)</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <h2 className="text-xl font-semibold mt-6">Legal Representative</h2>

        <div>
          <label className="block text-gray-700">Legal Representative Name</label>
          <input
            type="text"
            name="legalRepresentative"
            value={formData.legalRepresentative}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Legal Rep ID</label>
          <input
            type="text"
            name="legalRepId"
            value={formData.legalRepId}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Legal Rep Email</label>
          <input
            type="email"
            name="legalRepEmail"
            value={formData.legalRepEmail}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Legal Rep Phone</label>
          <input
            type="text"
            name="legalRepPhone"
            value={formData.legalRepPhone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Associated Partner (Optional)</label>
          <input
            type="text"
            name="associatedPartner"
            value={formData.associatedPartner}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserForm;
