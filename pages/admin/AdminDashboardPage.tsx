
import React, { useEffect } from 'react';
import { Order } from '../../types';
import { ShoppingBag, ListOrdered, DollarSign, CreditCard, LoaderCircle, TrendingUp, Users, ArrowUpRight } from 'lucide-react';
import { useAppStore } from '../../store';

const getStatusBadge = (status: Order['status']) => {
    const styles = {
        'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
        'Confirmed': 'bg-blue-100 text-blue-700 border-blue-200',
        'Shipped': 'bg-indigo-100 text-indigo-700 border-indigo-200',
        'Delivered': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'Cancelled': 'bg-rose-100 text-rose-700 border-rose-200',
    };
    const style = styles[status] || 'bg-slate-100 text-slate-700 border-slate-200';

    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${style}`}>
            {status}
        </span>
    );
}

const StatCard: React.FC<{ title: string, value: string, icon: React.ElementType, color: string, loading?: boolean }> = ({ title, value, icon: Icon, color, loading }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-white`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            {/* Fake trend indicator for visual appeal */}
            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" /> +2.4%
            </span>
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            {loading ? (
                 <div className="h-8 w-24 bg-slate-200 rounded animate-pulse mt-1"></div>
            ) : (
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
            )}
        </div>
    </div>
);

const AdminDashboardPage: React.FC = () => {
    const { dashboardStats, loadDashboardStats, navigate } = useAppStore();
    
    useEffect(() => {
        loadDashboardStats();
    }, [loadDashboardStats]);

    if (!dashboardStats) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <LoaderCircle className="w-12 h-12 text-pink-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                    <p className="text-slate-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex space-x-2">
                    <span className="text-xs font-medium bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 shadow-sm">
                        Last Updated: {new Date().toLocaleTimeString()}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Revenue" 
                    value={`৳${dashboardStats.totalRevenue.toLocaleString('en-IN')}`} 
                    icon={DollarSign} 
                    color="bg-emerald-500"
                />
                <StatCard 
                    title="Total Orders" 
                    value={dashboardStats.totalOrders.toString()} 
                    icon={ListOrdered} 
                    color="bg-blue-500"
                />
                <StatCard 
                    title="Products" 
                    value={dashboardStats.totalProducts.toString()} 
                    icon={ShoppingBag} 
                    color="bg-pink-500"
                />
                <StatCard 
                    title="Online Txns" 
                    value={dashboardStats.onlineTransactionsCount.toString()} 
                    icon={CreditCard} 
                    color="bg-violet-500"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="font-bold text-slate-800">Recent Orders</h2>
                        <button onClick={() => navigate('/admin/orders')} className="text-xs font-medium text-pink-600 hover:text-pink-700 flex items-center transition-colors">
                            View All <ArrowUpRight className="w-3 h-3 ml-1" />
                        </button>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">Order ID</th>
                                    <th className="px-6 py-3 font-semibold">Customer</th>
                                    <th className="px-6 py-3 font-semibold">Total</th>
                                    <th className="px-6 py-3 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {dashboardStats.recentOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => navigate('/admin/orders')}>
                                        <td className="px-6 py-4 font-medium text-slate-700 group-hover:text-pink-600 transition-colors">#{order.orderId || order.id}</td>
                                        <td className="px-6 py-4 text-slate-600">{order.customerName}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-800">৳{order.total.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(order.status)}
                                        </td>
                                    </tr>
                                ))}
                                {dashboardStats.recentOrders.length === 0 && (
                                    <tr><td colSpan={4} className="text-center py-8 text-slate-400">No recent orders found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                 <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="font-bold text-slate-800">Recent Transactions</h2>
                        <button onClick={() => navigate('/admin/payment-info')} className="text-xs font-medium text-pink-600 hover:text-pink-700 flex items-center transition-colors">
                            View All <ArrowUpRight className="w-3 h-3 ml-1" />
                        </button>
                    </div>
                    <div className="overflow-x-auto flex-1">
                         <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">ID</th>
                                    <th className="px-6 py-3 font-semibold">Customer</th>
                                    <th className="px-6 py-3 font-semibold">Amount</th>
                                    <th className="px-6 py-3 font-semibold">TxID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {dashboardStats.recentPayments.map(order => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/admin/payment-info')}>
                                        <td className="px-6 py-4 font-medium text-slate-700">#{order.orderId || order.id}</td>
                                        <td className="px-6 py-4 text-slate-600">{order.customerName}</td>
                                        <td className="px-6 py-4 font-semibold text-emerald-600">৳{order.paymentDetails?.amount?.toLocaleString() || order.total.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                                                {order.paymentDetails?.transactionId || 'N/A'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {dashboardStats.recentPayments.length === 0 && (
                                    <tr><td colSpan={4} className="text-center py-8 text-slate-400">No recent transactions found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
