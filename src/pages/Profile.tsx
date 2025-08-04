import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAccount } from 'wagmi';

interface RootState {
  auth: {
    user: {
      name?: string;
      bio?: string;
      linkedinUrl?: string;
      walletAddress?: string;
      location?: string;
      experience?: string;
      skills?: string[];
    };
  };
}

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const { address } = useAccount();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    linkedinUrl: user?.linkedinUrl || '',
    walletAddress: user?.walletAddress || address || '',
    location: user?.location || '',
    experience: user?.experience || 'entry',
    skills: user?.skills?.join(', ') || ''
  });

  useEffect(() => {
    if (address && !formData.walletAddress) {
      setFormData((prev) => ({ ...prev, walletAddress: address }));
    }
  }, [address]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/users/profile`,
        {
          ...formData,
          skills: formData.skills.split(',').map((skill: string) => skill.trim())
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Profile updated!');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Profile update failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Bio"
          className="w-full p-2 border rounded"
        />
        <input
          type="url"
          name="linkedinUrl"
          value={formData.linkedinUrl}
          onChange={handleChange}
          placeholder="LinkedIn URL"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="walletAddress"
          value={formData.walletAddress}
          onChange={handleChange}
          placeholder="Wallet Address"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full p-2 border rounded"
        />
        <select
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="entry">Entry</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="Skills (comma-separated)"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default Profile;
