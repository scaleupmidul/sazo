import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { LoaderCircle, Save, Plus, Trash2 } from 'lucide-react';
import { AppSettings, ShippingOption } from '../../types';

const AdminSettingsPage: React.FC = () => {
    const { settings, updateSettings, notify } = useAppStore();
    const [formData, setFormData] = useState<AppSettings | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        if (settings) {
            // Deep copy to avoid mutating store directly
            setFormData(JSON.parse(JSON.stringify(settings)));
        }
    }, [settings]);

    if (!formData) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoaderCircle className="w-8 h-8 animate-spin text-pink-600" />
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;
        
        setIsSaving(true);
        try {
            await updateSettings(formData);
        } catch (error) {
            // Error handling done in store/notify
        } finally {
            setIsSaving(false);
        }
    };

    // Helper for shipping options
    const updateShippingOption = (index: number, field: keyof ShippingOption, value: any) => {
        const newOptions = [...formData.shippingOptions];
        newOptions[index] = { ...newOptions[index], [field]: value };
        setFormData({ ...formData, shippingOptions: newOptions });
    };

    const addShippingOption = () => {
        const newId = Math.random().toString(36).substr(2, 9);
        setFormData({
            ...formData,
            shippingOptions: [...formData.shippingOptions, { id: newId, label: 'New Option', charge: 0 }]
        });
    };

    const removeShippingOption = (index: number) => {
        const newOptions = formData.shippingOptions.filter((_, i) => i !== index);
        setFormData({ ...formData, shippingOptions: newOptions });
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="flex border-b overflow-x-auto">
                    {['general', 'payment', 'shipping', 'contact', 'legal'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 font-medium text-sm capitalize whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-pink-600 text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-6">
                    {activeTab === 'general' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Arrivals Count (Home)</label>
                                    <input type="number" name="homepageNewArrivalsCount" value={formData.homepageNewArrivalsCount} onChange={handleChange} className="w-full p-2 border rounded bg-white text-black" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trending Products Count (Home)</label>
                                    <input type="number" name="homepageTrendingCount" value={formData.homepageTrendingCount} onChange={handleChange} className="w-full p-2 border rounded bg-white text-black" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Footer Description</label>
                                <textarea name="footerDescription" value={formData.footerDescription} onChange={handleChange} rows={3} className="w-full p-2 border rounded bg-white text-black"></textarea>
                            </div>
                             <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded">
                                <input type="checkbox" id="showCityField" name="showCityField" checked={formData.showCityField} onChange={handleChange} className="h-4 w-4 text-pink-600 rounded cursor-pointer" />
                                <label htmlFor="showCityField" className="text-sm font-medium text-gray-700 cursor-pointer">Show City/District Field in Checkout</label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payment' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="block text-sm font-medium text-gray-700 mb-2">Payment Method Availability</h3>
                                <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" name="codEnabled" checked={formData.codEnabled} onChange={handleChange} className="h-5 w-5 text-pink-600 rounded" />
                                        <span className="ml-3 text-sm text-black">Enable Cash on Delivery (COD)</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" name="onlinePaymentEnabled" checked={formData.onlinePaymentEnabled} onChange={handleChange} className="h-5 w-5 text-pink-600 rounded" />
                                        <span className="ml-3 text-sm text-black">Enable Online Payment (Bkash/Nagad)</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Online Payment Instructions (HTML Supported)</label>
                                <textarea name="onlinePaymentInfo" value={formData.onlinePaymentInfo} onChange={handleChange} rows={5} className="w-full p-2 border rounded font-mono text-sm bg-white text-black"></textarea>
                                <p className="text-xs text-gray-500 mt-1">Use &lt;br/&gt; for line breaks, &lt;b&gt;text&lt;/b&gt; for bold.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <div className="space-y-4">
                             <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">Shipping Options</h3>
                                <button type="button" onClick={addShippingOption} className="text-sm bg-pink-100 text-pink-700 px-3 py-1 rounded-full hover:bg-pink-200 flex items-center">
                                    <Plus className="w-4 h-4 mr-1" /> Add Option
                                </button>
                             </div>
                             {formData.shippingOptions.map((option, index) => (
                                 <div key={index} className="flex items-center gap-4 p-3 border rounded bg-gray-50">
                                     <div className="flex-1">
                                         <label className="block text-xs text-gray-500">Label</label>
                                         <input 
                                            type="text" 
                                            value={option.label} 
                                            onChange={(e) => updateShippingOption(index, 'label', e.target.value)}
                                            className="w-full p-2 border rounded bg-white text-black"
                                         />
                                     </div>
                                     <div className="w-32">
                                         <label className="block text-xs text-gray-500">Charge (৳)</label>
                                         <input 
                                            type="number" 
                                            value={option.charge} 
                                            onChange={(e) => updateShippingOption(index, 'charge', Number(e.target.value))}
                                            className="w-full p-2 border rounded bg-white text-black"
                                         />
                                     </div>
                                     <button type="button" onClick={() => removeShippingOption(index)} className="mt-4 text-red-500 hover:text-red-700 p-2">
                                         <Trash2 className="w-5 h-5" />
                                     </button>
                                 </div>
                             ))}
                             {formData.shippingOptions.length === 0 && (
                                 <p className="text-gray-500 text-sm italic text-center p-4">No shipping options configured. Add one to enable checkout.</p>
                             )}
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                    <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full p-2 border rounded bg-white text-black" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                                    <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full p-2 border rounded bg-white text-black" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                                    <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className="w-full p-2 border rounded bg-white text-black" />
                                </div>
                                <div className="flex items-end pb-3">
                                     <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" name="showWhatsAppButton" checked={formData.showWhatsAppButton} onChange={handleChange} className="h-4 w-4 text-pink-600 rounded" />
                                        <span className="ml-2 text-sm text-gray-700">Show WhatsApp Button</span>
                                    </label>
                                </div>
                             </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea name="contactAddress" value={formData.contactAddress} onChange={handleChange} rows={2} className="w-full p-2 border rounded bg-white text-black"></textarea>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'legal' && (
                         <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Privacy Policy</label>
                                <textarea name="privacyPolicy" value={formData.privacyPolicy} onChange={handleChange} rows={10} className="w-full p-2 border rounded font-mono text-sm bg-white text-black"></textarea>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-4 border-t">
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="bg-pink-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-pink-700 transition flex items-center space-x-2 disabled:bg-pink-400"
                        >
                            {isSaving ? <LoaderCircle className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
